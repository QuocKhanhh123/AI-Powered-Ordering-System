import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    User,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    DollarSign,
    Ban,
    CheckCircle,
    UserPlus,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import apiClient from '../../lib/api';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../components/ui/alert-dialog';

function getStatusBadge(status) {
    const config = {
        active: { label: 'Hoạt động', color: 'bg-green-100 text-green-800 border-green-200' },
        inactive: { label: 'Không hoạt động', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        blocked: { label: 'Bị khóa', color: 'bg-red-100 text-red-800 border-red-200' }
    };

    const statusConfig = config[status] || config.active;
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
}

function getCustomerTier(totalSpent) {
    if (totalSpent >= 3000000) return { label: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 1500000) return { label: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 500000) return { label: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { label: 'Bronze', color: 'bg-orange-100 text-orange-800' };
}

function CustomerCard({ customer, onView, onEdit, onToggleStatus }) {
    const totalSpent = customer.stats?.totalSpent || 0;
    const totalOrders = customer.stats?.totalOrders || 0;
    const tier = getCustomerTier(totalSpent);

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(customer)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback>{customer.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => onView(customer)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Xem Chi Tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(customer)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Chỉnh Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onToggleStatus(customer)}
                                className={customer.status === 'blocked' ? 'text-green-600' : 'text-red-600'}
                            >
                                {customer.status === 'blocked' ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mở Khóa
                                    </>
                                ) : (
                                    <>
                                        <Ban className="w-4 h-4 mr-2" />
                                        Khóa Tài Khoản
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {getStatusBadge(customer.status)}
                        <Badge className={tier.color}>{tier.label}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-gray-500" />
                            <span>{totalOrders} đơn hàng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>{totalSpent.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Tham gia: {new Date(customer.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    {customer.preferences?.favoriteDishes?.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Sản phẩm yêu thích:</p>
                            <div className="flex flex-wrap gap-1">
                                {customer.preferences.favoriteDishes.slice(0, 2).map((dish, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {dish.name}
                                    </Badge>
                                ))}
                                {customer.preferences.favoriteDishes.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{customer.preferences.favoriteDishes.length - 2}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('customer');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const [confirmDialog, setConfirmDialog] = useState({ open: false, customer: null, action: '' });
    const [editDialog, setEditDialog] = useState({ open: false, customer: null });
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        roles: [],
        status: 'active'
    });

    // Fetch customers from API
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                role: roleFilter,
            });

            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            if (searchTerm) {
                params.append('search', searchTerm);
            }

            const response = await apiClient.get(`/api/admin/users?${params.toString()}`);

            if (response.success) {
                // Fetch stats for each customer
                const customersWithStats = await Promise.all(
                    response.data.map(async (user) => {
                        try {
                            const detailResponse = await apiClient.post('/api/admin/users/detail', { id: user._id });
                            return {
                                ...user,
                                stats: detailResponse.data?.stats,
                                preferences: detailResponse.data?.preferences
                            };
                        } catch (error) {
                            return {
                                ...user,
                                stats: { totalOrders: 0, completedOrders: 0, totalSpent: 0 },
                                preferences: null
                            };
                        }
                    })
                );

                setCustomers(customersWithStats);
                setFilteredCustomers(customersWithStats);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Không thể tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchCustomers();
    }, [pagination.page, statusFilter, roleFilter]);

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pagination.page === 1) {
                fetchCustomers();
            } else {
                setPagination(prev => ({ ...prev, page: 1 }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleToggleStatus = (customer) => {
        const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
        const action = newStatus === 'blocked' ? 'khóa' : 'mở khóa';

        setConfirmDialog({
            open: true,
            customer,
            action: newStatus,
            message: `Bạn có chắc muốn ${action} tài khoản "${customer.name}"?`
        });
    };

    const confirmToggleStatus = async () => {
        const { customer, action } = confirmDialog;

        try {
            const response = await apiClient.put('/api/admin/users/status', {
                id: customer._id,
                status: action
            });

            if (response.success) {
                toast.success(`Đã ${action === 'blocked' ? 'khóa' : 'mở khóa'} tài khoản thành công`);
                fetchCustomers();
                if (selectedCustomerDetail?._id === customer._id) {
                    setSelectedCustomerDetail(null);
                }
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error(error.message || 'Không thể cập nhật trạng thái tài khoản');
        } finally {
            setConfirmDialog({ open: false, customer: null, action: '' });
        }
    };

    const handleEdit = (customer) => {
        setEditForm({
            name: customer.name || customer.user?.name || '',
            email: customer.email || customer.user?.email || '',
            phone: customer.phone || customer.user?.phone || '',
            roles: customer.roles || customer.user?.roles || ['customer'],
            status: customer.status || customer.user?.status || 'active'
        });
        setEditDialog({ open: true, customer });
    };

    const handleSaveEdit = async () => {
        const customer = editDialog.customer;

        try {
            setLoading(true);

            // Update roles if changed
            const currentRoles = customer.roles || customer.user?.roles || [];
            if (JSON.stringify(editForm.roles.sort()) !== JSON.stringify(currentRoles.sort())) {
                await apiClient.put('/api/admin/users/roles', {
                    id: customer._id,
                    roles: editForm.roles
                });
            }

            // Update status if changed
            const currentStatus = customer.status || customer.user?.status;
            if (editForm.status !== currentStatus) {
                await apiClient.put('/api/admin/users/status', {
                    id: customer._id,
                    status: editForm.status
                });
            }

            toast.success('Cập nhật thông tin khách hàng thành công');
            setEditDialog({ open: false, customer: null });
            fetchCustomers();

            // Update detail view if open
            if (selectedCustomerDetail?._id === customer._id) {
                setSelectedCustomerDetail(null);
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            toast.error(error.message || 'Không thể cập nhật thông tin khách hàng');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = (role) => {
        setEditForm(prev => {
            const roles = prev.roles.includes(role)
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            return { ...prev, roles };
        });
    };

    const handleView = async (customer) => {
        try {
            setLoading(true);
            const response = await apiClient.post('/api/admin/users/detail', { id: customer._id });

            if (response.success) {
                setSelectedCustomerDetail({
                    ...customer,
                    ...response.data
                });
            }
        } catch (error) {
            console.error('Error fetching customer detail:', error);
            toast.error('Không thể tải thông tin chi tiết khách hàng');
        } finally {
            setLoading(false);
        }
    };

    // Stats calculation
    const stats = {
        total: pagination.total,
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        blocked: customers.filter(c => c.status === 'blocked').length,
        totalRevenue: customers.reduce((sum, c) => sum + (c.stats?.totalSpent || 0), 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
                    <p className="text-gray-600">Theo dõi và quản lý thông tin khách hàng</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchCustomers} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Làm Mới
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng Khách Hàng</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hoạt Động</p>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Không Hoạt Động</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.inactive}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Bị Khóa</p>
                                <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
                            </div>
                            <Ban className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {(stats.totalRevenue / 1000000).toFixed(1)}M
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                                <SelectItem value="blocked">Bị khóa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Customers Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
            ) : filteredCustomers.length > 0 ? (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredCustomers.map((customer) => (
                            <CustomerCard
                                key={customer._id}
                                customer={customer}
                                onView={handleView}
                                onEdit={handleEdit}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} khách hàng
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1 || loading}
                                >
                                    Trang trước
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages || loading}
                                >
                                    Trang sau
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khách hàng</h3>
                        <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                        <Button variant="outline" onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                        }}>
                            Xóa Bộ Lọc
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Customer Detail Modal */}
            <Dialog open={!!selectedCustomerDetail} onOpenChange={() => setSelectedCustomerDetail(null)}>
                <DialogContent className="!max-w-[50vw] !w-[50vw] max-h-[92vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Chi Tiết Khách Hàng</DialogTitle>
                    </DialogHeader>

                    {selectedCustomerDetail && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="flex items-center gap-5">
                                    <Avatar className="w-20 h-20">
                                        <AvatarFallback className="text-2xl">
                                            {selectedCustomerDetail.user?.name?.charAt(0) || selectedCustomerDetail.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold">
                                            {selectedCustomerDetail.user?.name || selectedCustomerDetail.name}
                                        </h3>
                                        <div className="flex gap-2 mt-2">
                                            {getStatusBadge(selectedCustomerDetail.user?.status || selectedCustomerDetail.status)}
                                            {(() => {
                                                const totalSpent = selectedCustomerDetail.stats?.totalSpent || 0;
                                                const tier = getCustomerTier(totalSpent);
                                                return <Badge className={tier.color}>{tier.label}</Badge>;
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-base font-medium text-gray-600">Email:</label>
                                        <p className="text-base mt-1">{selectedCustomerDetail.user?.email || selectedCustomerDetail.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-600">Số điện thoại:</label>
                                        <p className="text-base mt-1">{selectedCustomerDetail.user?.phone || selectedCustomerDetail.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-600">Vai trò:</label>
                                        <div className="flex gap-2 mt-2">
                                            {(selectedCustomerDetail.user?.roles || selectedCustomerDetail.roles || []).map((role, index) => (
                                                <Badge key={index} variant="outline" className="text-sm">{role}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-600">Ngày tham gia:</label>
                                        <p className="text-base mt-1">{new Date(selectedCustomerDetail.user?.createdAt || selectedCustomerDetail.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-5 text-center">
                                            <p className="text-3xl font-bold text-blue-600">
                                                {selectedCustomerDetail.stats?.totalOrders || 0}
                                            </p>
                                            <p className="text-base text-gray-600 mt-1">Tổng đơn hàng</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-5 text-center">
                                            <p className="text-3xl font-bold text-green-600">
                                                {((selectedCustomerDetail.stats?.totalSpent || 0) / 1000000).toFixed(1)}M
                                            </p>
                                            <p className="text-base text-gray-600 mt-1">Tổng chi tiêu</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-5 text-center">
                                            <p className="text-3xl font-bold text-purple-600">
                                                {selectedCustomerDetail.stats?.completedOrders || 0}
                                            </p>
                                            <p className="text-base text-gray-600 mt-1">Đơn hoàn thành</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-5 text-center">
                                            <p className="text-3xl font-bold text-orange-600">
                                                {selectedCustomerDetail.stats?.totalOrders > 0
                                                    ? ((selectedCustomerDetail.stats?.totalSpent || 0) / selectedCustomerDetail.stats.totalOrders / 1000).toFixed(0)
                                                    : 0}k
                                            </p>
                                            <p className="text-base text-gray-600 mt-1">Giá trị TB</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {selectedCustomerDetail.preferences?.favoriteDishes?.length > 0 && (
                                    <div>
                                        <label className="text-base font-medium text-gray-600">Sản phẩm yêu thích:</label>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedCustomerDetail.preferences.favoriteDishes.map((dish, index) => (
                                                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                                    {dish.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-6 mt-6 border-t">
                        <Button onClick={() => handleEdit(selectedCustomerDetail)} className="flex-1 h-11 text-base">
                            <Edit className="w-5 h-5 mr-2" />
                            Chỉnh Sửa
                        </Button>
                        <Button
                            variant={selectedCustomerDetail?.status === 'blocked' ? 'default' : 'destructive'}
                            onClick={() => {
                                handleToggleStatus(selectedCustomerDetail);
                            }}
                            className="h-11 text-base px-6"
                        >
                            {selectedCustomerDetail?.status === 'blocked' ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Mở Khóa
                                </>
                            ) : (
                                <>
                                    <Ban className="w-5 h-5 mr-2" />
                                    Khóa Tài Khoản
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Dialog */}
            <Dialog open={editDialog.open} onOpenChange={(open) => !open && setEditDialog({ open: false, customer: null })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Chỉnh Sửa Thông Tin Khách Hàng</DialogTitle>
                        <DialogDescription>
                            Cập nhật vai trò và trạng thái tài khoản
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Customer Info - Read Only */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarFallback>
                                        {editForm.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{editForm.name}</p>
                                    <p className="text-sm text-gray-600">{editForm.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{editForm.phone}</span>
                            </div>
                        </div>

                        {/* Roles Selection */}
                        <div className="space-y-3">
                            <label className="text-base font-medium text-gray-900">Vai Trò</label>
                            <div className="flex flex-wrap gap-3">
                                <div
                                    onClick={() => toggleRole('customer')}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${editForm.roles.includes('customer')
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${editForm.roles.includes('customer') ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}>
                                        {editForm.roles.includes('customer') && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">Customer</span>
                                </div>

                                <div
                                    onClick={() => toggleRole('admin')}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${editForm.roles.includes('admin')
                                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${editForm.roles.includes('admin') ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                        }`}>
                                        {editForm.roles.includes('admin') && (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <UserPlus className="w-4 h-4" />
                                    <span className="font-medium">Admin</span>
                                </div>
                            </div>
                            {editForm.roles.length === 0 && (
                                <p className="text-sm text-red-600">Vui lòng chọn ít nhất một vai trò</p>
                            )}
                        </div>

                        {/* Status Selection */}
                        <div className="space-y-3">
                            <label className="text-base font-medium text-gray-900">Trạng Thái Tài Khoản</label>
                            <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                                <SelectTrigger className="w-full h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Hoạt động</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="blocked">
                                        <div className="flex items-center gap-2">
                                            <Ban className="w-4 h-4 text-red-600" />
                                            <span>Bị khóa</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setEditDialog({ open: false, customer: null })}
                            className="flex-1 h-11"
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            className="flex-1 h-11"
                            disabled={loading || editForm.roles.length === 0}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Lưu Thay Đổi
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false, customer: null, action: '' })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmDialog.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmToggleStatus}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
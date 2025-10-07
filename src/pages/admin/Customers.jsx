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
    UserPlus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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

// Mock data - trong thực tế sẽ lấy từ API
const mockCustomers = [
    {
        id: 'CUST001',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
        joinDate: '2023-12-15',
        status: 'active',
        totalOrders: 15,
        totalSpent: 2450000,
        lastOrderDate: '2024-01-20',
        averageOrderValue: 163333,
        loyaltyPoints: 245,
        preferredProducts: ['Phở Bò', 'Bánh Mì'],
        notes: 'Khách hàng VIP, thường đặt cho cả gia đình'
    },
    {
        id: 'CUST002',
        fullName: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        address: '456 Lê Lợi, Quận 3, TP.HCM',
        joinDate: '2024-01-05',
        status: 'active',
        totalOrders: 8,
        totalSpent: 890000,
        lastOrderDate: '2024-01-19',
        averageOrderValue: 111250,
        loyaltyPoints: 89,
        preferredProducts: ['Cơm Tấm', 'Bánh Mì'],
        notes: ''
    },
    {
        id: 'CUST003',
        fullName: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0369852147',
        address: '789 Võ Văn Tần, Quận 5, TP.HCM',
        joinDate: '2023-11-20',
        status: 'inactive',
        totalOrders: 23,
        totalSpent: 3680000,
        lastOrderDate: '2023-12-28',
        averageOrderValue: 160000,
        loyaltyPoints: 368,
        preferredProducts: ['Phở Bò', 'Bún Bò Huế', 'Chả Cá'],
        notes: 'Khách hàng từng phản hồi về chất lượng'
    },
    {
        id: 'CUST004',
        fullName: 'Phạm Thị D',
        email: 'phamthid@email.com',
        phone: '0456789123',
        address: '321 Điện Biên Phủ, Quận 10, TP.HCM',
        joinDate: '2024-01-10',
        status: 'blocked',
        totalOrders: 3,
        totalSpent: 195000,
        lastOrderDate: '2024-01-12',
        averageOrderValue: 65000,
        loyaltyPoints: 0,
        preferredProducts: [],
        notes: 'Bị khóa do vi phạm chính sách thanh toán'
    }
];

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
    const tier = getCustomerTier(customer.totalSpent);

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{customer.fullName}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                            <span>{customer.totalOrders} đơn hàng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span>{customer.totalSpent.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>Tham gia: {new Date(customer.joinDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>

                    {customer.preferredProducts.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Sản phẩm yêu thích:</p>
                            <div className="flex flex-wrap gap-1">
                                {customer.preferredProducts.slice(0, 2).map((product, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        {product}
                                    </Badge>
                                ))}
                                {customer.preferredProducts.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{customer.preferredProducts.length - 2}
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
    const [customers, setCustomers] = useState(mockCustomers);
    const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [viewMode, setViewMode] = useState('cards'); // 'cards' hoặc 'table'

    // Filter logic
    useEffect(() => {
        let filtered = customers;

        if (searchTerm) {
            filtered = filtered.filter(customer =>
                customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(customer => customer.status === statusFilter);
        }

        setFilteredCustomers(filtered);
    }, [customers, searchTerm, statusFilter]);

    const handleToggleStatus = (customer) => {
        const newStatus = customer.status === 'blocked' ? 'active' : 'blocked';
        const action = newStatus === 'blocked' ? 'khóa' : 'mở khóa';

        if (window.confirm(`Bạn có chắc muốn ${action} tài khoản "${customer.fullName}"?`)) {
            setCustomers(prev => prev.map(c =>
                c.id === customer.id ? { ...c, status: newStatus } : c
            ));
        }
    };

    const handleEdit = (customer) => {
        console.log('Edit customer:', customer);
        // Implement edit functionality
    };

    const handleView = (customer) => {
        setSelectedCustomer(customer);
    };

    // Stats calculation
    const stats = {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        blocked: customers.filter(c => c.status === 'blocked').length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
                    <p className="text-gray-600">Theo dõi và quản lý thông tin khách hàng</p>
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm Khách Hàng
                </Button>
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
            {filteredCustomers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCustomers.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onView={handleView}
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
                </div>
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
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Chi Tiết Khách Hàng</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                                ×
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback className="text-xl">
                                            {selectedCustomer.fullName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedCustomer.fullName}</h3>
                                        <div className="flex gap-2 mt-1">
                                            {getStatusBadge(selectedCustomer.status)}
                                            {(() => {
                                                const tier = getCustomerTier(selectedCustomer.totalSpent);
                                                return <Badge className={tier.color}>{tier.label}</Badge>;
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email:</label>
                                        <p>{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Số điện thoại:</label>
                                        <p>{selectedCustomer.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Địa chỉ:</label>
                                        <p>{selectedCustomer.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ngày tham gia:</label>
                                        <p>{new Date(selectedCustomer.joinDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                                            <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4 text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {(selectedCustomer.totalSpent / 1000000).toFixed(1)}M
                                            </p>
                                            <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Giá trị đơn hàng trung bình:</label>
                                    <p className="text-lg font-medium">
                                        {selectedCustomer.averageOrderValue.toLocaleString()} VNĐ
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Điểm tích lũy:</label>
                                    <p className="text-lg font-medium text-purple-600">{selectedCustomer.loyaltyPoints} điểm</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-600">Lần mua cuối:</label>
                                    <p>{new Date(selectedCustomer.lastOrderDate).toLocaleDateString('vi-VN')}</p>
                                </div>

                                {selectedCustomer.preferredProducts.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Sản phẩm yêu thích:</label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedCustomer.preferredProducts.map((product, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {product}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedCustomer.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Ghi chú:</label>
                                        <p className="p-3 bg-gray-50 rounded mt-1">{selectedCustomer.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-6 mt-6 border-t">
                            <Button onClick={() => handleEdit(selectedCustomer)} className="flex-1">
                                <Edit className="w-4 h-4 mr-2" />
                                Chỉnh Sửa
                            </Button>
                            <Button
                                variant={selectedCustomer.status === 'blocked' ? 'default' : 'outline'}
                                onClick={() => handleToggleStatus(selectedCustomer)}
                                className={selectedCustomer.status === 'blocked'
                                    ? 'text-green-600 hover:text-green-700'
                                    : 'text-red-600 hover:text-red-700'
                                }
                            >
                                {selectedCustomer.status === 'blocked' ? (
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
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    Clock,
    CheckCircle,
    XCircle,
    Package,
    Loader2,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Calendar
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { toast } from 'sonner';
import apiClient from '../../lib/api';

function getStatusBadge(status) {
    const statusConfig = {
        pending: {
            label: 'Chờ xử lý',
            variant: 'default',
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        },
        confirmed: {
            label: 'Đã xác nhận',
            variant: 'default',
            icon: CheckCircle,
            color: 'bg-blue-100 text-blue-800 border-blue-200'
        },
        preparing: {
            label: 'Đang chuẩn bị',
            variant: 'secondary',
            icon: Package,
            color: 'bg-purple-100 text-purple-800 border-purple-200'
        },
        ready: {
            label: 'Sẵn sàng',
            variant: 'default',
            icon: CheckCircle,
            color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
        },
        delivering: {
            label: 'Đang giao',
            variant: 'default',
            icon: Package,
            color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        },
        completed: {
            label: 'Hoàn thành',
            variant: 'success',
            icon: CheckCircle,
            color: 'bg-green-100 text-green-800 border-green-200'
        },
        cancelled: {
            label: 'Đã hủy',
            variant: 'destructive',
            icon: XCircle,
            color: 'bg-red-100 text-red-800 border-red-200'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
        <Badge className={`${config.color} flex items-center gap-1`}>
            <IconComponent className="w-3 h-3" />
            {config.label}
        </Badge>
    );
}

function getPaymentStatusBadge(status) {
    const paymentConfig = {
        paid: {
            label: 'Đã thanh toán',
            color: 'bg-green-100 text-green-800 border-green-200'
        },
        pending: {
            label: 'Chờ thanh toán',
            color: 'bg-orange-100 text-orange-800 border-orange-200'
        },
        failed: {
            label: 'Thất bại',
            color: 'bg-red-100 text-red-800 border-red-200'
        }
    };

    const config = paymentConfig[status] || paymentConfig.pending;

    return (
        <Badge className={config.color}>
            {config.label}
        </Badge>
    );
}

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0
    });
    const [statistics, setStatistics] = useState(null);

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (statusFilter !== 'all') params.status = statusFilter;
            if (paymentStatusFilter !== 'all') params.paymentStatus = paymentStatusFilter;

            const response = await apiClient.get('/api/admin/orders', { params });

            if (response.success) {
                setOrders(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Fetch order statistics
    const fetchStatistics = async () => {
        try {
            const response = await apiClient.get('/api/admin/reports/orders');
            if (response.success) {
                setStatistics(response.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, statusFilter, paymentStatusFilter]);

    useEffect(() => {
        fetchStatistics();
    }, []);

    // Filtered orders based on search
    const filteredOrders = orders.filter(order => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            order._id.toLowerCase().includes(searchLower) ||
            order.user?.name?.toLowerCase().includes(searchLower) ||
            order.user?.phone?.includes(searchTerm) ||
            order.user?.email?.toLowerCase().includes(searchLower)
        );
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            // Note: You'll need to implement this endpoint in backend
            toast.info('Chức năng cập nhật trạng thái đang được phát triển');
            // const response = await apiClient.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            // if (response.success) {
            //     toast.success('Cập nhật trạng thái thành công');
            //     fetchOrders();
            // }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                    <p className="text-gray-600">Theo dõi và xử lý các đơn hàng</p>
                </div>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.statusDistribution?.reduce((sum, item) => sum + item.count, 0) || 0}
                                    </p>
                                </div>
                                <ShoppingCart className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Đơn hoàn thành</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.statusDistribution?.find(s => s._id === 'completed')?.count || 0}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Đơn chờ xử lý</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.statusDistribution?.find(s => s._id === 'pending')?.count || 0}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tổng khách hàng</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.customerStats?.totalCustomers || 0}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng, số điện thoại..."
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
                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                                <SelectItem value="ready">Sẵn sàng</SelectItem>
                                <SelectItem value="delivering">Đang giao</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Lọc thanh toán" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả thanh toán</SelectItem>
                                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                                <SelectItem value="paid">Đã thanh toán</SelectItem>
                                <SelectItem value="failed">Thất bại</SelectItem>
                                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Đơn Hàng ({filteredOrders.length})</CardTitle>
                    <CardDescription>
                        Trang {pagination.page} / {pagination.pages} - Tổng cộng {pagination.total} đơn hàng
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Không tìm thấy đơn hàng nào</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-2">Mã Đơn</th>
                                            <th className="text-left py-3 px-2">Khách Hàng</th>
                                            <th className="text-left py-3 px-2">Sản Phẩm</th>
                                            <th className="text-left py-3 px-2">Tổng Tiền</th>
                                            <th className="text-left py-3 px-2">Trạng Thái</th>
                                            <th className="text-left py-3 px-2">Thanh Toán</th>
                                            <th className="text-left py-3 px-2">Thời Gian</th>
                                            <th className="text-left py-3 px-2">Thao Tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-2 font-medium">
                                                    <span className="text-xs font-mono">{order._id.slice(-8).toUpperCase()}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div>
                                                        <p className="font-medium">{order.user?.name || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{order.user?.phone || 'N/A'}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <div className="text-sm">
                                                        {order.items?.slice(0, 2).map((item, index) => (
                                                            <p key={index}>{item.quantity}x {item.name}</p>
                                                        ))}
                                                        {order.items?.length > 2 && (
                                                            <p className="text-gray-500">+{order.items.length - 2} món khác</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 font-medium">
                                                    {order.totalAmount?.toLocaleString()} VNĐ
                                                </td>
                                                <td className="py-3 px-2">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="py-3 px-2">
                                                    {getPaymentStatusBadge(order.paymentStatus)}
                                                </td>
                                                <td className="py-3 px-2 text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Xem Chi Tiết
                                                            </DropdownMenuItem>
                                                            {order.status === 'pending' && (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'confirmed')}>
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Xác Nhận
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status === 'confirmed' && (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'preparing')}>
                                                                    <Package className="w-4 h-4 mr-2" />
                                                                    Bắt Đầu Chuẩn Bị
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status === 'preparing' && (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'ready')}>
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Sẵn Sàng
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status === 'ready' && (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'delivering')}>
                                                                    <Package className="w-4 h-4 mr-2" />
                                                                    Bắt Đầu Giao
                                                                </DropdownMenuItem>
                                                            )}
                                                            {order.status === 'delivering' && (
                                                                <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'completed')}>
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Hoàn Thành
                                                                </DropdownMenuItem>
                                                            )}
                                                            {['pending', 'confirmed', 'preparing'].includes(order.status) && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                                                    className="text-red-600"
                                                                >
                                                                    <XCircle className="w-4 h-4 mr-2" />
                                                                    Hủy Đơn Hàng
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <div className="text-sm text-gray-600">
                                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} đơn hàng
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                        >
                                            Trước
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                                let pageNum;
                                                if (pagination.pages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (pagination.page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (pagination.page >= pagination.pages - 2) {
                                                    pageNum = pagination.pages - 4 + i;
                                                } else {
                                                    pageNum = pagination.page - 2 + i;
                                                }
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={pagination.page === pageNum ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.pages}
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Order Detail Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="!max-w-[60vw] !w-[60vw] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Chi Tiết Đơn Hàng #{selectedOrder?._id.slice(-8).toUpperCase()}</span>
                            <div className="flex gap-2">
                                {getStatusBadge(selectedOrder?.status)}
                                {getPaymentStatusBadge(selectedOrder?.paymentStatus)}
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            Đơn hàng được tạo lúc {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6 mt-4">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Thông Tin Khách Hàng</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-600">Tên:</span>
                                            <p className="font-medium">{selectedOrder.user?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Email:</span>
                                            <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Số điện thoại:</span>
                                            <p className="font-medium">{selectedOrder.user?.phone || 'N/A'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Thông Tin Thanh Toán</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="text-sm text-gray-600">Phương thức:</span>
                                            <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                                            <div className="mt-1">{getPaymentStatusBadge(selectedOrder.paymentStatus)}</div>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Tổng tiền:</span>
                                            <p className="font-bold text-lg">{selectedOrder.totalAmount?.toLocaleString()} VNĐ</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Tiến Trình Đơn Hàng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium">Đặt hàng</p>
                                                <p className="text-sm text-gray-600">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                                            </div>
                                        </div>
                                        {selectedOrder.confirmedAt && (
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Đã xác nhận</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.confirmedAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.preparingAt && (
                                            <div className="flex items-start gap-3">
                                                <Package className="w-5 h-5 text-purple-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Đang chuẩn bị</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.preparingAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.readyAt && (
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Sẵn sàng</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.readyAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.deliveringAt && (
                                            <div className="flex items-start gap-3">
                                                <Package className="w-5 h-5 text-indigo-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Đang giao hàng</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.deliveringAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.completedAt && (
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Hoàn thành</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.completedAt).toLocaleString('vi-VN')}</p>
                                                </div>
                                            </div>
                                        )}
                                        {selectedOrder.cancelledAt && (
                                            <div className="flex items-start gap-3">
                                                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                                <div>
                                                    <p className="font-medium">Đã hủy</p>
                                                    <p className="text-sm text-gray-600">{new Date(selectedOrder.cancelledAt).toLocaleString('vi-VN')}</p>
                                                    {selectedOrder.cancelReason && (
                                                        <p className="text-sm text-red-600 mt-1">Lý do: {selectedOrder.cancelReason}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Sản Phẩm Đã Đặt</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                <div className="flex gap-3">
                                                    {item.dish?.thumbnail && (
                                                        <img
                                                            src={item.dish.thumbnail}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                                        <p className="text-sm text-gray-600">Đơn giá: {item.price?.toLocaleString()} VNĐ</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">{item.subtotal?.toLocaleString()} VNĐ</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="border-t mt-4 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span>{selectedOrder.subtotal?.toLocaleString()} VNĐ</span>
                                        </div>
                                        {selectedOrder.tax > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Thuế:</span>
                                                <span>{selectedOrder.tax?.toLocaleString()} VNĐ</span>
                                            </div>
                                        )}
                                        {selectedOrder.deliveryFee > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Phí giao hàng:</span>
                                                <span>{selectedOrder.deliveryFee?.toLocaleString()} VNĐ</span>
                                            </div>
                                        )}
                                        {selectedOrder.discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Giảm giá:</span>
                                                <span>-{selectedOrder.discount?.toLocaleString()} VNĐ</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                                            <span>Tổng cộng:</span>
                                            <span className="text-primary">{selectedOrder.totalAmount?.toLocaleString()} VNĐ</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Ghi Chú</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{selectedOrder.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
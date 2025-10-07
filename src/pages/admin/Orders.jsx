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
    Package
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

// Mock data - trong thực tế sẽ lấy từ API
const mockOrders = [
    {
        id: 'ORD001',
        customer: {
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            email: 'nguyenvana@email.com'
        },
        items: [
            { name: 'Phở Bò Đặc Biệt', quantity: 2, price: 85000 },
            { name: 'Chả Cá Lả Vọng', quantity: 1, price: 95000 }
        ],
        total: 265000,
        status: 'completed',
        paymentStatus: 'paid',
        orderDate: '2024-01-20 14:30',
        completedDate: '2024-01-20 15:15',
        address: '123 Nguyễn Trãi, Quận 1, TP.HCM',
        notes: 'Ít cay, không hành'
    },
    {
        id: 'ORD002',
        customer: {
            name: 'Trần Thị B',
            phone: '0987654321',
            email: 'tranthib@email.com'
        },
        items: [
            { name: 'Bánh Mì Thịt Nướng', quantity: 3, price: 25000 },
            { name: 'Cà Phê Sữa Đá', quantity: 2, price: 18000 }
        ],
        total: 111000,
        status: 'preparing',
        paymentStatus: 'paid',
        orderDate: '2024-01-20 15:45',
        address: '456 Lê Lợi, Quận 3, TP.HCM',
        notes: ''
    },
    {
        id: 'ORD003',
        customer: {
            name: 'Lê Văn C',
            phone: '0369852147',
            email: 'levanc@email.com'
        },
        items: [
            { name: 'Cơm Tấm Sườn Bì', quantity: 1, price: 45000 },
            { name: 'Bún Bò Huế', quantity: 2, price: 55000 }
        ],
        total: 155000,
        status: 'pending',
        paymentStatus: 'pending',
        orderDate: '2024-01-20 16:20',
        address: '789 Võ Văn Tần, Quận 5, TP.HCM',
        notes: 'Giao trước 18h'
    }
];

function getStatusBadge(status) {
    const statusConfig = {
        pending: {
            label: 'Chờ xử lý',
            variant: 'default',
            icon: Clock,
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        },
        preparing: {
            label: 'Đang chuẩn bị',
            variant: 'secondary',
            icon: Package,
            color: 'bg-blue-100 text-blue-800 border-blue-200'
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
    const [orders, setOrders] = useState(mockOrders);
    const [filteredOrders, setFilteredOrders] = useState(mockOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filter logic
    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.phone.includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [orders, searchTerm, statusFilter]);

    const handleStatusUpdate = (orderId, newStatus) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId
                ? { ...order, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString() : null }
                : order
        ));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                    <p className="text-gray-600">Theo dõi và xử lý các đơn hàng</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo Đơn Hàng Mới
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
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
                                <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh Sách Đơn Hàng ({filteredOrders.length})</CardTitle>
                </CardHeader>
                <CardContent>
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
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-2 font-medium">{order.id}</td>
                                        <td className="py-3 px-2">
                                            <div>
                                                <p className="font-medium">{order.customer.name}</p>
                                                <p className="text-sm text-gray-500">{order.customer.phone}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="text-sm">
                                                {order.items.slice(0, 2).map((item, index) => (
                                                    <p key={index}>{item.quantity}x {item.name}</p>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <p className="text-gray-500">+{order.items.length - 2} món khác</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 font-medium">
                                            {order.total.toLocaleString()} VNĐ
                                        </td>
                                        <td className="py-3 px-2">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="py-3 px-2">
                                            {getPaymentStatusBadge(order.paymentStatus)}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-gray-600">
                                            {new Date(order.orderDate).toLocaleString('vi-VN')}
                                        </td>
                                        <td className="py-3 px-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Xem Chi Tiết
                                                    </DropdownMenuItem>
                                                    {order.status === 'pending' && (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'preparing')}>
                                                            <Package className="w-4 h-4 mr-2" />
                                                            Bắt Đầu Chuẩn Bị
                                                        </DropdownMenuItem>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'completed')}>
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Hoàn Thành
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(order.status === 'pending' || order.status === 'preparing') && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
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
                </CardContent>
            </Card>

            {/* Order Detail Modal - có thể implement sau */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Chi Tiết Đơn Hàng {selectedOrder.id}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium mb-2">Thông Tin Khách Hàng</h3>
                                    <p><strong>Tên:</strong> {selectedOrder.customer.name}</p>
                                    <p><strong>SĐT:</strong> {selectedOrder.customer.phone}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                    <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Thông Tin Đơn Hàng</h3>
                                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                    <p><strong>Thanh toán:</strong> {getPaymentStatusBadge(selectedOrder.paymentStatus)}</p>
                                    <p><strong>Đặt lúc:</strong> {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}</p>
                                    {selectedOrder.completedDate && (
                                        <p><strong>Hoàn thành:</strong> {new Date(selectedOrder.completedDate).toLocaleString('vi-VN')}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-2">Sản Phẩm Đã Đặt</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">{(item.price * item.quantity).toLocaleString()} VNĐ</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Tổng cộng:</span>
                                        <span>{selectedOrder.total.toLocaleString()} VNĐ</span>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div>
                                    <h3 className="font-medium mb-2">Ghi Chú</h3>
                                    <p className="p-3 bg-gray-50 rounded">{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
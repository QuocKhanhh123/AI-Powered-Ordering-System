import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, CheckCircle, XCircle, Eye, Loader2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";
import authService from "@/lib/authService";
import { toast } from "sonner";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        if (!authService.isAuthenticated()) {
            toast.error('Vui lòng đăng nhập');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.get('/api/orders/my-orders');

            // Response: { success, message, data: [...] }
            const orderList = response?.data || [];
            setOrders(orderList);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải danh sách đơn hàng');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>
            case 'processing':
            case 'preparing':
                return <Badge className="bg-blue-100 text-blue-800"><Package className="w-3 h-3 mr-1" />Đang xử lý</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Chờ xác nhận</Badge>
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    };

    const getPaymentStatusBadge = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case 'paid':
            case 'completed':
                return <Badge className="bg-green-500 text-white">Đã thanh toán</Badge>
            case 'pending':
                return <Badge className="bg-yellow-500 text-white">Chờ thanh toán</Badge>
            case 'failed':
                return <Badge variant="destructive">Thất bại</Badge>
            default:
                return <Badge variant="secondary">{paymentStatus}</Badge>
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (orders.length === 0 && !loading) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h2>
                        <p className="text-muted-foreground mb-6">
                            Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món ngay!
                        </p>
                        <Button onClick={() => navigate('/menu')}>
                            Xem thực đơn
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
                    <p className="text-muted-foreground">
                        Theo dõi tình trạng và lịch sử đơn hàng của bạn
                    </p>
                </div>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start flex-wrap gap-4">
                                    <div>
                                        <CardTitle className="text-lg">Đơn hàng #{order._id.slice(-8)}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Ngày đặt: {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="flex gap-2 justify-end">
                                            {getStatusBadge(order.status)}
                                            {getPaymentStatusBadge(order.paymentStatus)}
                                        </div>
                                        <p className="text-lg font-bold text-primary">
                                            {order.totalAmount.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <h4 className="font-medium">Món đã đặt:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-3 p-3 bg-muted rounded-lg">
                                                {item.dish?.thumbnail && (
                                                    <img
                                                        src={item.dish.thumbnail}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1 flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')}đ
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        {item.subtotal.toLocaleString('vi-VN')}đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.notes && (
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm"><span className="font-medium">Ghi chú:</span> {order.notes}</p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tạm tính:</span>
                                            <span>{order.subtotal.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Giảm giá:</span>
                                                <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
                                            </div>
                                        )}
                                        {order.deliveryFee > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Phí vận chuyển:</span>
                                                <span>{order.deliveryFee.toLocaleString('vi-VN')}đ</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-bold pt-2 border-t">
                                            <span>Tổng cộng:</span>
                                            <span className="text-primary">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="text-sm text-muted-foreground">
                                            Phương thức: <span className="font-medium capitalize">{order.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Thống kê đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{orders.length}</div>
                                <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {orders.filter(order => ['completed', 'delivered'].includes(order.status?.toLowerCase())).length}
                                </div>
                                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {orders.reduce((total, order) => total + order.totalAmount, 0).toLocaleString('vi-VN')}đ
                                </div>
                                <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, CheckCircle, XCircle, Eye } from "lucide-react";

export default function Orders() {
    // Mock data - trong thực tế sẽ fetch từ API
    const orders = [
        {
            id: "ORD001",
            date: "2024-01-15",
            status: "completed",
            total: 125000,
            items: [
                { name: "Phở Bò Đặc Biệt", quantity: 1, price: 89000 },
                { name: "Gỏi Cuốn Tôm Thịt", quantity: 1, price: 45000 }
            ]
        },
        {
            id: "ORD002",
            date: "2024-01-10",
            status: "processing",
            total: 65000,
            items: [
                { name: "Cơm Tấm Sườn Nướng", quantity: 1, price: 65000 }
            ]
        },
        {
            id: "ORD003",
            date: "2024-01-05",
            status: "cancelled",
            total: 35000,
            items: [
                { name: "Bánh Mì Thịt Nướng", quantity: 1, price: 35000 }
            ]
        }
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>
            case 'processing':
                return <Badge className="bg-blue-100 text-blue-800"><Package className="w-3 h-3 mr-1" />Đang xử lý</Badge>
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Chờ xác nhận</Badge>
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Đã hủy</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (orders.length === 0) {
        return (
            <div className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng nào</h2>
                        <p className="text-muted-foreground mb-6">
                            Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món ngay!
                        </p>
                        <Button>
                            <a href="/menu">Xem thực đơn</a>
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
                        <Card key={order.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">Đơn hàng #{order.id}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Ngày đặt: {formatDate(order.date)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(order.status)}
                                        <p className="text-lg font-bold text-primary mt-2">
                                            {order.total.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <h4 className="font-medium">Món đã đặt:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Số lượng: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-medium">
                                                    {item.price.toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t">
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="w-4 h-4 mr-2" />
                                                Chi tiết
                                            </Button>
                                            {order.status === 'completed' && (
                                                <Button variant="outline" size="sm">
                                                    Đặt lại
                                                </Button>
                                            )}
                                            {order.status === 'pending' && (
                                                <Button variant="destructive" size="sm">
                                                    Hủy đơn
                                                </Button>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">Tổng cộng</p>
                                            <p className="text-lg font-bold">
                                                {order.total.toLocaleString('vi-VN')}đ
                                            </p>
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
                                    {orders.filter(order => order.status === 'completed').length}
                                </div>
                                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {orders.reduce((total, order) => total + order.total, 0).toLocaleString('vi-VN')}đ
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
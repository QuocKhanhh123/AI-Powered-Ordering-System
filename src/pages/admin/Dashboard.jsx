import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    ShoppingCart,
    Package,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

// Mock data - trong thực tế sẽ lấy từ API
const mockStats = {
    totalOrders: 156,
    totalRevenue: 45680000,
    totalCustomers: 89,
    totalProducts: 45,
    orderGrowth: 12.5,
    revenueGrowth: 18.2,
    customerGrowth: 8.7,
    productGrowth: 5.3
};

const mockRecentOrders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', total: 245000, status: 'completed', time: '2 giờ trước' },
    { id: 'ORD002', customer: 'Trần Thị B', total: 189000, status: 'preparing', time: '3 giờ trước' },
    { id: 'ORD003', customer: 'Lê Văn C', total: 356000, status: 'pending', time: '4 giờ trước' },
    { id: 'ORD004', customer: 'Phạm Thị D', total: 127000, status: 'completed', time: '5 giờ trước' },
    { id: 'ORD005', customer: 'Hoàng Văn E', total: 298000, status: 'cancelled', time: '6 giờ trước' },
];

const mockSalesData = [
    { name: 'T2', revenue: 2400000, orders: 12 },
    { name: 'T3', revenue: 3200000, orders: 18 },
    { name: 'T4', revenue: 1800000, orders: 9 },
    { name: 'T5', revenue: 4200000, orders: 23 },
    { name: 'T6', revenue: 5600000, orders: 31 },
    { name: 'T7', revenue: 7800000, orders: 42 },
    { name: 'CN', revenue: 6200000, orders: 35 }
];

const mockPopularProducts = [
    { name: 'Phở Bò', value: 35, color: '#ff6b6b' },
    { name: 'Bánh Mì', value: 25, color: '#4ecdc4' },
    { name: 'Cơm Tấm', value: 20, color: '#45b7d1' },
    { name: 'Bún Bò Huế', value: 12, color: '#f9ca24' },
    { name: 'Khác', value: 8, color: '#f0932b' }
];

function StatCard({ title, value, growth, icon: Icon, isRevenue = false }) {
    const formatValue = (val) => {
        if (isRevenue) {
            return (val / 1000000).toFixed(1) + 'M VNĐ';
        }
        return val.toLocaleString();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatValue(value)}</div>
                <div className={`text-xs flex items-center ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {growth >= 0 ? '+' : ''}{growth}% so với tháng trước
                </div>
            </CardContent>
        </Card>
    );
}

function getOrderStatusBadge(status) {
    const statusConfig = {
        completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
        preparing: { label: 'Đang chuẩn bị', class: 'bg-yellow-100 text-yellow-800' },
        pending: { label: 'Chờ xử lý', class: 'bg-blue-100 text-blue-800' },
        cancelled: { label: 'Đã hủy', class: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
            {config.label}
        </span>
    );
}

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển</h1>
                <p className="text-gray-600">Tổng quan về hiệu suất kinh doanh</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng Đơn Hàng"
                    value={mockStats.totalOrders}
                    growth={mockStats.orderGrowth}
                    icon={ShoppingCart}
                />
                <StatCard
                    title="Doanh Thu"
                    value={mockStats.totalRevenue}
                    growth={mockStats.revenueGrowth}
                    icon={DollarSign}
                    isRevenue
                />
                <StatCard
                    title="Khách Hàng"
                    value={mockStats.totalCustomers}
                    growth={mockStats.customerGrowth}
                    icon={Users}
                />
                <StatCard
                    title="Sản Phẩm"
                    value={mockStats.totalProducts}
                    growth={mockStats.productGrowth}
                    icon={Package}
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Doanh Thu Theo Ngày</CardTitle>
                        <CardDescription>7 ngày qua</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={mockSalesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value, name) => [
                                        name === 'revenue' ? (value / 1000000).toFixed(1) + 'M VNĐ' : value,
                                        name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                                    ]}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Popular Products */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sản Phẩm Phổ Biến</CardTitle>
                        <CardDescription>Theo số lượng đặt hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={mockPopularProducts}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {mockPopularProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Đơn Hàng Gần Đây</CardTitle>
                    <CardDescription>Các đơn hàng mới nhất trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockRecentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900">{order.id}</span>
                                            {getOrderStatusBadge(order.status)}
                                        </div>
                                        <p className="text-sm text-gray-600">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                        {order.total.toLocaleString()} VNĐ
                                    </p>
                                    <p className="text-sm text-gray-500">{order.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
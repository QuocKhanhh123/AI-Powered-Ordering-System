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
    XCircle,
    Loader2,
    Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import apiClient from '../../lib/api';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
}

function StatCard({ title, value, subtitle, icon: Icon, isRevenue = false, iconColor = 'text-blue-600' }) {
    const formatValue = (val) => {
        if (isRevenue) {
            return (val / 1000000).toFixed(1) + 'M VNĐ';
        }
        return val?.toLocaleString() || '0';
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold mt-2">{formatValue(value)}</p>
                        {subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                        )}
                    </div>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                </div>
            </CardContent>
        </Card>
    );
}

function getOrderStatusBadge(status) {
    const statusConfig = {
        completed: { label: 'Hoàn thành', class: 'bg-green-100 text-green-800' },
        preparing: { label: 'Đang chuẩn bị', class: 'bg-purple-100 text-purple-800' },
        confirmed: { label: 'Đã xác nhận', class: 'bg-blue-100 text-blue-800' },
        ready: { label: 'Sẵn sàng', class: 'bg-cyan-100 text-cyan-800' },
        delivering: { label: 'Đang giao', class: 'bg-indigo-100 text-indigo-800' },
        pending: { label: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
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
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [orderStatistics, setOrderStatistics] = useState(null);

    // Fetch dashboard overview
    const fetchDashboardOverview = async () => {
        try {
            const response = await apiClient.get('/api/admin/dashboard');
            if (response.success) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            toast.error('Không thể tải dữ liệu tổng quan');
        }
    };

    // Fetch revenue data for last 7 days
    const fetchRevenueData = async () => {
        try {
            const today = new Date();
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

            const response = await apiClient.get('/api/admin/reports/revenue', {
                params: {
                    startDate: weekAgo.toISOString(),
                    endDate: today.toISOString(),
                    groupBy: 'day'
                }
            });

            if (response.success && response.data.breakdown) {
                setRevenueData(response.data.breakdown);
            }
        } catch (error) {
            console.error('Error fetching revenue:', error);
        }
    };

    // Fetch order statistics (includes top products, status distribution, payment methods)
    const fetchOrderStatistics = async () => {
        try {
            const response = await apiClient.get('/api/admin/reports/orders');
            if (response.success) {
                setOrderStatistics(response.data);

                // Format top dishes for pie chart
                if (response.data.topDishes) {
                    const top5 = response.data.topDishes.slice(0, 5).map((dish, index) => ({
                        name: dish.name || 'N/A',
                        value: dish.totalQuantity,
                        color: CHART_COLORS[index % CHART_COLORS.length]
                    }));
                    setTopProducts(top5);
                }
            }
        } catch (error) {
            console.error('Error fetching order statistics:', error);
        }
    };

    // Fetch recent orders
    const fetchRecentOrders = async () => {
        try {
            const response = await apiClient.get('/api/admin/orders', {
                params: {
                    page: 1,
                    limit: 5
                }
            });
            if (response.success) {
                setRecentOrders(response.data);
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            await Promise.all([
                fetchDashboardOverview(),
                fetchRevenueData(),
                fetchOrderStatistics(),
                fetchRecentOrders()
            ]);
            setLoading(false);
        };
        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
            </div>
        );
    }

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
                    value={dashboardData?.totalOrders}
                    subtitle={`Hôm nay: ${dashboardData?.todayOrders || 0}`}
                    icon={ShoppingCart}
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Tổng Doanh Thu"
                    value={dashboardData?.totalRevenue}
                    subtitle="Từ đơn hoàn thành"
                    icon={DollarSign}
                    isRevenue
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Khách Hàng"
                    value={dashboardData?.totalUsers}
                    subtitle="Tổng số người dùng"
                    icon={Users}
                    iconColor="text-purple-600"
                />
                <StatCard
                    title="Đơn Chờ Xử Lý"
                    value={dashboardData?.pendingOrders}
                    subtitle={`Đánh giá TB: ${dashboardData?.averageRating?.toFixed(1) || 0} ⭐`}
                    icon={Clock}
                    iconColor="text-orange-600"
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
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            if (name === 'totalRevenue') return [(value / 1000000).toFixed(1) + 'M VNĐ', 'Doanh thu'];
                                            if (name === 'orderCount') return [value, 'Đơn hàng'];
                                            return [value, name];
                                        }}
                                    />
                                    <Bar dataKey="totalRevenue" fill="#3b82f6" name="totalRevenue" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-[300px] text-gray-500">
                                Chưa có dữ liệu doanh thu
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Popular Products */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Sản Phẩm Phổ Biến</CardTitle>
                        <CardDescription>Top 5 món bán chạy nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topProducts}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {topProducts.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-[300px] text-gray-500">
                                Chưa có dữ liệu sản phẩm
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Statistics Row - Order Status & Payment Methods */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân Bố Trạng Thái Đơn Hàng</CardTitle>
                        <CardDescription>Tổng quan trạng thái các đơn hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orderStatistics?.statusDistribution && orderStatistics.statusDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={orderStatistics.statusDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="_id"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [value, 'Số đơn']}
                                        labelFormatter={(label) => `Trạng thái: ${label}`}
                                    />
                                    <Bar dataKey="count" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex justify-center items-center h-[300px] text-gray-500">
                                Chưa có dữ liệu trạng thái
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Method Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phương Thức Thanh Toán</CardTitle>
                        <CardDescription>Phân bố theo phương thức thanh toán</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orderStatistics?.paymentMethodDistribution && orderStatistics.paymentMethodDistribution.length > 0 ? (
                            <div className="space-y-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={orderStatistics.paymentMethodDistribution} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="category" dataKey="_id" />
                                        <YAxis type="number" />
                                        <Tooltip
                                            formatter={(value, name) => {
                                                if (name === 'total') return [(value / 1000000).toFixed(1) + 'M VNĐ', 'Tổng tiền'];
                                                return [value, 'Số đơn'];
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#f59e0b" name="count" />
                                    </BarChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 mt-4">
                                    {orderStatistics.paymentMethodDistribution.map((method, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium capitalize">{method._id}</p>
                                                <p className="text-sm text-gray-600">{method.count} đơn hàng</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{(method.total / 1000000).toFixed(1)}M VNĐ</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-[300px] text-gray-500">
                                Chưa có dữ liệu thanh toán
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Đơn Hàng Gần Đây</CardTitle>
                    <CardDescription>5 đơn hàng mới nhất trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    {recentOrders.length > 0 ? (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-gray-900 font-mono text-xs">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                {getOrderStatusBadge(order.status)}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {order.user?.name || 'Khách hàng'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.items?.length || 0} món • {order.paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {order.totalAmount?.toLocaleString() || 0} VNĐ
                                        </p>
                                        <p className="text-sm text-gray-500">{formatTimeAgo(order.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <ShoppingCart className="w-12 h-12 mb-4 text-gray-300" />
                            <p>Chưa có đơn hàng nào</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
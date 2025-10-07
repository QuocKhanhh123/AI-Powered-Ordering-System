import React, { useState } from 'react';
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
    Cell,
    AreaChart,
    Area
} from 'recharts';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    Calendar,
    Download,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

// Mock data
const monthlyRevenueData = [
    { month: 'T1', revenue: 12500000, orders: 145, customers: 98 },
    { month: 'T2', revenue: 15200000, orders: 178, customers: 112 },
    { month: 'T3', revenue: 18400000, orders: 203, customers: 134 },
    { month: 'T4', revenue: 16800000, orders: 189, customers: 121 },
    { month: 'T5', revenue: 22100000, orders: 234, customers: 156 },
    { month: 'T6', revenue: 25600000, orders: 267, customers: 178 },
    { month: 'T7', revenue: 28200000, orders: 289, customers: 195 },
    { month: 'T8', revenue: 31500000, orders: 312, customers: 218 },
    { month: 'T9', revenue: 29800000, orders: 298, customers: 201 },
    { month: 'T10', revenue: 33200000, orders: 334, customers: 234 },
    { month: 'T11', revenue: 36400000, orders: 356, customers: 251 },
    { month: 'T12', revenue: 42800000, orders: 389, customers: 289 }
];

const dailyOrderData = [
    { day: 'Thứ 2', orders: 25, revenue: 2100000 },
    { day: 'Thứ 3', orders: 32, revenue: 2800000 },
    { day: 'Thứ 4', orders: 28, revenue: 2400000 },
    { day: 'Thứ 5', orders: 41, revenue: 3600000 },
    { day: 'Thứ 6', orders: 56, revenue: 4900000 },
    { day: 'Thứ 7', orders: 68, revenue: 5800000 },
    { day: 'Chủ nhật', orders: 52, revenue: 4500000 }
];

const topProductsData = [
    { name: 'Phở Bò', revenue: 8500000, orders: 185, percentage: 25 },
    { name: 'Bánh Mì', revenue: 6200000, orders: 248, percentage: 18 },
    { name: 'Cơm Tấm', revenue: 5800000, orders: 129, percentage: 17 },
    { name: 'Bún Bò Huế', revenue: 4900000, orders: 89, percentage: 15 },
    { name: 'Khác', revenue: 8600000, orders: 167, percentage: 25 }
];

const customerSegmentData = [
    { name: 'Khách hàng mới', value: 35, color: '#3b82f6' },
    { name: 'Khách hàng thường xuyên', value: 45, color: '#10b981' },
    { name: 'Khách hàng VIP', value: 20, color: '#f59e0b' }
];

const hourlyOrderData = [
    { hour: '6h', orders: 2 }, { hour: '7h', orders: 5 }, { hour: '8h', orders: 12 },
    { hour: '9h', orders: 18 }, { hour: '10h', orders: 25 }, { hour: '11h', orders: 38 },
    { hour: '12h', orders: 52 }, { hour: '13h', orders: 45 }, { hour: '14h', orders: 35 },
    { hour: '15h', orders: 28 }, { hour: '16h', orders: 22 }, { hour: '17h', orders: 35 },
    { hour: '18h', orders: 48 }, { hour: '19h', orders: 42 }, { hour: '20h', orders: 38 },
    { hour: '21h', orders: 25 }, { hour: '22h', orders: 15 }, { hour: '23h', orders: 8 }
];

function StatCard({ title, value, change, icon: Icon, color = "blue", prefix = "", suffix = "" }) {
    const isPositive = change >= 0;

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold">{prefix}{value}{suffix}</p>
                            <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <TrendingUp className={`w-3 h-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
                                {isPositive ? '+' : ''}{change}%
                            </span>
                        </div>
                    </div>
                    <Icon className={`h-8 w-8 text-${color}-600`} />
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminReports() {
    const [timeRange, setTimeRange] = useState('month');
    const [selectedTab, setSelectedTab] = useState('overview');

    const formatCurrency = (amount) => {
        return (amount / 1000000).toFixed(1) + 'M VNĐ';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Báo Cáo & Thống Kê</h1>
                    <p className="text-gray-600">Phân tích dữ liệu kinh doanh và hiệu suất</p>
                </div>
                <div className="flex gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">7 ngày qua</SelectItem>
                            <SelectItem value="month">30 ngày qua</SelectItem>
                            <SelectItem value="quarter">3 tháng qua</SelectItem>
                            <SelectItem value="year">12 tháng qua</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Báo Cáo
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng Doanh Thu"
                    value={formatCurrency(312500000)}
                    change={18.2}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    title="Đơn Hàng"
                    value="2,847"
                    change={12.5}
                    icon={ShoppingCart}
                    color="blue"
                />
                <StatCard
                    title="Khách Hàng Mới"
                    value="186"
                    change={8.7}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="Doanh Thu Trung Bình"
                    value="109"
                    change={-2.1}
                    icon={TrendingUp}
                    color="orange"
                    suffix="K VNĐ"
                />
            </div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
                    <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
                    <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
                    <TabsTrigger value="customers">Khách Hàng</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Monthly Revenue Trend */}
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Xu Hướng Doanh Thu Theo Tháng</CardTitle>
                                <CardDescription>Doanh thu và số đơn hàng 12 tháng qua</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyRevenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'revenue' ? formatCurrency(value) : value,
                                                name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                                            ]}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.1}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Daily Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Đơn Hàng Theo Ngày</CardTitle>
                                <CardDescription>Phân bố đơn hàng trong tuần</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={dailyOrderData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="orders" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Hourly Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Đơn Hàng Theo Giờ</CardTitle>
                                <CardDescription>Phân bố đơn hàng trong ngày</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={hourlyOrderData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Revenue Tab */}
                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Doanh Thu Chi Tiết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={monthlyRevenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thống Kê Doanh Thu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tháng cao nhất:</span>
                                        <span className="font-medium">42.8M VNĐ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tháng thấp nhất:</span>
                                        <span className="font-medium">12.5M VNĐ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Trung bình/tháng:</span>
                                        <span className="font-medium">26.8M VNĐ</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tăng trưởng:</span>
                                        <span className="font-medium text-green-600">+242.4%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Products Tab */}
                <TabsContent value="products" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Sản Phẩm Bán Chạy</CardTitle>
                                <CardDescription>Theo doanh thu</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={topProductsData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="percentage"
                                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                                        >
                                            {topProductsData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(${index * 72}, 70%, 50%)`} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Chi Tiết Sản Phẩm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProductsData.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-600">{product.orders} đơn hàng</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{formatCurrency(product.revenue)}</p>
                                                <p className="text-sm text-gray-600">{product.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Phân Khúc Khách Hàng</CardTitle>
                                <CardDescription>Theo tần suất mua hàng</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={customerSegmentData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}%`}
                                        >
                                            {customerSegmentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tăng Trưởng Khách Hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyRevenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="customers"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
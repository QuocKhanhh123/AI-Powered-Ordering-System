import React, { useState, useEffect } from 'react';
import {
    Settings,
    User,
    Bell,
    Shield,
    Database,
    Mail,
    Globe,
    CreditCard,
    Save,
    Eye,
    EyeOff,
    Upload,
    Trash2,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { toast } from 'sonner';
import authService from '../../lib/authService';
import apiClient from '../../lib/api';

export default function AdminSettings() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    // Profile Settings
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        avatar: null,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Fetch user profile from API
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true);
                const response = await apiClient.get('/api/users/profile');

                if (response.success) {
                    // Map API data to profile state
                    setProfile(prev => ({
                        ...prev,
                        fullName: response.data.user.name || '',
                        email: response.data.user.email || '',
                        phone: response.data.user.phone || '',
                    }));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Không thể tải thông tin người dùng');

                // Fallback to localStorage
                const user = authService.getCurrentUser();
                if (user) {
                    setProfile(prev => ({
                        ...prev,
                        fullName: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                    }));
                }
            } finally {
                setProfileLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // System Settings
    const [systemSettings, setSystemSettings] = useState({
        siteName: 'FoodieHub Admin',
        siteDescription: 'Hệ thống quản lý đặt món ăn trực tuyến',
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        language: 'vi',
        maintenanceMode: false,
        allowRegistration: true,
        emailVerification: true
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        newOrders: true,
        orderStatusUpdates: true,
        paymentNotifications: true,
        lowStockAlerts: true,
        customerRegistrations: true,
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        cashOnDelivery: true,
        bankTransfer: true,
        creditCard: false,
        digitalWallet: true,
        paymentFee: 2.5,
        minimumOrderValue: 50000,
        freeShippingThreshold: 200000
    });

    const handleProfileUpdate = async () => {
        setLoading(true);
        try {
            // Update profile (name, phone)
            if (profile.fullName || profile.phone) {
                const response = await apiClient.patch('/api/users/profile', {
                    name: profile.fullName,
                    phone: profile.phone
                });

                if (response.success) {
                    // Update localStorage
                    localStorage.setItem('user', JSON.stringify(response.data));
                    toast.success('Cập nhật thông tin thành công!');
                }
            }

            // Change password if provided
            if (profile.newPassword) {
                if (profile.newPassword !== profile.confirmPassword) {
                    toast.error('Mật khẩu xác nhận không khớp!');
                    setLoading(false);
                    return;
                }

                if (!profile.currentPassword) {
                    toast.error('Vui lòng nhập mật khẩu hiện tại!');
                    setLoading(false);
                    return;
                }

                await apiClient.post('/api/users/change-password', {
                    currentPassword: profile.currentPassword,
                    newPassword: profile.newPassword
                });

                toast.success('Đổi mật khẩu thành công!');

                // Clear password fields after successful update
                setProfile(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const handleSystemUpdate = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Cập nhật cài đặt hệ thống thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Cập nhật cài đặt thông báo thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentUpdate = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Cập nhật cài đặt thanh toán thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile(prev => ({ ...prev, avatar: e.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
                <p className="text-gray-600">Quản lý cấu hình và tùy chỉnh hệ thống</p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Hồ Sơ
                    </TabsTrigger>
                    <TabsTrigger value="system" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Hệ Thống
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Thông Báo
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Thanh Toán
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông Tin Cá Nhân</CardTitle>
                            <CardDescription>Quản lý thông tin tài khoản admin của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {profileLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    {/* Avatar Section */}
                                    <div className="flex items-center gap-6">
                                        <Avatar className="w-24 h-24">
                                            {profile.avatar ? (
                                                <AvatarImage src={profile.avatar} alt="Avatar" />
                                            ) : (
                                                <AvatarFallback className="text-2xl">
                                                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <label htmlFor="avatar-upload">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <span className="cursor-pointer">
                                                            <Upload className="w-4 h-4 mr-2" />
                                                            Tải Ảnh Lên
                                                        </span>
                                                    </Button>
                                                </label>
                                                <input
                                                    id="avatar-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleAvatarUpload}
                                                />
                                                {profile.avatar && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setProfile(prev => ({ ...prev, avatar: null }))}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Chọn ảnh JPG, PNG hoặc GIF. Tối đa 5MB.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Basic Info */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Họ và Tên</Label>
                                            <Input
                                                id="fullName"
                                                value={profile.fullName}
                                                onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số Điện Thoại</Label>
                                            <Input
                                                id="phone"
                                                value={profile.phone}
                                                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Password Change */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Đổi Mật Khẩu</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Mật Khẩu Hiện Tại</Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={profile.currentPassword}
                                                onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Mật Khẩu Mới</Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            value={profile.newPassword}
                                            onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            value={profile.confirmPassword}
                                            onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleProfileUpdate} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài Đặt Hệ Thống</CardTitle>
                            <CardDescription>Quản lý cấu hình chung của hệ thống</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteName">Tên Trang Web</Label>
                                    <Input
                                        id="siteName"
                                        value={systemSettings.siteName}
                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Múi Giờ</Label>
                                    <Select
                                        value={systemSettings.timezone}
                                        onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</SelectItem>
                                            <SelectItem value="Asia/Bangkok">Bangkok (GMT+7)</SelectItem>
                                            <SelectItem value="Asia/Singapore">Singapore (GMT+8)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Đơn Vị Tiền Tệ</Label>
                                    <Select
                                        value={systemSettings.currency}
                                        onValueChange={(value) => setSystemSettings(prev => ({ ...prev, currency: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                                            <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                            <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Ngôn Ngữ</Label>
                                    <Select
                                        value={systemSettings.language}
                                        onValueChange={(value) => setSystemSettings(prev => ({ ...prev, language: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vi">Tiếng Việt</SelectItem>
                                            <SelectItem value="en">English</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Mô Tả Trang Web</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={systemSettings.siteDescription}
                                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Tùy Chọn Hệ Thống</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Chế Độ Bảo Trì</Label>
                                        <p className="text-sm text-gray-500">Tạm thời đóng cửa hệ thống để bảo trì</p>
                                    </div>
                                    <Switch
                                        checked={systemSettings.maintenanceMode}
                                        onCheckedChange={(checked) =>
                                            setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Cho Phép Đăng Ký</Label>
                                        <p className="text-sm text-gray-500">Khách hàng có thể tự đăng ký tài khoản mới</p>
                                    </div>
                                    <Switch
                                        checked={systemSettings.allowRegistration}
                                        onCheckedChange={(checked) =>
                                            setSystemSettings(prev => ({ ...prev, allowRegistration: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Xác Thực Email</Label>
                                        <p className="text-sm text-gray-500">Yêu cầu xác thực email khi đăng ký</p>
                                    </div>
                                    <Switch
                                        checked={systemSettings.emailVerification}
                                        onCheckedChange={(checked) =>
                                            setSystemSettings(prev => ({ ...prev, emailVerification: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSystemUpdate} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài Đặt Thông Báo</CardTitle>
                            <CardDescription>Quản lý các loại thông báo mà bạn muốn nhận</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Thông Báo Đơn Hàng</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Đơn Hàng Mới</Label>
                                        <p className="text-sm text-gray-500">Thông báo khi có đơn hàng mới</p>
                                    </div>
                                    <Switch
                                        checked={notifications.newOrders}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, newOrders: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Cập Nhật Trạng Thái</Label>
                                        <p className="text-sm text-gray-500">Thông báo khi trạng thái đơn hàng thay đổi</p>
                                    </div>
                                    <Switch
                                        checked={notifications.orderStatusUpdates}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, orderStatusUpdates: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Thanh Toán</Label>
                                        <p className="text-sm text-gray-500">Thông báo về các giao dịch thanh toán</p>
                                    </div>
                                    <Switch
                                        checked={notifications.paymentNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, paymentNotifications: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-semibold">Thông Báo Hệ Thống</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Cảnh Báo Tồn Kho</Label>
                                        <p className="text-sm text-gray-500">Thông báo khi sản phẩm sắp hết hàng</p>
                                    </div>
                                    <Switch
                                        checked={notifications.lowStockAlerts}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, lowStockAlerts: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Đăng Ký Khách Hàng</Label>
                                        <p className="text-sm text-gray-500">Thông báo khi có khách hàng mới đăng ký</p>
                                    </div>
                                    <Switch
                                        checked={notifications.customerRegistrations}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, customerRegistrations: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Báo Cáo Tuần</Label>
                                        <p className="text-sm text-gray-500">Nhận báo cáo tổng hợp hàng tuần</p>
                                    </div>
                                    <Switch
                                        checked={notifications.weeklyReports}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-semibold">Phương Thức Thông Báo</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Thông Báo Email</Label>
                                        <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                                    </div>
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Thông Báo Đẩy</Label>
                                        <p className="text-sm text-gray-500">Nhận thông báo đẩy trên trình duyệt</p>
                                    </div>
                                    <Switch
                                        checked={notifications.pushNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <Button onClick={handleNotificationUpdate} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cài Đặt Thanh Toán</CardTitle>
                            <CardDescription>Quản lý các phương thức thanh toán và chính sách</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Phương Thức Thanh Toán</h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Thanh Toán Khi Nhận Hàng</Label>
                                        <p className="text-sm text-gray-500">Cho phép thanh toán bằng tiền mặt</p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.cashOnDelivery}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings(prev => ({ ...prev, cashOnDelivery: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Chuyển Khoản Ngân Hàng</Label>
                                        <p className="text-sm text-gray-500">Thanh toán qua chuyển khoản</p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.bankTransfer}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings(prev => ({ ...prev, bankTransfer: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Thẻ Tín Dụng</Label>
                                        <p className="text-sm text-gray-500">Thanh toán bằng thẻ tín dụng/ghi nợ</p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.creditCard}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings(prev => ({ ...prev, creditCard: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Ví Điện Tử</Label>
                                        <p className="text-sm text-gray-500">MoMo, ZaloPay, VNPay...</p>
                                    </div>
                                    <Switch
                                        checked={paymentSettings.digitalWallet}
                                        onCheckedChange={(checked) =>
                                            setPaymentSettings(prev => ({ ...prev, digitalWallet: checked }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <h3 className="text-lg font-semibold">Chính Sách Thanh Toán</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="paymentFee">Phí Thanh Toán (%)</Label>
                                        <Input
                                            id="paymentFee"
                                            type="number"
                                            step="0.1"
                                            value={paymentSettings.paymentFee}
                                            onChange={(e) => setPaymentSettings(prev => ({
                                                ...prev,
                                                paymentFee: parseFloat(e.target.value)
                                            }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="minimumOrder">Giá Trị Đơn Hàng Tối Thiểu (VNĐ)</Label>
                                        <Input
                                            id="minimumOrder"
                                            type="number"
                                            value={paymentSettings.minimumOrderValue}
                                            onChange={(e) => setPaymentSettings(prev => ({
                                                ...prev,
                                                minimumOrderValue: parseInt(e.target.value)
                                            }))}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="freeShipping">Miễn Phí Giao Hàng Từ (VNĐ)</Label>
                                        <Input
                                            id="freeShipping"
                                            type="number"
                                            value={paymentSettings.freeShippingThreshold}
                                            onChange={(e) => setPaymentSettings(prev => ({
                                                ...prev,
                                                freeShippingThreshold: parseInt(e.target.value)
                                            }))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handlePaymentUpdate} disabled={loading}>
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
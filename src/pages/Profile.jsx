import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar, Loader2, Edit, Lock, Save, X } from "lucide-react";
import authService from "@/lib/authService";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Profile() {
    const [user, setUser] = useState(authService.getCurrentUser());
    const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiClient.get('/api/users/profile');
            if (response.success) {
                setUser(response.data.user);
                setProfileForm({
                    name: response.data.user.name || '',
                    phone: response.data.user.phone || ''
                });
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/api/users/stats');
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            const response = await apiClient.patch('/api/users/profile', profileForm);

            if (response.success) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('Cập nhật thông tin thành công');
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            setLoading(true);
            const response = await apiClient.post('/api/users/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (response.success) {
                toast.success('Đổi mật khẩu thành công');
                setChangePasswordDialog(false);
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
                    <p className="text-muted-foreground">Bạn cần đăng nhập để xem thông tin cá nhân</p>
                </div>
            </div>
        );
    }

    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
                    <p className="text-muted-foreground mt-3">Quản lý thông tin tài khoản của bạn</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">Ảnh đại diện</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Avatar className="h-24 w-24 mx-auto mb-4">
                                    <AvatarImage src={user.avatar} alt={user.name || user.email} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {getUserInitials(user.name || user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="font-semibold text-lg">{user.name || "Chưa có tên"}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                                <Button variant="outline" className="w-full">
                                    Thay đổi ảnh đại diện
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin chi tiết</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Họ và tên</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={editMode ? profileForm.name : user.name || ""}
                                                onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="pl-10"
                                                readOnly={!editMode}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={editMode ? profileForm.phone : user.phone || ""}
                                                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                                                className="pl-10"
                                                readOnly={!editMode}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user.email || ""}
                                            className="pl-10"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    {editMode ? (
                                        <>
                                            <Button onClick={handleUpdateProfile} disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditMode(false);
                                                    setProfileForm({
                                                        name: user.name || '',
                                                        phone: user.phone || ''
                                                    });
                                                }}
                                                disabled={loading}
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                Hủy
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={() => setEditMode(true)}>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Chỉnh sửa thông tin
                                            </Button>
                                            <Button variant="outline" onClick={() => setChangePasswordDialog(true)}>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Đổi mật khẩu
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Thống kê tài khoản</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{stats.totalOrders}</div>
                                    <p className="text-sm text-muted-foreground">Đơn hàng đã đặt</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{stats.completedOrders}</div>
                                    <p className="text-sm text-muted-foreground">Đơn hoàn thành</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{stats.totalSpent.toLocaleString()}đ</div>
                                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Change Password Dialog */}
                <Dialog open={changePasswordDialog} onOpenChange={setChangePasswordDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Đổi mật khẩu</DialogTitle>
                            <DialogDescription>
                                Nhập mật khẩu hiện tại và mật khẩu mới
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                <Input
                                    id="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setChangePasswordDialog(false)}
                                className="flex-1"
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleChangePassword}
                                className="flex-1"
                                disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Đổi mật khẩu'
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
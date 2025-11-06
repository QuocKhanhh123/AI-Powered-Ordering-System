import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Calendar } from "lucide-react";
import authService from "@/lib/authService";

export default function Profile() {
    const user = authService.getCurrentUser();

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
                                                value={user.name || ""}
                                                className="pl-10"
                                                readOnly
                                            />
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

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={user.phone || ""}
                                                className="pl-10"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="roles">Vai trò</Label>
                                        <Input
                                            id="roles"
                                            type="text"
                                            value={user.roles ? user.roles.join(', ') : ""}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="id">ID tài khoản</Label>
                                    <Input
                                        id="id"
                                        type="text"
                                        value={user.id || ""}
                                        readOnly
                                        className="font-mono text-sm"
                                    />
                                </div>

                                <div className="flex space-x-4 pt-4">
                                    <Button>Chỉnh sửa thông tin</Button>
                                    <Button variant="outline">Đổi mật khẩu</Button>
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
                                    <div className="text-2xl font-bold text-primary">0</div>
                                    <p className="text-sm text-muted-foreground">Đơn hàng đã đặt</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">0</div>
                                    <p className="text-sm text-muted-foreground">Món ăn yêu thích</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">0đ</div>
                                    <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
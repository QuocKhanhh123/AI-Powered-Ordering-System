import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Bell,
    Shield,
    Palette,
    Globe,
    CreditCard,
    Smartphone,
    Mail,
    Moon,
    Sun
} from "lucide-react";

export default function Settings() {
    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
                    <p className="text-muted-foreground">
                        Quản lý tùy chọn và cấu hình tài khoản của bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="w-5 h-5 mr-2" />
                                Thông báo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications" className="text-sm font-medium">
                                    Thông báo qua email
                                </Label>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="order-notifications" className="text-sm font-medium">
                                    Cập nhật đơn hàng
                                </Label>
                                <Switch id="order-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="promotion-notifications" className="text-sm font-medium">
                                    Khuyến mãi và ưu đãi
                                </Label>
                                <Switch id="promotion-notifications" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="sms-notifications" className="text-sm font-medium">
                                    Thông báo SMS
                                </Label>
                                <Switch id="sms-notifications" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Bảo mật & Quyền riêng tư
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="two-factor" className="text-sm font-medium">
                                    Xác thực 2 bước
                                </Label>
                                <Switch id="two-factor" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="login-alerts" className="text-sm font-medium">
                                    Cảnh báo đăng nhập
                                </Label>
                                <Switch id="login-alerts" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="data-sharing" className="text-sm font-medium">
                                    Chia sẻ dữ liệu
                                </Label>
                                <Switch id="data-sharing" />
                            </div>
                            <Button variant="outline" className="w-full">
                                Thay đổi mật khẩu
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Palette className="w-5 h-5 mr-2" />
                                Giao diện
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode" className="text-sm font-medium">
                                    Chế độ tối
                                </Label>
                                <Switch id="dark-mode" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Ngôn ngữ</Label>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        🇻🇳 Tiếng Việt
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        🇺🇸 English
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Múi giờ</Label>
                                <Button variant="outline" className="w-full justify-start">
                                    <Globe className="w-4 h-4 mr-2" />
                                    GMT+7 (Giờ Việt Nam)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment & Billing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="w-5 h-5 mr-2" />
                                Thanh toán & Hóa đơn
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Quản lý phương thức thanh toán
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <Mail className="w-4 h-4 mr-2" />
                                Lịch sử hóa đơn
                            </Button>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="auto-payment" className="text-sm font-medium">
                                    Thanh toán tự động
                                </Label>
                                <Switch id="auto-payment" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="payment-reminders" className="text-sm font-medium">
                                    Nhắc nhở thanh toán
                                </Label>
                                <Switch id="payment-reminders" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Management */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="text-red-600">Quản lý tài khoản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline">
                                Xuất dữ liệu tài khoản
                            </Button>
                            <Button variant="outline">
                                Tạm khóa tài khoản
                            </Button>
                        </div>
                        <div className="pt-4 border-t">
                            <Button variant="destructive" className="w-full">
                                Xóa tài khoản vĩnh viễn
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Thao tác này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Changes */}
                <div className="flex justify-end mt-6">
                    <div className="space-x-4">
                        <Button variant="outline">
                            Hủy thay đổi
                        </Button>
                        <Button>
                            Lưu cài đặt
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
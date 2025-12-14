import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Mail,
} from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Settings() {
  return (
    <motion.div
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Cài đặt</h1>
          <p className="text-muted-foreground">
            Quản lý tùy chọn và cấu hình tài khoản của bạn
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Thông báo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["email", "Thông báo qua email", true],
                  ["order", "Cập nhật đơn hàng", true],
                  ["promotion", "Khuyến mãi và ưu đãi", false],
                  ["sms", "Thông báo SMS", false],
                ].map(([id, label, checked]) => (
                  <div key={id} className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Switch defaultChecked={checked} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Bảo mật & Quyền riêng tư
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["Xác thực 2 bước", false],
                  ["Cảnh báo đăng nhập", true],
                  ["Chia sẻ dữ liệu", false],
                ].map(([label, checked]) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Switch defaultChecked={checked} />
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Thay đổi mật khẩu
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Giao diện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Chế độ tối</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ngôn ngữ</Label>
                  <div className="flex gap-2">
                    <Button size="sm">🇻🇳 Tiếng Việt</Button>
                    <Button variant="ghost" size="sm">
                      🇺🇸 English
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  GMT+7 (Giờ Việt Nam)
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
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
                {[
                  ["Thanh toán tự động", false],
                  ["Nhắc nhở thanh toán", true],
                ].map(([label, checked]) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{label}</Label>
                    <Switch defaultChecked={checked} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">
                Quản lý tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline">Xuất dữ liệu tài khoản</Button>
                <Button variant="outline">Tạm khóa tài khoản</Button>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive" className="w-full">
                  Xóa tài khoản vĩnh viễn
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Thao tác này không thể hoàn tác
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="flex justify-end mt-8 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button variant="outline">Hủy thay đổi</Button>
          <Button>Lưu cài đặt</Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

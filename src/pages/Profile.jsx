import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Loader2, Edit, Lock, Save, X } from "lucide-react"
import authService from "@/lib/authService"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Profile() {
  const [user, setUser] = useState(authService.getCurrentUser())
  const [stats, setStats] = useState({ totalOrders: 0, completedOrders: 0, totalSpent: 0 })
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [changePasswordDialog, setChangePasswordDialog] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get("/api/users/profile")
      if (response.success) {
        setUser(response.data.user)
        setProfileForm({
          name: response.data.user.name || "",
          phone: response.data.user.phone || "",
        })
        localStorage.setItem("user", JSON.stringify(response.data.user))
      }
    } catch {}
  }

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/api/users/stats")
      if (response.success) setStats(response.data)
    } catch {}
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      const response = await apiClient.patch("/api/users/profile", profileForm)
      if (response.success) {
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
        toast.success("Cập nhật thông tin thành công")
        setEditMode(false)
      }
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật thông tin")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.post("/api/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      if (response.success) {
        toast.success("Đổi mật khẩu thành công")
        setChangePasswordDialog(false)
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      }
    } catch (error) {
      toast.error(error.message || "Không thể đổi mật khẩu")
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U"

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h1>
        <p className="text-muted-foreground">Bạn cần đăng nhập để xem thông tin cá nhân</p>
      </div>
    )
  }

  return (
    <motion.div
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Thông tin cá nhân</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý thông tin và bảo mật tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div layout>
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-center">Hồ sơ</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <Avatar className="h-28 w-28 mx-auto ring-4 ring-primary/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {getUserInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-xl">{user.name || "Chưa có tên"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Thay đổi ảnh đại diện
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div layout className="lg:col-span-2">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        value={editMode ? profileForm.name : user.name || ""}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, name: e.target.value }))
                        }
                        readOnly={!editMode}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        value={editMode ? profileForm.phone : user.phone || ""}
                        onChange={(e) =>
                          setProfileForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        readOnly={!editMode}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" value={user.email} readOnly />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {editMode ? (
                    <motion.div
                      key="edit"
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button onClick={handleUpdateProfile} disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang lưu
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
                          setEditMode(false)
                          setProfileForm({
                            name: user.name || "",
                            phone: user.phone || "",
                          })
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view"
                      className="flex gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button onClick={() => setEditMode(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Button>
                      <Button variant="outline" onClick={() => setChangePasswordDialog(true)}>
                        <Lock className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Thống kê tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{stats.totalOrders}</div>
                <p className="text-sm text-muted-foreground">Đơn hàng</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{stats.completedOrders}</div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {stats.totalSpent.toLocaleString()}đ
                </div>
                <p className="text-sm text-muted-foreground">Chi tiêu</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={changePasswordDialog} onOpenChange={setChangePasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
              <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                type="password"
                placeholder="Mật khẩu hiện tại"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
              />
              <Input
                type="password"
                placeholder="Mật khẩu mới"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))
                }
              />
              <Input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setChangePasswordDialog(false)} className="flex-1">
                Hủy
              </Button>
              <Button onClick={handleChangePassword} className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  )
}

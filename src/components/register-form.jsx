import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import authService from "@/lib/authService"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function RegisterForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName || !formData.lastName) newErrors.name = "Họ và tên là bắt buộc"
    if (!formData.email) newErrors.email = "Email là bắt buộc"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ"

    if (!formData.phone) newErrors.phone = "Số điện thoại là bắt buộc"
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại phải có 10 chữ số"

    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc"
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
    if (!formData.agreeToTerms) newErrors.terms = "Bạn phải đồng ý điều khoản"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đăng ký!")
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      await authService.register({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`
      })

      toast.success("Đăng ký thành công!", {
        description: "Chuyển hướng đến trang đăng nhập..."
      })

      setTimeout(() => navigate("/login"), 1200)
    } catch (error) {
      if (error.status === 409) {
        toast.error("Email đã tồn tại", {
          description: "Vui lòng sử dụng email khác"
        })
      } else {
        toast.error("Đăng ký thất bại", {
          description: error.message || "Có lỗi xảy ra"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Đăng Ký</h1>
            <p className="text-muted-foreground">
              Tạo tài khoản để trải nghiệm FoodieHub
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Tạo tài khoản mới</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Label>Họ *</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Họ"
                      />
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Label>Tên *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Tên"
                    />
                  </motion.div>
                </div>

                <Label>Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <Label>Số điện thoại *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="0901234567"
                  />
                </div>

                <Label>Mật khẩu *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <Label>Xác nhận mật khẩu *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    />
                    <Label className="text-sm leading-relaxed">
                      Tôi đồng ý <Link to="/terms" className="text-primary">Điều khoản</Link> và{" "}
                      <Link to="/privacy" className="text-primary">Chính sách bảo mật</Link>
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked)}
                    />
                    <Label className="text-sm">Nhận thông tin khuyến mãi</Label>
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                  </Button>
                </motion.div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

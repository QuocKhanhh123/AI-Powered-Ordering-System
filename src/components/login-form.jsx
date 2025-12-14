import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import authService from "@/lib/authService"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function LoginForm() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    })

    useEffect(() => {
        if (authService.isAuthenticated()) {
            const user = authService.getCurrentUser()
            if (user?.roles?.includes("admin")) navigate("/admin/dashboard")
            else navigate("/")
        }

        const remembered = localStorage.getItem("rememberMe")
        if (remembered === "true") {
            setFormData(prev => ({ ...prev, rememberMe: true }))
        }
    }, [])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.email) newErrors.email = "Email là bắt buộc"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ"

        if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc"
        else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin đăng nhập!")
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            const response = await authService.login({
                email: formData.email.trim(),
                password: formData.password,
            })

            if (formData.rememberMe) localStorage.setItem("rememberMe", "true")
            else localStorage.removeItem("rememberMe")

            toast.success("Đăng nhập thành công!", {
                description: "Chào mừng bạn quay trở lại FoodieHub"
            })

            const user = response.user
            let redirectPath = "/"
            if (user?.roles?.includes("admin")) redirectPath = "/admin/dashboard"

            setTimeout(() => navigate(redirectPath), 900)
        } catch (error) {
            if (error.status === 401) {
                toast.error("Đăng nhập thất bại", {
                    description: "Email hoặc mật khẩu không chính xác"
                })
                setErrors({
                    email: "Email hoặc mật khẩu không chính xác",
                    password: "Email hoặc mật khẩu không chính xác"
                })
            } else {
                toast.error("Đăng nhập thất bại", {
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
                        <h1 className="text-3xl font-bold mb-2">Đăng Nhập</h1>
                        <p className="text-muted-foreground">
                            Chào mừng bạn quay trở lại FoodieHub
                        </p>
                    </div>

                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-center">
                                Đăng nhập vào tài khoản
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <Label>Email *</Label>
                                    <div className="relative mt-2">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <Label>Mật khẩu *</Label>
                                    <div className="relative mt-2">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                                            placeholder="••••••••"
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
                                    {errors.password && (
                                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                    )}
                                </motion.div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={formData.rememberMe}
                                            onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                                        />
                                        <Label className="text-sm">Ghi nhớ đăng nhập</Label>
                                    </div>
                                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                                    </Button>
                                </motion.div>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-background px-4 text-muted-foreground">Hoặc</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Đăng nhập với Google
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                        Đăng nhập với Facebook
                                    </Button>
                                </div>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Chưa có tài khoản?{" "}
                                        <Link to="/register" className="text-primary font-medium hover:underline">
                                            Đăng ký ngay
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

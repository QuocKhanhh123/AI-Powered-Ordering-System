import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Wallet, MapPin, Phone, User, Loader2, CheckCircle2 } from "lucide-react"
import apiClient from "@/lib/api"
import authService from "@/lib/authService"
import { toast } from "sonner"

export default function Checkout() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [user, setUser] = useState(null)

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        pickupTime: "",
        notes: "",
        paymentMethod: "zalopay",
    })

    useEffect(() => {
        fetchCartAndUser()
    }, [])

    const fetchCartAndUser = async () => {
        if (!authService.isAuthenticated()) {
            toast.error('Vui lòng đăng nhập để thanh toán')
            navigate('/login')
            return
        }

        try {
            setLoading(true)

            // Fetch cart items
            const cartResponse = await apiClient.get('/api/cart/my-cart')
            const items = cartResponse?.data?.items || []

            const normalizedItems = items.map(item => ({
                id: item._id,
                name: item.name,
                price: item.price,
                image: item.thumbnail,
                quantity: item.quantity,
                note: item.notes || '',
                subtotal: item.subtotal
            }))

            setCartItems(normalizedItems)

            // Get current user info
            const currentUser = authService.getCurrentUser()
            setUser(currentUser)

            // Pre-fill form with user data
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    fullName: currentUser.name || "",
                    phone: currentUser.phone || "",
                }))
            }

            // Set default pickup time (30 minutes from now)
            const defaultPickupTime = new Date()
            defaultPickupTime.setMinutes(defaultPickupTime.getMinutes() + 30)
            const timeString = defaultPickupTime.toTimeString().slice(0, 5)
            setFormData(prev => ({
                ...prev,
                pickupTime: timeString
            }))

            // Redirect if cart is empty
            if (normalizedItems.length === 0) {
                toast.error('Giỏ hàng trống')
                navigate('/cart')
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Không thể tải dữ liệu')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            toast.error('Vui lòng nhập họ tên')
            return false
        }
        if (!formData.phone.trim()) {
            toast.error('Vui lòng nhập số điện thoại')
            return false
        }
        if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
            toast.error('Số điện thoại phải có 10 chữ số')
            return false
        }
        if (!formData.pickupTime) {
            toast.error('Vui lòng chọn thời gian nhận hàng')
            return false
        }
        return true
    }

    const handleSubmitOrder = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setSubmitting(true)

        try {
            // Step 1: Create order from cart
            const orderResponse = await apiClient.post('/api/orders/from-cart', {
                phone: formData.phone.trim(),
                pickupTime: formData.pickupTime,
                notes: formData.notes.trim(),
                paymentMethod: formData.paymentMethod,
            })

            const orderData = orderResponse?.data || orderResponse
            const orderId = orderData?._id

            // Step 2: Create ZaloPay payment
            const paymentResponse = await apiClient.post('/api/payments/zalopay/create', {
                orderId: orderId,
            })

            // Parse response: { success, message, order_url, payment: {transactionId, ...} }
            const orderUrl = paymentResponse?.order_url
            const transactionId = paymentResponse?.payment?.transactionId

            if (!orderUrl) {
                throw new Error(paymentResponse?.message || 'Không nhận được link thanh toán')
            }

            // Save transactionId to localStorage for callback
            if (transactionId) {
                localStorage.setItem('lastTransactionId', transactionId)
            }

            // Step 3: Show success and redirect
            toast.success('Khởi tạo thanh toán thành công!', {
                description: 'Đang chuyển đến ZaloPay...',
                duration: 3000
            })

            // Clear cart event
            window.dispatchEvent(new Event('cartUpdated'))

            // Redirect to ZaloPay immediately
            setTimeout(() => {
                window.location.href = orderUrl
            }, 1500)

        } catch (error) {
            console.error('Error creating order:', error)
            toast.error('Đặt hàng thất bại', {
                description: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
            })
            setSubmitting(false)
        }
    }

    // Calculate totals (no shipping fee for pickup)
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const total = subtotal

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="py-8 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Thanh Toán</h1>
                    <p className="text-muted-foreground">Đặt hàng và thanh toán qua ZaloPay - Đến lấy hàng tại cửa hàng</p>
                </div>

                <form onSubmit={handleSubmitOrder}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Pickup Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Thông Tin Nhận Hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-semibold text-blue-900 mb-1">Địa chỉ cửa hàng</h4>
                                                <p className="text-sm text-blue-700">123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                                                <p className="text-sm text-blue-700 mt-1">📞 Hotline: 0123 456 789</p>
                                                <p className="text-sm text-blue-700">🕐 Giờ mở cửa: 8:00 - 22:00 hàng ngày</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="fullName"
                                                    placeholder="Nhập họ tên"
                                                    value={formData.fullName}
                                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="Nhập số điện thoại"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pickupTime">
                                            Thời gian nhận hàng <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="pickupTime"
                                            type="time"
                                            value={formData.pickupTime}
                                            onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                                            min="08:00"
                                            max="22:00"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Chọn thời gian bạn muốn đến lấy hàng (8:00 - 22:00)
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Ghi chú đơn hàng (tùy chọn)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Thêm ghi chú cho đơn hàng (ví dụ: không cay, thêm rau)"
                                            value={formData.notes}
                                            onChange={(e) => handleInputChange("notes", e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet className="h-5 w-5" />
                                        Phương Thức Thanh Toán
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                                <Wallet className="h-6 w-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg">Thanh toán qua ZaloPay</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Quét mã QR hoặc chuyển khoản qua ZaloPay
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-white rounded-lg border">
                                            <p className="text-sm font-medium mb-2">Thông tin thanh toán:</p>
                                            <div className="space-y-1 text-sm">
                                                <p>📱 Số ZaloPay: <span className="font-semibold">0123 456 789</span></p>
                                                <p>👤 Tên: <span className="font-semibold">Nguyễn Văn A</span></p>
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    * Vui lòng thanh toán trước khi đến lấy hàng
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Đơn Hàng Của Bạn</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Cart Items */}
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-3 py-2">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.quantity} x {item.price.toLocaleString("vi-VN")}đ
                                                    </p>
                                                    {item.note && (
                                                        <p className="text-xs text-muted-foreground italic truncate">
                                                            Ghi chú: {item.note}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Summary */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Tạm tính:</span>
                                            <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Total */}
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Đặt Hàng
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-xs text-center space-y-2">
                                        <p className="text-amber-600 font-medium">
                                            ⚠️ Vui lòng thanh toán qua ZaloPay trước khi đến lấy hàng
                                        </p>
                                        <p className="text-muted-foreground">
                                            Bằng việc đặt hàng, bạn đồng ý với{" "}
                                            <a href="/terms" className="text-primary hover:underline">
                                                Điều khoản dịch vụ
                                            </a>{" "}
                                            của chúng tôi
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Wallet,
  MapPin,
  Phone,
  User,
  Loader2,
  CheckCircle2
} from "lucide-react"
import apiClient from "@/lib/api"
import authService from "@/lib/authService"
import { toast } from "sonner"
import { motion } from "framer-motion"

export default function Checkout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickupTime: "",
    notes: "",
    paymentMethod: "zalopay"
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thanh toán")
      navigate("/login")
      return
    }

    try {
      const cartRes = await apiClient.get("/api/cart/my-cart")
      const items = cartRes?.data?.items || []

      if (!items.length) {
        toast.error("Giỏ hàng trống")
        navigate("/cart")
        return
      }

      setCartItems(items)

      const user = authService.getCurrentUser()
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || ""
        }))
      }

      const time = new Date()
      time.setMinutes(time.getMinutes() + 30)
      setFormData(prev => ({
        ...prev,
        pickupTime: time.toTimeString().slice(0, 5)
      }))
    } catch {
      toast.error("Không thể tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    if (!formData.name.trim()) return toast.error("Vui lòng nhập họ tên")
    if (!/^[0-9]{10}$/.test(formData.phone)) return toast.error("Số điện thoại không hợp lệ")
    if (!formData.pickupTime) return toast.error("Vui lòng chọn thời gian nhận")
    return true
  }

  const submitOrder = async (e) => {
    e.preventDefault()
    if (!validate() || submitting) return

    setSubmitting(true)

    try {
      const orderRes = await apiClient.post("/api/orders/from-cart", {
        phone: formData.phone,
        pickupTime: formData.pickupTime,
        notes: formData.notes,
        paymentMethod: "zalopay"
      })

      const orderId = orderRes?.data?._id || orderRes?._id

      const payRes = await apiClient.post("/api/payments/zalopay/create", {
        orderId
      })

      if (!payRes?.order_url) throw new Error("Không nhận được link thanh toán")

      localStorage.setItem("lastTransactionId", payRes?.payment?.transactionId)

      window.location.href = payRes.order_url
    } catch (err) {
      toast.error("Đặt hàng thất bại", {
        description: err.message
      })
      setSubmitting(false)
    }
  }

  const subtotal = cartItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-1">Thanh Toán</h1>
          <p className="text-muted-foreground">
            Thanh toán ZaloPay – Đến lấy hàng tại cửa hàng
          </p>
        </motion.div>

        <form onSubmit={submitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <User className="h-5 w-5" /> Thông Tin Nhận Hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm">
                          <div className="font-semibold">123 Nguyễn Huệ, Quận 1</div>
                          <div>Giờ mở cửa: 8:00 – 22:00</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label>Họ và tên *</Label>
                        <Input
                          value={formData.name}
                          onChange={e => handleChange("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Số điện thoại *</Label>
                        <Input
                          value={formData.phone}
                          onChange={e => handleChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Thời gian nhận *</Label>
                      <Input
                        type="time"
                        min="08:00"
                        max="22:00"
                        value={formData.pickupTime}
                        onChange={e => handleChange("pickupTime", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Ghi chú</Label>
                      <Textarea
                        rows={2}
                        value={formData.notes}
                        onChange={e => handleChange("notes", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* PAYMENT */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex gap-2 items-center">
                      <Wallet className="h-5 w-5" /> Phương Thức Thanh Toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-primary rounded-xl p-4 bg-primary/5 flex gap-3">
                      <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">ZaloPay</div>
                        <div className="text-sm text-muted-foreground">
                          Thanh toán QR / Ví điện tử
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn Hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cartItems.map(i => (
                    <div key={i._id} className="flex justify-between text-sm">
                      <span>{i.quantity} × {i.name}</span>
                      <span>{(i.price * i.quantity).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {subtotal.toLocaleString("vi-VN")}đ
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Thanh Toán
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    ⚠️ Vui lòng thanh toán trước khi đến lấy hàng
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

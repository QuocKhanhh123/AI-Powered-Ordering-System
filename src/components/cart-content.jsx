import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function CartContent() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [noteTimers, setNoteTimers] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      toast.error("Vui lòng đăng nhập để xem giỏ hàng")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.get("/api/cart/my-cart")
      const items = response?.data?.items || []

      setCartItems(
        items.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          image: item.thumbnail,
          quantity: item.quantity,
          note: item.notes || "",
        }))
      )
    } catch {
      toast.error("Không thể tải giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return removeItem(id)

    const current = cartItems.find(i => i.id === id)

    try {
      await apiClient.put("/api/cart/update-cart-item", {
        cartItemId: id,
        quantity,
        notes: current?.note || ""
      })

      setCartItems(prev =>
        prev.map(i => (i.id === id ? { ...i, quantity } : i))
      )
      window.dispatchEvent(new Event("cartUpdated"))
    } catch {
      toast.error("Không thể cập nhật số lượng")
      fetchCartItems()
    }
  }

  const removeItem = async (id) => {
    try {
      await apiClient.delete(`/api/cart/remove-from-cart/${id}`)
      setCartItems(prev => prev.filter(i => i.id !== id))
      toast.success("Đã xóa sản phẩm")
      window.dispatchEvent(new Event("cartUpdated"))
    } catch {
      toast.error("Không thể xóa sản phẩm")
    }
  }

  const clearCart = async () => {
    try {
      await apiClient.delete("/api/cart/clear-cart")
      setCartItems([])
      toast.success("Đã xóa toàn bộ giỏ hàng")
      window.dispatchEvent(new Event("cartUpdated"))
    } catch {
      toast.error("Không thể xóa giỏ hàng")
    }
  }

  const updateNote = (id, note) => {
    setCartItems(prev =>
      prev.map(i => (i.id === id ? { ...i, note } : i))
    )

    if (noteTimers[id]) clearTimeout(noteTimers[id])

    const timer = setTimeout(async () => {
      const current = cartItems.find(i => i.id === id)
      try {
        await apiClient.put("/api/cart/update-cart-item", {
          cartItemId: id,
          quantity: current?.quantity || 1,
          notes: note
        })
      } catch {
        toast.error("Không thể cập nhật ghi chú")
        fetchCartItems()
      }
    }, 800)

    setNoteTimers(prev => ({ ...prev, [id]: timer }))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") setDiscount(0.1)
    else if (promoCode.toLowerCase() === "freeship") setDiscount(0.05)
    else setDiscount(0)
  }

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const discountAmount = subtotal * discount
  // Đã bỏ phí vận chuyển hoàn toàn
  const total = subtotal - discountAmount

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!cartItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20 text-center"
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-muted-foreground mb-6">
          Hãy thêm món ngon vào giỏ hàng của bạn
        </p>
        <Link to="/menu">
          <Button size="lg">
            Khám phá thực đơn <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-1">Giỏ Hàng</h1>
            <p className="text-muted-foreground">
              Kiểm tra lại đơn hàng trước khi thanh toán
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa toàn bộ giỏ hàng?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={clearCart}>
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="text-primary font-bold">
                            {item.price.toLocaleString("vi-VN")}đ
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Input
                            value={item.note}
                            onChange={(e) => updateNote(item.id, e.target.value)}
                            placeholder="Ghi chú cho món ăn"
                          />

                          <div className="flex justify-between border-t pt-2">
                            <span className="text-sm text-muted-foreground">Thành tiền</span>
                            <span className="font-bold text-primary">
                              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mã Giảm Giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Áp dụng
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600">
                    Đã áp dụng giảm {(discount * 100).toFixed(0)}%
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                {/* Đã xóa dòng Phí vận chuyển */}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                </div>

                <Link to="/checkout">
                  <Button size="lg" className="w-full mt-2">
                    Thanh Toán <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Link to="/menu">
              <Button variant="outline" className="w-full bg-transparent">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
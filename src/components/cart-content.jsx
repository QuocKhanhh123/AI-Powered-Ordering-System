import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

// Mock cart data
const initialCartItems = [
    {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        price: 89000,
        quantity: 2,
        image: "/assets/images/vietnamese-pho-bo-with-beef-and-herbs.jpg",
        note: "Ít hành",
    },
    {
        id: 2,
        name: "Bánh Mì Thịt Nướng",
        price: 35000,
        quantity: 1,
        image: "/assets/images/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg",
        note: "",
    },
    {
        id: 3,
        name: "Gỏi Cuốn Tôm Thịt",
        price: 45000,
        quantity: 3,
        image: "/assets/images/vietnamese-fresh-spring-rolls-with-shrimp-and-pork.jpg",
        note: "Thêm nước chấm",
    },
]

export default function CartContent() {
    const [cartItems, setCartItems] = useState(initialCartItems)
    const [promoCode, setPromoCode] = useState("")
    const [discount, setDiscount] = useState(0)

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            setCartItems(cartItems.filter((item) => item.id !== id))
        } else {
            setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
        }
    }

    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id))
    }

    const updateNote = (id, note) => {
        setCartItems(cartItems.map((item) => (item.id === id ? { ...item, note } : item)))
    }

    const applyPromoCode = () => {
        if (promoCode.toLowerCase() === "welcome10") {
            setDiscount(0.1) // 10%
        } else if (promoCode.toLowerCase() === "freeship") {
            setDiscount(0.05) // 5%
        } else {
            setDiscount(0)
        }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = subtotal * discount
    const shippingFee = subtotal >= 200000 ? 0 : 25000
    const total = subtotal - discountAmount + shippingFee

    if (cartItems.length === 0) {
        return (
            <div className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6">
                        <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
                            <p className="text-muted-foreground">Hãy thêm một số món ăn ngon vào giỏ hàng của bạn!</p>
                        </div>
                        <Link to="/menu">
                            <Button size="lg">
                                Khám phá thực đơn
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Giỏ Hàng Của Bạn</h1>
                    <p className="text-muted-foreground">Xem lại các món ăn đã chọn trước khi thanh toán</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Product Image */}
                                        <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm font-medium">Số lượng:</span>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 bg-transparent"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Note */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Ghi chú:</label>
                                                <Input
                                                    placeholder="Thêm ghi chú cho món ăn..."
                                                    value={item.note}
                                                    onChange={(e) => updateNote(item.id, e.target.value)}
                                                    className="text-sm"
                                                />
                                            </div>

                                            {/* Item Total */}
                                            <div className="flex justify-between items-center pt-2 border-t">
                                                <span className="text-sm text-muted-foreground">Thành tiền:</span>
                                                <span className="font-bold text-primary">
                                                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Promo Code */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Mã Giảm Giá</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Nhập mã giảm giá"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <Button variant="outline" onClick={applyPromoCode}>
                                        Áp dụng
                                    </Button>
                                </div>
                                {discount > 0 && (
                                    <div className="text-sm text-green-600">
                                        Mã giảm giá đã được áp dụng! Giảm {(discount * 100).toFixed(0)}%
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tóm Tắt Đơn Hàng</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Giảm giá:</span>
                                            <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Phí vận chuyển:</span>
                                        <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}</span>
                                    </div>
                                    {subtotal < 200000 && (
                                        <div className="text-sm text-muted-foreground">
                                            Thêm {(200000 - subtotal).toLocaleString("vi-VN")}đ để được miễn phí vận chuyển
                                        </div>
                                    )}
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Tổng cộng:</span>
                                        <span className="text-primary">{total.toLocaleString("vi-VN")}đ</span>
                                    </div>
                                </div>
                                <Link to="/checkout" className="block">
                                    <Button size="lg" className="w-full">
                                        Tiến Hành Thanh Toán
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Link to="/menu">
                            <Button variant="outline" className="w-full bg-transparent">
                                Tiếp tục mua sắm
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

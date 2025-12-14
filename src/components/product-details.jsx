import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  ArrowLeft,
  Loader2,
  ShoppingCart
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"
import ReviewSection from "./ReviewSection"
import { motion } from "framer-motion"

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(`/api/menu-items/item/${productId}`)
        setProduct(response)
      } catch {
        toast.error("Không thể tải thông tin sản phẩm")
      } finally {
        setLoading(false)
      }
    }

    if (productId) fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/menu">
          <Button>Quay lại thực đơn</Button>
        </Link>
      </div>
    )
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
      navigate("/login")
      return
    }

    await apiClient.post("/api/cart/add-to-cart", {
      menuItemId: product.id,
      quantity,
      notes: ""
    })

    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
    setQuantity(1)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleBuyNow = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để mua hàng")
      navigate("/login")
      return
    }

    await apiClient.post("/api/cart/add-to-cart", {
      menuItemId: product.id,
      quantity,
      notes: ""
    })

    window.dispatchEvent(new Event("cartUpdated"))
    navigate("/cart")
  }

  const totalPrice = product.finalPrice * quantity

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link
            to="/menu"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="inline h-4 w-4 mr-1" />
            Quay lại thực đơn
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <motion.img
                src={product.images?.[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-96 lg:h-[520px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              {product.isDiscountActive && (
                <Badge className="absolute top-4 left-4" variant="destructive">
                  Giảm giá
                </Badge>
              )}
              {product.rateCount > 200 && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  Bán chạy
                </Badge>
              )}
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "text-red-500 border-red-500" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rate)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-1">{product.rate}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.rateCount} đánh giá)
                </span>
                <Badge variant="outline">{product.category}</Badge>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {product.finalPrice.toLocaleString("vi-VN")}đ
                </span>
                {product.isDiscountActive && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.price.toLocaleString("vi-VN")}đ
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">Số lượng:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm vào giỏ - {totalPrice.toLocaleString("vi-VN")}đ
              </Button>
              <Button size="lg" variant="outline" onClick={handleBuyNow}>
                Mua ngay
              </Button>
            </div>

            {product.ingredients?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Thành phần</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((i, idx) => (
                    <Badge key={idx} variant="outline">
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.nutritionalInformation?.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">
                    Thông tin dinh dưỡng (1 phần)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.nutritionalInformation.map((n, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{n.name}</span>
                        <span className="font-medium">
                          {n.value}
                          {n.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14"
        >
          <ReviewSection menuItemId={product.id} />
        </motion.div>
      </div>
    </section>
  )
}

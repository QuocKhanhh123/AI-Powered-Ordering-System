import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"
import { motion } from "framer-motion"

export default function PopularProducts() {
  const [popularItems, setPopularItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPopularProducts()
  }, [])

  const fetchPopularProducts = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get("/api/menu-items")
      const items = response.data || []

      const popular = items
        .filter(item => item.isAvailable !== false)
        .sort((a, b) => (b.rateCount || 0) - (a.rateCount || 0))
        .slice(0, 6)
        .map(item => ({
          id: item.id || item._id,
          name: item.name,
          description: item.description,
          price: item.finalPrice || item.price,
          image: item.thumbnail,
          rating: item.rate || 0,
          orders: item.rateCount || 0
        }))

      setPopularItems(popular)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (item) => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng")
      return
    }

    await apiClient.post("/api/cart/add-to-cart", {
      menuItemId: item.id,
      quantity: 1,
      notes: ""
    })

    toast.success(`Đã thêm ${item.name} vào giỏ hàng`)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold">
              Món Ăn <span className="text-primary">Bán Chạy</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những món ăn được yêu thích và đặt hàng nhiều nhất
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="group hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                >
                  <div className="relative">
                    <motion.img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                    <Badge className="absolute top-3 left-3 bg-primary">
                      #{index + 1}
                    </Badge>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{item.rating}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {item.orders.toLocaleString("vi-VN")} đã bán
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {item.price.toLocaleString("vi-VN")}đ
                      </span>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToCart(item)
                        }}
                      >
                        Đặt ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/menu">
            <Button size="lg">Khám Phá Thêm Món Ngon</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Plus, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"
import { motion, AnimatePresence } from "framer-motion"

export default function MenuContent() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get("/api/menu-items")
        const items = Array.isArray(response) ? response : response.data || []
        setMenuItems(items)

        const categoryMap = items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})

        setCategories([
          { id: "all", name: "Tất cả", count: items.length },
          ...Object.entries(categoryMap).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, "-"),
            name,
            count
          }))
        ])
      } catch {
        toast.error("Không thể tải danh sách món ăn")
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getBadgeText = (item) => {
    if (item.isDiscountActive) return "Giảm giá"
    if (item.rateCount > 200) return "Bán chạy"
    return null
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
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-10"
        >
          <h1 className="text-3xl lg:text-4xl font-bold">
            Thực Đơn <span className="text-primary">FoodieHub</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá hương vị đặc sắc từ khắp mọi miền đất nước
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </motion.div>

        {!loading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                <span>{category.name}</span>
                <Badge variant="secondary">{category.count}</Badge>
              </Button>
            ))}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((item, index) => {
                  const badgeText = getBadgeText(item)

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ delay: index * 0.05 }}
                      layout
                    >
                      <Card className="group hover:shadow-xl transition-all overflow-hidden">
                        <div className="relative">
                          <motion.img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.4 }}
                          />

                          {badgeText && (
                            <Badge
                              className="absolute top-3 left-3"
                              variant={badgeText === "Giảm giá" ? "destructive" : "secondary"}
                            >
                              {badgeText}
                            </Badge>
                          )}

                          {!item.isAvailable && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-lg">
                                Hết hàng
                              </Badge>
                            </div>
                          )}

                          {item.isAvailable && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100"
                              onClick={() => handleAddToCart(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-accent text-accent" />
                            <span className="text-sm font-medium">
                              {item.rate.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({item.rateCount})
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {item.finalPrice.toLocaleString("vi-VN")}đ
                            </span>
                            <Button
                              size="sm"
                              disabled={!item.isAvailable}
                              onClick={() => handleAddToCart(item)}
                            >
                              {item.isAvailable ? "Thêm" : "Hết hàng"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-muted-foreground"
              >
                Không tìm thấy món ăn phù hợp
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}

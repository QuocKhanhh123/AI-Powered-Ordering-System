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
                const response = await apiClient.get('/api/menu-items')

                const items = Array.isArray(response) ? response : response.data || []
                setMenuItems(items)

                const categoryMap = items.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + 1
                    return acc
                }, {})

                const categoryList = [
                    { id: "all", name: "Tất cả", count: items.length },
                    ...Object.entries(categoryMap).map(([name, count]) => ({
                        id: name.toLowerCase().replace(/\s+/g, '-'),
                        name,
                        count
                    }))
                ]

                setCategories(categoryList)
            } catch (error) {
                console.error('Error fetching menu items:', error)
                toast.error('Không thể tải danh sách món ăn')
            } finally {
                setLoading(false)
            }
        }

        fetchMenuItems()
    }, [])

    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = selectedCategory === "all" ||
            item.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
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

    const getDiscountPercent = (price, discountPrice) => {
        if (!discountPrice || discountPrice >= price) return 0
        return Math.round(((price - discountPrice) / price) * 100)
    }

    const handleAddToCart = async (item) => {
        if (!authService.isAuthenticated()) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng')
            return
        }

        try {
            await apiClient.post('/api/cart/add-to-cart', {
                menuItemId: item.id,
                quantity: 1,
                notes: ''
            })
            toast.success(`Đã thêm ${item.name} vào giỏ hàng`)
            window.dispatchEvent(new Event('cartUpdated'))
        } catch (error) {
            console.error('Error adding to cart:', error)
            toast.error(error.message || 'Không thể thêm vào giỏ hàng')
        }
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-balance">
                        Thực Đơn <span className="text-primary">FoodieHub</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Khám phá hương vị đặc sắc từ khắp mọi miền đất nước
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm món ăn..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button variant="outline" className="sm:w-auto bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc
                    </Button>
                </div>

                {/* Categories */}
                {!loading && categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category.id)}
                                className="flex items-center space-x-2"
                            >
                                <span>{category.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                    {category.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {/* Menu Grid */}
                        {filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredItems.map((item) => {
                                    const badgeText = getBadgeText(item)
                                    const discount = getDiscountPercent(item.price, item.discountPrice)

                                    return (
                                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                            <div className="relative">
                                                <img
                                                    src={item.thumbnail || "/placeholder.svg"}
                                                    alt={item.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.svg"
                                                    }}
                                                />
                                                {badgeText && (
                                                    <Badge
                                                        className="absolute top-3 left-3"
                                                        variant={badgeText === "Giảm giá" ? "destructive" : "secondary"}
                                                    >
                                                        {badgeText}
                                                        {discount > 0 && ` -${discount}%`}
                                                    </Badge>
                                                )}
                                                {!item.isAvailable && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <Badge variant="destructive" className="text-lg">Hết hàng</Badge>
                                                    </div>
                                                )}
                                                {item.isAvailable && (
                                                    <Button
                                                        size="icon"
                                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        variant="secondary"
                                                        onClick={() => handleAddToCart(item)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <CardContent className="p-4 space-y-3">
                                                <div>
                                                    <Link to={`/product/${item.id}`}>
                                                        <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors cursor-pointer">
                                                            {item.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 fill-accent text-accent" />
                                                        <span className="text-sm font-medium">{item.rate.toFixed(1)}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">({item.rateCount})</span>
                                                </div>

                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <span className="text-lg font-bold text-primary">
                                                                {item.finalPrice.toLocaleString("vi-VN")}đ
                                                            </span>
                                                            {item.isDiscountActive && item.price > item.discountPrice && (
                                                                <span className="text-sm text-muted-foreground line-through">
                                                                    {item.price.toLocaleString("vi-VN")}đ
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
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
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Không tìm thấy món ăn nào phù hợp với tìm kiếm của bạn.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Plus } from "lucide-react"
import { Link } from "react-router-dom"

const categories = [
    { id: "all", name: "Tất cả", count: 24 },
    { id: "pho", name: "Phở", count: 6 },
    { id: "banh-mi", name: "Bánh Mì", count: 4 },
    { id: "com", name: "Cơm", count: 5 },
    { id: "bun", name: "Bún", count: 4 },
    { id: "khai-vi", name: "Khai Vị", count: 3 },
    { id: "do-uong", name: "Đồ Uống", count: 2 },
]

const menuItems = [
    {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        description: "Nước dùng trong, thịt bò tươi ngon, bánh phở dai ngon",
        price: 89000,
        originalPrice: 99000,
        image: "/assets/images/vietnamese-pho-bo-with-beef-and-herbs.jpg",
        rating: 4.8,
        reviews: 234,
        category: "pho",
        badge: "Bán chạy",
        isAvailable: true,
    },
    {
        id: 2,
        name: "Bánh Mì Thịt Nướng",
        description: "Bánh mì giòn, thịt nướng thơm lừng, rau sống tươi mát",
        price: 35000,
        originalPrice: null,
        image: "/assets/images/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg",
        rating: 4.9,
        reviews: 156,
        category: "banh-mi",
        badge: "Mới",
        isAvailable: true,
    },
    {
        id: 3,
        name: "Cơm Tấm Sườn Nướng",
        description: "Cơm tấm truyền thống, sườn nướng đậm đà, chả trứng",
        price: 65000,
        originalPrice: 75000,
        image: "/assets/images/vietnamese-com-tam-with-grilled-pork-ribs.jpg",
        rating: 4.7,
        reviews: 189,
        category: "com",
        badge: "Giảm giá",
        isAvailable: true,
    },
    {
        id: 4,
        name: "Bún Bò Huế",
        description: "Hương vị cay nồng đặc trưng xứ Huế, thịt bò và chả cua",
        price: 79000,
        originalPrice: null,
        image: "/assets/images/vietnamese-bun-bo-hue-spicy-noodle-soup.jpg",
        rating: 4.6,
        reviews: 98,
        category: "bun",
        badge: "Đặc sản",
        isAvailable: true,
    },
    {
        id: 5,
        name: "Gỏi Cuốn Tôm Thịt",
        description: "Tươi mát, thanh đạm với nước chấm đặc biệt",
        price: 45000,
        originalPrice: null,
        image: "/assets/images/vietnamese-fresh-spring-rolls-with-shrimp-and-pork.jpg",
        rating: 4.8,
        reviews: 125,
        category: "khai-vi",
        badge: null,
        isAvailable: true,
    },
    {
        id: 6,
        name: "Chả Cá Lã Vọng",
        description: "Đặc sản Hà Nội với hương vị truyền thống, ăn kèm bún và rau thơm",
        price: 120000,
        originalPrice: null,
        image: "/assets/images/vietnamese-cha-ca-la-vong-grilled-fish-with-turmer.jpg",
        rating: 4.9,
        reviews: 89,
        category: "bun",
        badge: "Đặc sản",
        isAvailable: false,
    },
    {
        id: 7,
        name: "Bánh Xèo Miền Tây",
        description: "Giòn rụm, nhân tôm thịt đầy đặn, ăn kèm rau sống",
        price: 55000,
        originalPrice: null,
        image: "/assets/images/banh-xeo.png",
        rating: 4.7,
        reviews: 210,
        category: "khai-vi",
        badge: null,
        isAvailable: true,
    },
    {
        id: 8,
        name: "Cao Lầu Hội An",
        description: "Món ăn đặc trưng của phố cổ Hội An với mì dai và nước dùng đậm đà",
        price: 68000,
        originalPrice: null,
        image: "/assets/images/vietnamese-cao-lau-noodles-from-hoi-an.jpg",
        rating: 4.6,
        reviews: 76,
        category: "bun",
        badge: "Đặc sản",
        isAvailable: true,
    },
]

export default function MenuContent() {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredItems = menuItems.filter((item) => {
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

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

                {/* Menu Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="relative">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.badge && (
                                    <Badge
                                        className="absolute top-3 left-3"
                                        variant={item.badge === "Giảm giá" ? "destructive" : "secondary"}
                                    >
                                        {item.badge}
                                    </Badge>
                                )}
                                {!item.isAvailable && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Badge variant="destructive">Hết hàng</Badge>
                                    </div>
                                )}
                                <Button
                                    size="icon"
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                    variant="secondary"
                                    disabled={!item.isAvailable}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
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
                                        <span className="text-sm font-medium">{item.rating}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">({item.reviews})</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-primary">{item.price.toLocaleString("vi-VN")}đ</span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {item.originalPrice.toLocaleString("vi-VN")}đ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button size="sm" disabled={!item.isAvailable}>
                                        {item.isAvailable ? "Thêm vào giỏ" : "Hết hàng"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No results */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Không tìm thấy món ăn nào phù hợp với tìm kiếm của bạn.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

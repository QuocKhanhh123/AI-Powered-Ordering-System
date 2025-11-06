import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"

const featuredItems = [
    {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        description: "Nước dùng trong, thịt bò tươi ngon",
        price: 89000,
        originalPrice: 99000,
        image: "/assets/images/vietnamese-pho-bo-with-beef-and-herbs.jpg",
        rating: 4.8,
        reviews: 234,
        badge: "Bán chạy",
    },
    {
        id: 2,
        name: "Bánh Mì Thịt Nướng",
        description: "Bánh mì giòn, thịt nướng thơm lừng",
        price: 35000,
        originalPrice: null,
        image: "/assets/images/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg",
        rating: 4.9,
        reviews: 156,
        badge: "Mới",
    },
    {
        id: 3,
        name: "Cơm Tấm Sườn Nướng",
        description: "Cơm tấm truyền thống đậm đà",
        price: 65000,
        originalPrice: 75000,
        image: "/assets/images/vietnamese-com-tam-with-grilled-pork-ribs.jpg",
        rating: 4.7,
        reviews: 189,
        badge: "Giảm giá",
    },
    {
        id: 4,
        name: "Bún Bò Huế",
        description: "Hương vị cay nồng đặc trưng xứ Huế",
        price: 79000,
        originalPrice: null,
        image: "/assets/images/vietnamese-bun-bo-hue-spicy-noodle-soup.jpg",
        rating: 4.6,
        reviews: 98,
        badge: "Đặc sản",
    },
]

export default function FeaturedProducts() {
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
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                        Gợi Ý <span className="text-primary">Dành Cho Bạn</span>
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Những món ăn được cá nhân hóa dựa trên sở thích và lịch sử đặt hàng của bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredItems.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="relative">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge
                                    className="absolute top-3 left-3"
                                    variant={item.badge === "Giảm giá" ? "destructive" : "secondary"}
                                >
                                    {item.badge}
                                </Badge>
                                <Button
                                    size="icon"
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                    variant="secondary"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-lg text-balance leading-tight">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
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
                                            <span className="text-lg font-bold text-primary">
                                                {item.price.toLocaleString("vi-VN")}đ
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    {item.originalPrice.toLocaleString("vi-VN")}đ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => handleAddToCart(item)}>
                                        Thêm vào giỏ
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/menu">
                        <Button variant="outline" size="lg">
                            Xem Tất Cả Món Ăn
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

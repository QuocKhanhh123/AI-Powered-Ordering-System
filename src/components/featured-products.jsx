import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import apiClient from "@/lib/api"
import { toast } from "sonner"
import authService from "@/lib/authService"

export default function FeaturedProducts() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            // Fetch menu items và lấy 4 items có rating cao nhất
            const response = await apiClient.get('/api/menu-items');
            const items = response.data || [];

            // Sort by rating và lấy top 4
            const featured = items
                .filter(item => item.isAvailable !== false)
                .sort((a, b) => (b.rate || 0) - (a.rate || 0))
                .slice(0, 4)
                .map(item => ({
                    id: item.id || item._id,
                    name: item.name,
                    description: item.description,
                    price: item.finalPrice || item.price,
                    originalPrice: item.isDiscountActive ? item.price : null,
                    image: item.thumbnail,
                    rating: item.rate || 0,
                    reviews: item.rateCount || 0,
                    badge: item.isDiscountActive ? "Giảm giá" : (item.rateCount > 200 ? "Bán chạy" : "Đặc sản")
                }));

            setFeaturedItems(featured);
        } catch (error) {
            console.error('Error fetching featured products:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleViewDetail = (itemId) => {
        navigate(`/product/${itemId}`);
    };

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

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : featuredItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Không có sản phẩm nào
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredItems.map((item) => (
                            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => handleViewDetail(item.id)}>
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
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
                                        <Button size="sm" onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}>
                                            Thêm vào giỏ
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

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

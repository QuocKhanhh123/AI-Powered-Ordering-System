import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Minus, Plus, Heart, Share2, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data - trong thực tế sẽ fetch từ API
const productData = {
    1: {
        id: 1,
        name: "Phở Bò Đặc Biệt",
        description:
            "Nước dùng trong vắt được ninh từ xương bò trong nhiều giờ, thịt bò tươi ngon được thái mỏng, bánh phở dai ngon. Món phở này được chế biến theo công thức truyền thống của Hà Nội, mang đến hương vị đậm đà và thơm ngon khó cưỡng.",
        price: 89000,
        originalPrice: 99000,
        images: ["/assets/images/vietnamese-pho-bo-with-beef-and-herbs.jpg", "/vietnamese-pho-bo-with-beef-and-herbs.jpg"],
        rating: 4.8,
        reviews: 234,
        category: "Phở",
        badge: "Bán chạy",
        isAvailable: true,
        ingredients: ["Bánh phở", "Thịt bò", "Hành lá", "Ngò gai", "Giá đỗ", "Nước dùng xương bò"],
        nutrition: {
            calories: 450,
            protein: 25,
            carbs: 55,
            fat: 12,
        },
        portion: "Dành cho 1 người",
        prepTime: "15-20 phút",
    },
    2: {
        id: 2,
        name: "Bánh Mì Thịt Nướng",
        description:
            "Bánh mì giòn rụm được nướng tươi mỗi ngày, thịt nướng thơm lừng được ướp gia vị đặc biệt, kết hợp với rau sống tươi mát và nước sốt đậm đà. Đây là món ăn đường phố được yêu thích nhất của Việt Nam.",
        price: 35000,
        originalPrice: null,
        images: [
            "/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg",
            "/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg",
        ],
        rating: 4.9,
        reviews: 156,
        category: "Bánh Mì",
        badge: "Mới",
        isAvailable: true,
        ingredients: ["Bánh mì", "Thịt nướng", "Pate", "Rau sống", "Dưa chua", "Nước sốt"],
        nutrition: {
            calories: 380,
            protein: 20,
            carbs: 45,
            fat: 15,
        },
        portion: "Dành cho 1 người",
        prepTime: "10-15 phút",
    },
}

const reviews = [
    {
        id: 1,
        user: "Nguyễn Văn A",
        rating: 5,
        comment: "Phở rất ngon, nước dùng trong vắt và thơm. Thịt bò tươi, bánh phở dai ngon. Sẽ đặt lại!",
        date: "2 ngày trước",
        avatar: "/assets/images/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        user: "Trần Thị B",
        rating: 4,
        comment: "Món ăn ngon, giao hàng nhanh. Chỉ có điều hơi ít thịt so với giá tiền.",
        date: "1 tuần trước",
        avatar: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        user: "Lê Văn C",
        rating: 5,
        comment: "Tuyệt vời! Đúng vị phở Hà Nội truyền thống. Nhà hàng này rất uy tín.",
        date: "2 tuần trước",
        avatar: "/placeholder.svg?height=40&width=40",
    },
]

export default function ProductDetail({ productId }) {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)

    const product = productData[productId]

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
                    <Link to="/menu">
                        <Button>Quay lại thực đơn</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const handleQuantityChange = (change) => {
        setQuantity(Math.max(1, quantity + change))
    }

    const totalPrice = product.price * quantity

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 mb-6 text-sm">
                    <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1 inline" />
                        Quay lại thực đơn
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src={product.images[selectedImage] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-96 lg:h-[500px] object-cover"
                            />
                            {product.badge && (
                                <Badge
                                    className="absolute top-4 left-4"
                                    variant={product.badge === "Giảm giá" ? "destructive" : "secondary"}
                                >
                                    {product.badge}
                                </Badge>
                            )}
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex space-x-2">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-primary" : "border-transparent"
                                            }`}
                                    >
                                        <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h1 className="text-3xl font-bold text-balance">{product.name}</h1>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={isFavorite ? "text-red-500 border-red-500" : ""}
                                    >
                                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex items-center space-x-1">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium">{product.rating}</span>
                                </div>
                                <span className="text-muted-foreground">({product.reviews} đánh giá)</span>
                                <Badge variant="outline">{product.category}</Badge>
                            </div>

                            <div className="flex items-center space-x-3 mb-6">
                                <span className="text-3xl font-bold text-primary">{product.price.toLocaleString("vi-VN")}đ</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {product.originalPrice.toLocaleString("vi-VN")}đ
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Khẩu phần:</span>
                                <p className="text-muted-foreground">{product.portion}</p>
                            </div>
                            <div>
                                <span className="font-medium">Thời gian chuẩn bị:</span>
                                <p className="text-muted-foreground">{product.prepTime}</p>
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="font-medium">Số lượng:</span>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button size="lg" className="flex-1">
                                    Thêm vào giỏ - {totalPrice.toLocaleString("vi-VN")}đ
                                </Button>
                                <Button variant="outline" size="lg">
                                    Mua ngay
                                </Button>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <h3 className="font-semibold mb-3">Thành phần:</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.ingredients.map((ingredient, index) => (
                                    <Badge key={index} variant="outline">
                                        {ingredient}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-3">Thông tin dinh dưỡng (1 phần):</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between">
                                        <span>Calories:</span>
                                        <span className="font-medium">{product.nutrition.calories} kcal</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Protein:</span>
                                        <span className="font-medium">{product.nutrition.protein}g</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Carbs:</span>
                                        <span className="font-medium">{product.nutrition.carbs}g</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Fat:</span>
                                        <span className="font-medium">{product.nutrition.fat}g</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Đánh giá từ khách hàng</h2>
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={review.avatar || "/placeholder.svg"}
                                            alt={review.user}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold">{review.user}</h4>
                                                <span className="text-sm text-muted-foreground">{review.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium">{review.rating}/5</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

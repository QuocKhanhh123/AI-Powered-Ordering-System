import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

const popularItems = [
    {
        id: 5,
        name: "Gỏi Cuốn Tôm Thịt",
        description: "Tươi mát, thanh đạm với nước chấm đặc biệt",
        price: 45000,
        image: "/assets/images/vietnamese-fresh-spring-rolls-with-shrimp-and-pork.jpg",
        rating: 4.8,
        orders: 1250,
    },
    {
        id: 6,
        name: "Chả Cá Lã Vọng",
        description: "Đặc sản Hà Nội với hương vị truyền thống",
        price: 120000,
        image: "/assets/images/vietnamese-cha-ca-la-vong-grilled-fish-with-turmer.jpg",
        rating: 4.9,
        orders: 890,
    },
    {
        id: 7,
        name: "Bánh Xèo Miền Tây",
        description: "Giòn rụm, nhân tôm thịt đầy đặn",
        price: 55000,
        image: "/assets/images/banh-xeo.png",
        rating: 4.7,
        orders: 2100,
    },
    {
        id: 8,
        name: "Cao Lầu Hội An",
        description: "Món ăn đặc trưng của phố cổ Hội An",
        price: 68000,
        image: "/assets/images/vietnamese-cao-lau-noodles-from-hoi-an.jpg",
        rating: 4.6,
        orders: 756,
    },
    {
        id: 9,
        name: "Nem Nướng Nha Trang",
        description: "Thơm ngon, ăn kèm bánh tráng và rau sống",
        price: 85000,
        image: "/assets/images/vietnamese-nem-nuong-grilled-pork-sausage-from-nha.jpg",
        rating: 4.8,
        orders: 1456,
    },
    {
        id: 10,
        name: "Mì Quảng Đà Nẵng",
        description: "Nước dùng đậm đà, topping phong phú",
        price: 72000,
        image: "/assets/images/vietnamese-mi-quang-noodles-from-da-nang.jpg",
        rating: 4.7,
        orders: 934,
    },
]

export default function PopularProducts() {
    return (
        <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <div className="flex items-center justify-center space-x-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                            Món Ăn <span className="text-primary">Bán Chạy</span>
                        </h2>
                    </div>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Những món ăn được yêu thích nhất, được đặt hàng nhiều nhất trong tuần
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularItems.map((item, index) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                            <div className="relative">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <Badge className="absolute top-3 left-3 bg-primary">#{index + 1}</Badge>
                            </div>

                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-semibold text-lg text-balance leading-tight">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground text-pretty">{item.description}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <Star className="h-4 w-4 fill-accent text-accent" />
                                            <span className="font-medium">{item.rating}</span>
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground">
                                        {item.orders.toLocaleString("vi-VN")} đã bán
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-primary">
                                        {item.price.toLocaleString("vi-VN")}đ
                                    </span>
                                    <Link to={`/product/${item.id}`}>
                                        <Button size="sm">Đặt ngay</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/menu">
                        <Button size="lg">Khám Phá Thêm Món Ngon</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

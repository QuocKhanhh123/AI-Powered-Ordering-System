import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shield, Truck, Star } from "lucide-react"

const features = [
    {
        icon: Clock,
        title: "Giao Hàng Nhanh",
        description: "Cam kết giao hàng trong vòng 30 phút cho khu vực nội thành",
    },
    {
        icon: Shield,
        title: "An Toàn Thực Phẩm",
        description: "Nguyên liệu tươi sạch, quy trình chế biến đảm bảo vệ sinh",
    },
    {
        icon: Truck,
        title: "Miễn Phí Giao Hàng",
        description: "Miễn phí giao hàng cho đơn hàng từ 200,000đ trở lên",
    },
    {
        icon: Star,
        title: "Chất Lượng Đảm Bảo",
        description: "Hoàn tiền 100% nếu không hài lòng về chất lượng món ăn",
    },
]

export default function WhyChooseUs() {
    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                        Tại Sao Chọn <span className="text-primary">FoodieHub</span>?
                    </h2>
                    <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                        Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất cho khách hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6 space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

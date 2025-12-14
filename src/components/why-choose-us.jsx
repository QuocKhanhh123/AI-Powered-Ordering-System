import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shield, Truck, Star } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  { icon: Clock, title: "Giao Hàng Nhanh", description: "Cam kết giao hàng trong vòng 30 phút cho khu vực nội thành" },
  { icon: Shield, title: "An Toàn Thực Phẩm", description: "Nguyên liệu tươi sạch, quy trình chế biến đảm bảo vệ sinh" },
  { icon: Truck, title: "Miễn Phí Giao Hàng", description: "Miễn phí giao hàng cho đơn hàng từ 200,000đ trở lên" },
  { icon: Star, title: "Chất Lượng Đảm Bảo", description: "Hoàn tiền 100% nếu không hài lòng về chất lượng món ăn" }
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold">
            Tại Sao Chọn <span className="text-primary">FoodieHub</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm ẩm thực tuyệt vời nhất
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center group hover:shadow-xl transition-all">
                <CardContent className="p-6 space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                  >
                    <feature.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

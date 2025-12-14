import React from "react"
import { ArrowRight, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/30 py-20 lg:py-32 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Được tin tưởng bởi 10,000+ khách hàng
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Trải nghiệm ẩm thực{" "}
                <span className="text-primary">thông minh</span>,{" "}
                <span className="text-accent">dành riêng cho bạn</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Khám phá hương vị đặc sắc từ những món ăn được chế biến tươi ngon mỗi ngày.
                Đặt hàng dễ dàng, giao hàng nhanh chóng, trải nghiệm tuyệt vời.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button size="lg" className="group">
                  Khám Phá Thực Đơn Ngay
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Xem Video Giới Thiệu
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              {[
                { label: "Đơn hàng", value: "50K+" },
                { label: "Đánh giá", value: "4.9" },
                { label: "Giao hàng", value: "30 phút" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <motion.img
                src="/assets/images/delicious-vietnamese-food-spread-with-pho--banh-mi.jpg"
                alt="Món ăn đặc sắc"
                className="w-full h-[500px] lg:h-[600px] object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -top-4 -left-4 bg-card border rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  🍜
                </div>
                <div>
                  <div className="font-semibold text-sm">Phở Bò Đặc Biệt</div>
                  <div className="text-primary font-bold">89,000đ</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -right-4 bg-card border rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  🥖
                </div>
                <div>
                  <div className="font-semibold text-sm">Bánh Mì Thịt Nướng</div>
                  <div className="text-accent font-bold">35,000đ</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

import React from "react";
import { ArrowRight, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
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
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Trải nghiệm ẩm thực <span className="text-primary">thông minh</span>,{" "}
                <span className="text-accent">dành riêng cho bạn</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed max-w-xl">
                Khám phá hương vị đặc sắc từ những món ăn được chế biến tươi ngon mỗi ngày.
                Đặt hàng dễ dàng, giao hàng nhanh chóng, trải nghiệm tuyệt vời.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button size="lg" className="w-full sm:w-auto group">
                  Khám Phá Thực Đơn Ngay
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Xem Video Giới Thiệu
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Đơn hàng</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Đánh giá</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">30 phút</div>
                <div className="text-sm text-muted-foreground">Giao hàng</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/delicious-vietnamese-food-spread-with-pho--banh-mi.jpg"
                alt="Món ăn đặc sắc"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card border rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">🍜</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Phở Bò Đặc Biệt</div>
                  <div className="text-primary font-bold">89,000đ</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-card border rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-semibold">🥖</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Bánh Mì Thịt Nướng</div>
                  <div className="text-accent font-bold">35,000đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

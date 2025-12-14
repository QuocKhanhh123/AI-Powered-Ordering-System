import { Clock, Users, Award, Heart, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Câu Chuyện Của <span className="text-primary">FoodieHub</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Từ một ý tưởng đơn giản về việc kết nối những người yêu ẩm thực với các món ăn ngon nhất, FoodieHub đã trở
              thành nền tảng đặt món ăn trực tuyến được tin tưởng nhất tại Việt Nam.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { label: "Khách hàng", value: "50K+" },
                { label: "Món ăn", value: "1000+" },
                { label: "Đơn hàng", value: "100K+" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: Heart,
                title: "Sứ Mệnh",
                color: "primary",
                text:
                  "Mang đến trải nghiệm ẩm thực tuyệt vời nhất cho mọi người thông qua công nghệ hiện đại. Chúng tôi kết nối những người yêu ẩm thực với các món ăn chất lượng cao."
              },
              {
                icon: Award,
                title: "Tầm Nhìn",
                color: "accent",
                text:
                  "Trở thành nền tảng đặt món ăn trực tuyến hàng đầu Đông Nam Á, nơi mọi người có thể dễ dàng khám phá và thưởng thức những món ăn ngon nhất."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className={`border-2 border-${item.color}/20`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 bg-${item.color}/10 rounded-full flex items-center justify-center`}>
                        <item.icon className={`w-6 h-6 text-${item.color}`} />
                      </div>
                      <h2 className="text-2xl font-bold">{item.title}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Giá Trị Cốt Lõi</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Những giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: ChefHat, title: "Chất Lượng", text: "Cam kết tiêu chuẩn cao nhất cho mọi món ăn." },
              { icon: Clock, title: "Nhanh Chóng", text: "Giao hàng đúng hẹn và luôn nóng hổi." },
              { icon: Users, title: "Tận Tâm", text: "Hỗ trợ khách hàng 24/7 tận tình." }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-xl transition-all">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <v.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                    <p className="text-muted-foreground">{v.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hành Trình Của Chúng Tôi</h2>
            <p className="text-xl text-muted-foreground">
              Từ những ngày đầu khởi nghiệp đến thành công hôm nay
            </p>
          </motion.div>

          {[
            { year: "2020", color: "primary", title: "Khởi Đầu" },
            { year: "2021", color: "accent", title: "Mở Rộng" },
            { year: "2022", color: "primary", title: "Đổi Mới" },
            { year: "2023", color: "accent", title: "Thành Công" }
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-8 items-start mb-12"
            >
              <div className={`w-20 h-20 bg-${t.color}/10 rounded-full flex items-center justify-center`}>
                <div className={`text-2xl font-bold text-${t.color}`}>{t.year}</div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                <p className="text-muted-foreground">
                  FoodieHub không ngừng phát triển và đổi mới để mang lại trải nghiệm tốt nhất cho khách hàng.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn Sàng Khám Phá Ẩm Thực Cùng Chúng Tôi?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Hơn 50,000 người đã lựa chọn FoodieHub cho hành trình ẩm thực của mình
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button size="lg" className="px-8">
                  <ChefHat className="w-5 h-5 mr-2" />
                  Khám Phá Thực Đơn
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <Users className="w-5 h-5 mr-2" />
                  Đăng Ký Ngay
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

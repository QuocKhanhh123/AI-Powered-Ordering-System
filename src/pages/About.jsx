import { Clock, Users, Award, Heart, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
                Câu Chuyện Của <span className="text-primary">FoodieHub</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty mb-8">
                Từ một ý tưởng đơn giản về việc kết nối những người yêu ẩm thực với các món ăn ngon nhất, FoodieHub đã trở
                thành nền tảng đặt món ăn trực tuyến được tin tưởng nhất tại Việt Nam.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Món ăn</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100K+</div>
                  <div className="text-sm text-muted-foreground">Đơn hàng</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Sứ Mệnh</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Mang đến trải nghiệm ẩm thực tuyệt vời nhất cho mọi người thông qua công nghệ hiện đại. Chúng tôi kết
                    nối những người yêu ẩm thực với các món ăn chất lượng cao, phục vụ nhanh chóng và tiện lợi ngay tại
                    nhà.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold">Tầm Nhìn</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Trở thành nền tảng đặt món ăn trực tuyến hàng đầu Đông Nam Á, nơi mọi người có thể dễ dàng khám phá và
                    thưởng thức những món ăn ngon nhất từ khắp nơi trên thế giới.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Giá Trị Cốt Lõi</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Những giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ChefHat className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Chất Lượng</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi cam kết chỉ hợp tác với những nhà hàng và đầu bếp uy tín, đảm bảo mọi món ăn đều đạt tiêu
                    chuẩn chất lượng cao nhất.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Nhanh Chóng</h3>
                  <p className="text-muted-foreground">
                    Thời gian giao hàng nhanh chóng và chính xác, đảm bảo món ăn luôn được phục vụ trong tình trạng tốt
                    nhất.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Tận Tâm</h3>
                  <p className="text-muted-foreground">
                    Đội ngũ chăm sóc khách hàng 24/7, luôn sẵn sàng hỗ trợ và giải quyết mọi thắc mắc của bạn một cách
                    nhanh chóng.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story - Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Hành Trình Của Chúng Tôi</h2>
                <p className="text-xl text-muted-foreground text-pretty">
                  Từ những ngày đầu khởi nghiệp đến thành công như ngày hôm nay
                </p>
              </div>

              <div className="space-y-12">
                <div className="flex gap-8 items-start">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">2020</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Khởi Đầu</h3>
                    <p className="text-muted-foreground text-pretty">
                      FoodieHub được thành lập với mục tiêu đơn giản: giúp mọi người dễ dàng đặt món ăn ngon từ những nhà
                      hàng yêu thích. Chúng tôi bắt đầu với 10 nhà hàng đối tác tại TP.HCM.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 items-start">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-accent">2021</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Mở Rộng</h3>
                    <p className="text-muted-foreground text-pretty">
                      Mở rộng hoạt động ra Hà Nội và Đà Nẵng với hơn 100 nhà hàng đối tác. Ra mắt ứng dụng di động và tính
                      năng theo dõi đơn hàng real-time.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 items-start">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">2022</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Đổi Mới</h3>
                    <p className="text-muted-foreground text-pretty">
                      Triển khai hệ thống AI để gợi ý món ăn cá nhân hóa và tối ưu hóa tuyến đường giao hàng. Đạt mốc
                      10,000 đơn hàng mỗi ngày.
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 items-start">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-2xl font-bold text-accent">2023</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Thành Công</h3>
                    <p className="text-muted-foreground text-pretty">
                      Trở thành nền tảng đặt món ăn số 1 tại Việt Nam với hơn 50,000 khách hàng thường xuyên và 1,000+ nhà
                      hàng đối tác trên toàn quốc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Đội Ngũ Của Chúng Tôi</h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Những con người tài năng và đam mê đứng sau thành công của FoodieHub
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primary/20">
                    <img
                      src="/assets/images/CEO.png"
                      alt="Nguyễn Văn A - CEO & Founder"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nguyễn Hữu Đạt</h3>
                  <p className="text-primary font-medium mb-4">CEO & Founder</p>
                  <p className="text-muted-foreground text-sm text-pretty">
                    10+ năm kinh nghiệm trong lĩnh vực công nghệ và F&B. Đam mê kết nối công nghệ với ẩm thực.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-accent/20">
                    <img
                      src="/assets/images/CTO.png"
                      alt="Lê Thị B - CTO"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Lê Thị Hoa</h3>
                  <p className="text-primary font-medium mb-4">Chief Technology Officer</p>
                  <p className="text-muted-foreground text-sm text-pretty">
                    Chuyên gia công nghệ với 8+ năm kinh nghiệm phát triển các ứng dụng di động và web quy mô lớn.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden border-4 border-primary/20">
                    <img
                      src="/assets/images/HeadOfOperations.png"
                      alt="Trương Minh Quang - Head of Operations"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Trương Minh Quang</h3>
                  <p className="text-primary font-medium mb-4">Head of Operations</p>
                  <p className="text-muted-foreground text-sm text-pretty">
                    Chuyên gia vận hành với kinh nghiệm quản lý chuỗi cung ứng và logistics trong ngành F&B.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn Sàng Khám Phá Ẩm Thực Cùng Chúng Tôi?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Hãy tham gia cộng đồng hơn 50,000 người yêu ẩm thực và khám phá những món ăn ngon nhất từ khắp nơi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/menu">
                  <Button size="lg" className="text-lg px-8 flex items-center justify-center">
                    <ChefHat className="w-5 h-5 mr-2" />
                    Khám Phá Thực Đơn
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 bg-transparent flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Đăng Ký Ngay
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

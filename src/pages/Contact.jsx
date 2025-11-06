import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    Facebook,
    Instagram,
    Youtube
} from "lucide-react"
import { toast } from "sonner"

const faqs = [
    {
        id: "faq-1",
        question: "Tôi có thể hủy đơn hàng không?",
        answer: "Bạn có thể hủy đơn hàng trong vòng 5 phút sau khi đặt. Sau thời gian này, nếu muốn hủy, vui lòng liên hệ với chúng tôi qua hotline hoặc chat để được hỗ trợ. Lưu ý rằng các đơn hàng đã được xác nhận hoặc đang trong quá trình giao hàng sẽ không thể hủy."
    },
    {
        id: "faq-2",
        question: "Có những hình thức thanh toán nào?",
        answer: "Chúng tôi chấp nhận nhiều hình thức thanh toán: Tiền mặt khi nhận hàng (COD), Thẻ ATM/Visa/Mastercard, Ví điện tử (Momo, ZaloPay, VNPay), và Chuyển khoản ngân hàng. Tất cả giao dịch đều được mã hóa và bảo mật tuyệt đối."
    },
    {
        id: "faq-3",
        question: "Làm thế nào để theo dõi đơn hàng?",
        answer: "Sau khi đặt hàng thành công, bạn có thể theo dõi tình trạng đơn hàng tại mục 'Đơn hàng của tôi' trên website hoặc app. Chúng tôi cũng sẽ gửi thông báo qua email và SMS về từng bước của đơn hàng (Đã xác nhận, Đang chuẩn bị, Đang giao, Đã giao)."
    },
    {
        id: "faq-4",
        question: "Chính sách đổi trả như thế nào?",
        answer: "Nếu món ăn có vấn đề về chất lượng, không đúng món, hoặc bị hư hỏng trong quá trình vận chuyển, bạn có thể yêu cầu đổi trả trong vòng 30 phút sau khi nhận hàng. Vui lòng chụp ảnh minh chứng và liên hệ với chúng tôi qua hotline. Chúng tôi sẽ đổi món mới hoặc hoàn tiền 100%."
    },
    {
        id: "faq-5",
        question: "Làm thế nào để được tư vấn chọn món?",
        answer: "Bạn có thể chat trực tuyến với đội ngũ tư vấn của chúng tôi qua nút chat góc phải màn hình, gọi hotline, hoặc để lại thông tin trong form liên hệ bên dưới. Chúng tôi sẵn sàng tư vấn về khẩu phần, độ cay, món ăn phù hợp với khẩu vị của bạn."
    }
]

const contactInfo = [
    {
        icon: Phone,
        title: "Hotline",
        content: "1900-1234",
        subContent: "Hỗ trợ 24/7",
        action: "tel:19001234"
    },
    {
        icon: Mail,
        title: "Email",
        content: "support@foodiehub.vn",
        subContent: "Phản hồi trong 24h",
        action: "mailto:support@foodiehub.vn"
    },
    {
        icon: MapPin,
        title: "Địa chỉ",
        content: "123 Nguyễn Huệ, Quận 1",
        subContent: "TP. Hồ Chí Minh",
        action: null
    },
    {
        icon: Clock,
        title: "Giờ làm việc",
        content: "Thứ 2 - Chủ nhật",
        subContent: "6:00 AM - 11:00 PM",
        action: null
    }
]

const socialLinks = [
    {
        icon: Facebook,
        name: "Facebook",
        url: "https://facebook.com/foodiehub",
        color: "text-blue-600 hover:bg-blue-50"
    },
    {
        icon: Instagram,
        name: "Instagram",
        url: "https://instagram.com/foodiehub",
        color: "text-pink-600 hover:bg-pink-50"
    },
    {
        icon: Youtube,
        name: "Youtube",
        url: "https://youtube.com/foodiehub",
        color: "text-red-600 hover:bg-red-50"
    }
]

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    })

    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            setSubmitting(false)
            return
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success("Gửi tin nhắn thành công!", {
            description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ"
        })

        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
        })
        setSubmitting(false)
    }

    return (
        <div className="py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-3xl lg:text-4xl font-bold">
                        Liên Hệ <span className="text-primary">Với Chúng Tôi</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactInfo.map((item, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <item.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">{item.title}</h3>
                                    {item.action ? (
                                        <a
                                            href={item.action}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {item.content}
                                        </a>
                                    ) : (
                                        <p className="font-medium">{item.content}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">{item.subContent}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                <span>Gửi Tin Nhắn</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Họ và tên <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="0901234567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Tiêu đề</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        placeholder="Câu hỏi về đơn hàng"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Nội dung <span className="text-destructive">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Nhập nội dung tin nhắn của bạn..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>Đang gửi...</>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Map */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>Vị Trí Của Chúng Tôi</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Google Maps Embed */}
                                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                                    <iframe
                                        title="FoodieHub Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4822024730965!2d106.70288631533425!3d10.775712692318768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0xb7b2a3b9c3e3b3b2!2zMTIzIE5ndXnhu4VuIEh14buHLCBCw6puIE5naMOqLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold mb-1">Địa chỉ chi tiết:</h4>
                                        <p className="text-muted-foreground">
                                            123 Nguyễn Huệ, Phường Bến Nghé, Quận 1,<br />
                                            Thành phố Hồ Chí Minh
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-1">Hướng dẫn đi lại:</h4>
                                        <p className="text-sm text-muted-foreground">
                                            • Gần Nhà hát Thành phố, đối diện Bitexco<br />
                                            • Bến xe bus: Số 3, 4, 6, 8, 152<br />
                                            • Có bãi đỗ xe miễn phí
                                        </p>
                                    </div>

                                    <Button variant="outline" className="w-full" asChild>
                                        <a
                                            href="https://maps.google.com/?q=123+Nguyen+Hue,+District+1,+Ho+Chi+Minh+City"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Xem trên Google Maps
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQs */}
                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Câu Hỏi Thường Gặp</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Giải đáp những thắc mắc phổ biến về dịch vụ của chúng tôi
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id}>
                                    <AccordionTrigger className="text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Kết Nối Với Chúng Tôi</CardTitle>
                        <p className="text-sm text-muted-foreground text-center">
                            Theo dõi để cập nhật tin tức và khuyến mãi mới nhất
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${social.color}`}
                                    aria-label={social.name}
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

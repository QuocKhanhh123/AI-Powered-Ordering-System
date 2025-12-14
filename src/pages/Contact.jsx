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
import { motion } from "framer-motion"

const faqs = [
    {
        id: "faq-1",
        question: "Tôi có thể hủy đơn hàng không?",
        answer:
            "Bạn có thể hủy đơn hàng trong vòng 5 phút sau khi đặt. Sau thời gian này, vui lòng liên hệ hotline hoặc chat để được hỗ trợ."
    },
    {
        id: "faq-2",
        question: "Có những hình thức thanh toán nào?",
        answer:
            "Chúng tôi hỗ trợ COD, thẻ ATM/Visa/Mastercard, Momo, ZaloPay, VNPay và chuyển khoản ngân hàng."
    },
    {
        id: "faq-3",
        question: "Làm thế nào để theo dõi đơn hàng?",
        answer:
            "Bạn có thể theo dõi đơn hàng tại mục 'Đơn hàng của tôi' hoặc nhận thông báo qua email và SMS."
    },
    {
        id: "faq-4",
        question: "Chính sách đổi trả như thế nào?",
        answer:
            "Yêu cầu đổi trả trong vòng 30 phút nếu có vấn đề về chất lượng. Hoàn tiền hoặc đổi món 100%."
    },
    {
        id: "faq-5",
        question: "Làm thế nào để được tư vấn chọn món?",
        answer:
            "Chat trực tuyến, gọi hotline hoặc gửi form liên hệ để được tư vấn nhanh chóng."
    }
]

const contactInfo = [
    { icon: Phone, title: "Hotline", content: "1900-1234", sub: "Hỗ trợ 24/7", link: "tel:19001234" },
    { icon: Mail, title: "Email", content: "support@foodiehub.vn", sub: "Phản hồi trong 24h", link: "mailto:support@foodiehub.vn" },
    { icon: MapPin, title: "Địa chỉ", content: "123 Nguyễn Huệ, Quận 1", sub: "TP. Hồ Chí Minh" },
    { icon: Clock, title: "Giờ làm việc", content: "Thứ 2 - CN", sub: "6:00 - 23:00" }
]

const socialLinks = [
    { icon: Facebook, url: "https://facebook.com/foodiehub", color: "text-blue-600 hover:bg-blue-50" },
    { icon: Instagram, url: "https://instagram.com/foodiehub", color: "text-pink-600 hover:bg-pink-50" },
    { icon: Youtube, url: "https://youtube.com/foodiehub", color: "text-red-600 hover:bg-red-50" }
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
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
            setSubmitting(false)
            return
        }

        await new Promise(resolve => setTimeout(resolve, 1500))

        toast.success("Gửi tin nhắn thành công!", {
            description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ"
        })

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
        <section className="py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 mb-14"
                >
                    <h1 className="text-3xl lg:text-4xl font-bold">
                        Liên Hệ <span className="text-primary">Với Chúng Tôi</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
                    {contactInfo.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="text-center hover:shadow-xl transition-all">
                                <CardContent className="p-6 space-y-3">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                                        <item.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    {item.link ? (
                                        <a href={item.link} className="text-primary font-medium hover:underline">
                                            {item.content}
                                        </a>
                                    ) : (
                                        <p className="font-medium">{item.content}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">{item.sub}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                    Gửi Tin Nhắn
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Họ và tên *</Label>
                                        <Input name="name" value={formData.name} onChange={handleChange} />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Email *</Label>
                                            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <Label>Số điện thoại</Label>
                                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Tiêu đề</Label>
                                        <Input name="subject" value={formData.subject} onChange={handleChange} />
                                    </div>
                                    <div>
                                        <Label>Nội dung *</Label>
                                        <Textarea rows={5} name="message" value={formData.message} onChange={handleChange} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? "Đang gửi..." : <>
                                            <Send className="h-4 w-4 mr-2" /> Gửi tin nhắn
                                        </>}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Vị Trí Của Chúng Tôi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Câu Hỏi Thường Gặp</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                {faqs.map(faq => (
                                    <AccordionItem key={faq.id} value={faq.id}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Kết Nối Với Chúng Tôi</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center gap-4">
                            {socialLinks.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${s.color}`}
                                >
                                    <s.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Home, Receipt } from "lucide-react"
import apiClient from "@/lib/api"

export default function OrderStatus() {
    const { transactionId } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState("loading") // loading, success, failed
    const [orderData, setOrderData] = useState(null)

    useEffect(() => {
        checkPaymentStatus()
    }, [transactionId])

    const checkPaymentStatus = async () => {
        if (!transactionId) {
            setStatus("failed")
            return
        }

        try {
            const response = await apiClient.get(`/api/payments/zalopay/query/${transactionId}`)
            if (response.return_code === 1) {
                setStatus("success")
                setOrderData(response)
            } else {
                setStatus("failed")
            }
        } catch (error) {
            console.error("Error checking payment:", error)
            setStatus("failed")
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                    <p className="text-lg font-medium">Đang kiểm tra thanh toán...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="container mx-auto max-w-2xl">
                <Card className="border-2">
                    <CardContent className="pt-12 pb-8 text-center space-y-6">
                        {status === "success" ? (
                            <>
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-green-600">Thanh toán thành công!</h1>
                                    <p className="text-muted-foreground">Cảm ơn bạn đã đặt hàng</p>
                                </div>
                                {orderData && (
                                    <div className="bg-muted rounded-lg p-6 text-left space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Mã giao dịch ZaloPay:</span>
                                            <span className="font-semibold text-sm">{orderData.zp_trans_id || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Mã đơn hàng:</span>
                                            <span className="font-semibold">{transactionId?.slice(-8) || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Số tiền:</span>
                                            <span className="font-semibold text-green-600">
                                                {parseInt(orderData.amount || 0).toLocaleString("vi-VN")} VNĐ
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phương thức:</span>
                                            <span className="font-semibold">ZaloPay</span>
                                        </div>
                                        {orderData.discount_amount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span className="text-muted-foreground">Giảm giá:</span>
                                                <span className="font-semibold">-{orderData.discount_amount.toLocaleString("vi-VN")} VNĐ</span>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <p className="text-sm text-center text-green-600 font-medium">
                                                    {orderData.return_message || "Giao dịch thành công"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-muted-foreground">
                                    Chúng tôi sẽ liên hệ với bạn sớm để xác nhận đơn hàng
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                                    <XCircle className="w-12 h-12 text-red-600" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-red-600">Thanh toán thất bại</h1>
                                    <p className="text-muted-foreground">Không tìm thấy thông tin đơn hàng</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-700">
                                        Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại.
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="flex gap-4 justify-center pt-6">
                            <Button variant="outline" onClick={() => navigate("/")}>
                                <Home className="w-4 h-4 mr-2" />
                                Về trang chủ
                            </Button>
                            <Button onClick={() => navigate("/orders")}>
                                <Receipt className="w-4 h-4 mr-2" />
                                Xem đơn hàng
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

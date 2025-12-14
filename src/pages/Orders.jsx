import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import apiClient from "@/lib/api"
import authService from "@/lib/authService"
import { toast } from "sonner"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    if (!authService.isAuthenticated()) {
      toast.error("Vui lòng đăng nhập")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      const response = await apiClient.get("/api/orders/my-orders")
      setOrders(response?.data || [])
    } catch {
      toast.error("Không thể tải danh sách đơn hàng")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        )
      case "processing":
      case "preparing":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Package className="w-3 h-3 mr-1" />
            Đang xử lý
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Chờ xác nhận
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
      case "completed":
        return <Badge className="bg-green-500 text-white">Đã thanh toán</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Chờ thanh toán</Badge>
      case "failed":
        return <Badge variant="destructive">Thất bại</Badge>
      default:
        return <Badge variant="secondary">{paymentStatus}</Badge>
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <motion.div
        className="py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Chưa có đơn hàng</h2>
        <p className="text-muted-foreground mb-6">
          Hãy khám phá thực đơn và đặt món ngay!
        </p>
        <Button onClick={() => navigate("/menu")}>Xem thực đơn</Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="py-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">
            Theo dõi lịch sử và trạng thái đơn hàng
          </p>
        </div>

        <motion.div
          className="space-y-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div key={order._id} variants={item} layout>
                <Card className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between gap-4 flex-wrap">
                      <div>
                        <CardTitle className="text-lg">
                          Đơn hàng #{order._id.slice(-8)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex gap-2 justify-end">
                          {getStatusBadge(order.status)}
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </div>
                        <p className="text-lg font-bold text-primary">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-3 rounded-lg bg-muted"
                      >
                        {item.dish?.thumbnail && (
                          <img
                            src={item.dish.thumbnail}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} ×{" "}
                              {item.price.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                          <p className="font-medium">
                            {item.subtotal.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                    ))}

                    {order.notes && (
                      <div className="p-3 rounded-lg bg-blue-50 text-sm">
                        <span className="font-medium">Ghi chú:</span>{" "}
                        {order.notes}
                      </div>
                    )}

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>
                          {order.subtotal.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Giảm giá</span>
                          <span>
                            -{order.discount.toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Tổng cộng</span>
                        <span className="text-primary">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Thống kê đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {orders.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Tổng đơn</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {
                      orders.filter((o) =>
                        ["completed", "delivered"].includes(
                          o.status?.toLowerCase()
                        )
                      ).length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">Hoàn thành</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {orders
                      .reduce((t, o) => t + o.totalAmount, 0)
                      .toLocaleString("vi-VN")}
                    đ
                  </div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Search,
    Eye,
    Edit,
    Filter,
    Download,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
} from "lucide-react"

// Mock data
const mockCustomers = [
    {
        id: "CUST-001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0901234567",
        address: "123 Nguyễn Huệ, Q1, TP.HCM",
        joinDate: "2024-01-10",
        status: "active",
        totalOrders: 15,
        totalSpent: 2450000,
        lastOrder: "2024-01-15",
        avatar: "/placeholder-user.jpg",
        notes: "Khách hàng VIP, thường xuyên đặt món cao cấp",
    },
    {
        id: "CUST-002",
        name: "Trần Thị B",
        email: "tranthib@email.com",
        phone: "0912345678",
        address: "456 Lê Lợi, Q3, TP.HCM",
        joinDate: "2024-01-08",
        status: "active",
        totalOrders: 8,
        totalSpent: 1120000,
        lastOrder: "2024-01-14",
        avatar: "/placeholder-user.jpg",
        notes: "Khách hàng thân thiết, ưa thích món Việt Nam",
    },
    {
        id: "CUST-003",
        name: "Lê Văn C",
        email: "levanc@email.com",
        phone: "0923456789",
        address: "789 Võ Văn Tần, Q3, TP.HCM",
        joinDate: "2024-01-05",
        status: "inactive",
        totalOrders: 3,
        totalSpent: 450000,
        lastOrder: "2024-01-12",
        avatar: "/placeholder-user.jpg",
        notes: "Khách hàng ít hoạt động",
    },
    {
        id: "CUST-004",
        name: "Phạm Thị D",
        email: "phamthid@email.com",
        phone: "0934567890",
        address: "321 Pasteur, Q1, TP.HCM",
        joinDate: "2024-01-12",
        status: "active",
        totalOrders: 12,
        totalSpent: 1850000,
        lastOrder: "2024-01-15",
        avatar: "/placeholder-user.jpg",
        notes: "Khách hàng mới, tiềm năng tốt",
    },
    {
        id: "CUST-005",
        name: "Hoàng Văn E",
        email: "hoangvane@email.com",
        phone: "0945678901",
        address: "654 Điện Biên Phủ, Q10, TP.HCM",
        joinDate: "2023-12-20",
        status: "blocked",
        totalOrders: 2,
        totalSpent: 180000,
        lastOrder: "2024-01-03",
        avatar: "/placeholder-user.jpg",
        notes: "Khách hàng bị khóa do vi phạm chính sách",
    },
]

export function CustomersContent() {
    const [customers, setCustomers] = useState(mockCustomers)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { label: "Hoạt động", color: "bg-green-100 text-green-800" },
            inactive: { label: "Không hoạt động", color: "bg-yellow-100 text-yellow-800" },
            blocked: { label: "Bị khóa", color: "bg-red-100 text-red-800" },
        }
        const config = statusConfig[status]
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        )
    }

    const updateCustomerStatus = (customerId, newStatus) => {
        setCustomers(
            customers.map((c) =>
                c.id === customerId ? { ...c, status: newStatus } : c
            )
        )
        if (selectedCustomer?.id === customerId) {
            setSelectedCustomer({ ...selectedCustomer, status: newStatus })
        }
    }

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        const matchesStatus =
            statusFilter === "all" || customer.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Quản Lý Khách Hàng</h1>
                    <p className="text-slate-600 mt-2">
                        Theo dõi và quản lý thông tin khách hàng trên hệ thống
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Thêm Khách Hàng
                    </Button>
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Danh Sách Khách Hàng ({filteredCustomers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4">Khách Hàng</th>
                                    <th className="text-left py-3 px-4">Liên Hệ</th>
                                    <th className="text-left py-3 px-4">Đơn Hàng</th>
                                    <th className="text-left py-3 px-4">Chi Tiêu</th>
                                    <th className="text-left py-3 px-4">Trạng Thái</th>
                                    <th className="text-left py-3 px-4">Ngày Tham Gia</th>
                                    <th className="text-left py-3 px-4">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-slate-100">
                                        <td className="py-4 px-4">{customer.name}</td>
                                        <td className="py-4 px-4">{customer.email}</td>
                                        <td className="py-4 px-4">{customer.totalOrders}</td>
                                        <td className="py-4 px-4">
                                            {formatCurrency(customer.totalSpent)}
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(customer.status)}
                                        </td>
                                        <td className="py-4 px-4">
                                            {formatDate(customer.joinDate)}
                                        </td>
                                        <td className="py-4 px-4 flex gap-2">
                                            {/* View dialog */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedCustomer(customer)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Thông Tin {selectedCustomer?.name}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Chi tiết khách hàng
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {selectedCustomer && (
                                                        <div>
                                                            <p>Email: {selectedCustomer.email}</p>
                                                            <p>Phone: {selectedCustomer.phone}</p>
                                                            <p>Địa chỉ: {selectedCustomer.address}</p>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>

                                            {/* Change status */}
                                            <Select
                                                value={customer.status}
                                                onValueChange={(val) =>
                                                    updateCustomerStatus(customer.id, val)
                                                }
                                            >
                                                <SelectTrigger className="w-28">
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Hoạt động</SelectItem>
                                                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                                                    <SelectItem value="blocked">Bị khóa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
    BarChart3,
    Home,
    LogOut,
    Menu,
    Package,
    Settings,
    ShoppingCart,
    Users,
    X,
} from "lucide-react";
import { Button } from "../ui/button";
import authService from "../../lib/authService";
import { toast } from "sonner";

// Custom styles to force white text in sidebar
const sidebarStyles = {
    color: '#ffffff !important'
};

export function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated();
            const user = authService.getCurrentUser();

            if (isAuth && user && user.roles?.includes('admin')) {
                setIsAuthenticated(true);
            } else {
                navigate("/login");
                return;
            }
            setIsLoading(false);
        };
        
        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleLogout = () => {
        try {
            toast.success("Đăng xuất thành công!");
            localStorage.clear();
            sessionStorage.clear();

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Có lỗi xảy ra khi đăng xuất");
        }
    };

    const navigation = [
        { name: "Bảng Điều Khiển", href: "/admin/dashboard", icon: Home },
        { name: "Quản Lý Đơn Hàng", href: "/admin/orders", icon: ShoppingCart },
        { name: "Quản Lý Sản Phẩm", href: "/admin/products", icon: Package },
        { name: "Báo Cáo & Thống Kê", href: "/admin/reports", icon: BarChart3 },
        { name: "Khách Hàng", href: "/admin/customers", icon: Users },
        { name: "Cài Đặt", href: "/admin/settings", icon: Settings },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-slate-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    />
                </div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={sidebarStyles}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-sm font-bold !text-white">FH</span>
                        </div>
                        <span className="!text-white font-bold text-lg" style={{ color: '#ffffff !important' }}>Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden !text-white hover:!text-primary transition-colors duration-200"
                        style={{ color: '#ffffff !important' }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? "bg-primary/20 !text-white border-l-4 border-primary bg-gradient-to-r from-primary/20 to-transparent"
                                            : "!text-white/90 hover:bg-slate-700/50 hover:!text-white hover:border-l-4 hover:border-primary/50"
                                            }`}
                                        style={{ color: '#ffffff !important' }}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? '!text-white' : '!text-white/90 group-hover:!text-white'}`} />
                                        <span className={isActive ? '!text-white font-semibold' : '!text-white/90 group-hover:!text-white'}>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start !text-white hover:bg-slate-700/50 hover:!text-white transition-all duration-200 border border-transparent hover:border-slate-600"
                        style={{ color: '#ffffff !important' }}
                    >
                        <LogOut className="w-5 h-5 mr-3 !text-white" />
                        <span className="!text-white">Đăng Xuất</span>
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-600 hover:text-slate-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-4">
                            {(() => {
                                const user = authService.getCurrentUser();
                                return (
                                    <>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-900">
                                                {user?.fullName || "Admin User"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {user?.email || "admin@foodiehub.com"}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {user?.fullName?.charAt(0).toUpperCase() || "A"}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

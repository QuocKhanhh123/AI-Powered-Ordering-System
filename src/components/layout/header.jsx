import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ShoppingCart, Menu, User, Settings, LogOut, UserCircle } from "lucide-react"
import authService from "@/lib/authService"
import apiClient from "@/lib/api"
import { toast } from "sonner"

export default function Header() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = async () => {
    if (!authService.isAuthenticated()) {
      setCartCount(0)
      return
    }

    try {
      const response = await apiClient.get('/api/cart/my-cart')
      const items = response?.data?.items || []
      const total = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0
      setCartCount(total)
    } catch (error) {
      console.error('Error fetching cart count:', error)
      setCartCount(0)
    }
  }

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated()
      const currentUser = authService.getCurrentUser()

      setIsAuthenticated(authenticated)
      setUser(currentUser)

      // Fetch cart count khi auth state thay đổi
      if (authenticated) {
        fetchCartCount()
      } else {
        setCartCount(0)
      }
    }

    checkAuthStatus()

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuthStatus()
      }
    }

    const handleAuthChange = () => {
      checkAuthStatus()
    }

    const handleCartUpdate = () => {
      fetchCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStateChanged', handleAuthChange)
    window.addEventListener('cartUpdated', handleCartUpdate)

    // const interval = setInterval(() => {
    //   if (authService.isAuthenticated()) {
    //     fetchCartCount()
    //   }
    // }, 10000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStateChanged', handleAuthChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
      // clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    try {
      toast.success("Đăng xuất thành công!", {
        description: "Hẹn gặp lại bạn lần sau"
      })

      localStorage.clear()
      sessionStorage.clear()

      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      toast.error("Có lỗi xảy ra khi đăng xuất")
    }
  }

  const getUserInitials = (name) => {
    if (!name) return "U"
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl text-foreground">FoodieHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Trang Chủ
            </Link>
            <Link to="/menu" className="text-foreground hover:text-primary transition-colors">
              Thực Đơn
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Về Chúng Tôi
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Liên Hệ
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name || user.email} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Đơn hàng của tôi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Đăng Nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Đăng Ký</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang Chủ
              </Link>
              <Link
                to="/menu"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Thực Đơn
              </Link>
              <Link
                to="/about"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Về Chúng Tôi
              </Link>
              <Link
                to="/contact"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên Hệ
              </Link>

              {/* Mobile Auth Section */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name || user.email} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getUserInitials(user.name || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Thông tin cá nhân
                      </Button>
                    </Link>
                    <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài đặt
                      </Button>
                    </Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Đơn hàng của tôi
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Đăng Nhập
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Đăng Ký</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

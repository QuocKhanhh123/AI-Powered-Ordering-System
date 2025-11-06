import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const toastIdRef = useRef(null)

    // Khởi tạo cart từ localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart')
            return savedCart ? JSON.parse(savedCart) : []
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
            return []
        }
    })

    // Lưu cart vào localStorage mỗi khi có thay đổi
    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error saving cart to localStorage:', error)
        }
    }, [cartItems])

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (product, quantity = 1, note = '') => {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id)
        const isUpdate = existingItemIndex > -1

        setCartItems(prevItems => {
            if (isUpdate) {
                // Nếu đã có, tăng số lượng
                const updatedItems = [...prevItems]
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                    note: note || updatedItems[existingItemIndex].note
                }
                return updatedItems
            } else {
                // Nếu chưa có, thêm mới
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: product.finalPrice || product.price,
                    quantity: quantity,
                    image: product.thumbnail || product.image,
                    note: note,
                    category: product.category
                }
                return [...prevItems, newItem]
            }
        })
        const message = isUpdate
            ? `Đã cập nhật số lượng ${product.name} trong giỏ hàng`
            : `Đã thêm ${product.name} vào giỏ hàng`

        // Dismiss toast cũ nếu có
        if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current)
        }

        // Hiển thị toast mới và lưu ID
        toastIdRef.current = toast.success(message, {
            duration: 2000,
        })
    }

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity === 0) {
            removeItem(id)
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            )
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id))
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    }

    // Cập nhật ghi chú cho sản phẩm
    const updateNote = (id, note) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, note } : item
            )
        )
    }

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([])
        toast.success('Đã xóa toàn bộ giỏ hàng')
    }

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }

    // Tính tổng tiền
    const getSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    // Kiểm tra sản phẩm có trong giỏ hàng không
    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId)
    }

    // Lấy số lượng của sản phẩm trong giỏ hàng
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item.id === productId)
        return item ? item.quantity : 0
    }

    const value = {
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        updateNote,
        clearCart,
        getTotalItems,
        getSubtotal,
        isInCart,
        getItemQuantity
    }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

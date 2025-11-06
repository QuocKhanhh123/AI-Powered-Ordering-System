import React, { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    Star,
    Package,
    DollarSign,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import apiClient from '../../lib/api';
import { toast } from 'sonner';
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';
import Swal from "sweetalert2";

function getStatusBadge(isAvailable) {
    return isAvailable ? (
        <Badge className="bg-green-100 text-green-800 border-green-200">Đang bán</Badge>
    ) : (
        <Badge className="bg-red-100 text-red-800 border-red-200">Hết hàng</Badge>
    );
}

function getDiscountPercent(price, discountPrice) {
    if (!discountPrice || discountPrice >= price) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
}

function ProductCard({ product, onEdit, onDelete, onView }) {
    const discount = getDiscountPercent(product.price, product.discountPrice);
    const isPopular = product.rateCount > 200;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
                <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = "/placeholder.svg";
                    }}
                />
                {discount > 0 && product.isDiscountActive && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{discount}%
                    </div>
                )}
                {isPopular && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Phổ biến
                    </div>
                )}
                {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg">Hết hàng</Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate flex-1">{product.name}</h3>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(product)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Xem Chi Tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(product)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Chỉnh Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(product)}
                                className="text-red-600"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline">{product.category}</Badge>
                    {getStatusBadge(product.isAvailable)}
                    <Badge variant="secondary" className="text-xs">{product.type}</Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg text-green-600">
                            {product.finalPrice.toLocaleString()} VNĐ
                        </span>
                        {product.isDiscountActive && product.price > product.discountPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {product.price.toLocaleString()} VNĐ
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{product.rate.toFixed(1)}</span>
                    </div>
                    <span>({product.rateCount} đánh giá)</span>
                    <span>{product.preparationTime}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState(['Tất cả']);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/api/menu-items');

            // Response có thể là array trực tiếp hoặc object với data property
            const productList = Array.isArray(response) ? response : response.data || [];
            setProducts(productList);

            // Extract unique categories
            const uniqueCategories = ['Tất cả', ...new Set(productList.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter logic
    useEffect(() => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'Tất cả') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        if (statusFilter === 'available') {
            filtered = filtered.filter(product => product.isAvailable);
        } else if (statusFilter === 'unavailable') {
            filtered = filtered.filter(product => !product.isAvailable);
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, categoryFilter, statusFilter]);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (product) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa?",
            text: `Bạn có chắc muốn xóa "${product.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (result.isConfirmed) {
            try {
                await apiClient.delete(`/api/menu-items/delete/${product.id}`);
                setProducts(prev => prev.filter(p => p.id !== product.id));
                Swal.fire("Đã xóa!", "Sản phẩm đã được xóa thành công.", "success");
            } catch (error) {
                Swal.fire("Lỗi!", error.message || "Không thể xóa sản phẩm.", "error");
            }
        }
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('Tất cả');
        setStatusFilter('all');
    };

    // Calculate stats
    const stats = {
        total: products.length,
        available: products.filter(p => p.isAvailable).length,
        unavailable: products.filter(p => !p.isAvailable).length,
        totalRevenue: products.reduce((sum, p) => sum + (p.finalPrice * p.rateCount), 0)
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                    <p className="text-gray-600">Quản lý menu và danh mục sản phẩm</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Sản Phẩm Mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng Sản Phẩm</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Đang Bán</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.available}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hết Hàng</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {stats.unavailable}
                                </p>
                            </div>
                            <Package className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Doanh Thu Ước Tính</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {(stats.totalRevenue / 1000000).toFixed(1)}M
                                </p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="available">Đang bán</SelectItem>
                                <SelectItem value="unavailable">Hết hàng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onView={handleView}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Xóa Bộ Lọc
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Chi Tiết Sản Phẩm</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                                ✕
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={selectedProduct.thumbnail || "/placeholder.svg"}
                                    alt={selectedProduct.name}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.svg";
                                    }}
                                />
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <Badge variant="outline">{selectedProduct.category}</Badge>
                                    {getStatusBadge(selectedProduct.isAvailable)}
                                    <Badge variant="secondary">{selectedProduct.type}</Badge>
                                    {selectedProduct.rateCount > 200 && (
                                        <Badge className="bg-orange-100 text-orange-800">
                                            <Star className="w-3 h-3 mr-1" />
                                            Phổ biến
                                        </Badge>
                                    )}
                                </div>
                                {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium mb-2">Tags:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedProduct.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                                    <p className="text-gray-600">{selectedProduct.description}</p>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className="text-2xl font-bold text-green-600">
                                        {selectedProduct.finalPrice.toLocaleString()} VNĐ
                                    </span>
                                    {selectedProduct.isDiscountActive && selectedProduct.price > selectedProduct.discountPrice && (
                                        <>
                                            <span className="text-lg text-gray-500 line-through">
                                                {selectedProduct.price.toLocaleString()} VNĐ
                                            </span>
                                            <Badge variant="destructive">
                                                -{getDiscountPercent(selectedProduct.price, selectedProduct.discountPrice)}%
                                            </Badge>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Đánh giá:</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-medium">{selectedProduct.rate.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Lượt đánh giá:</span>
                                        <span className="font-medium ml-2">{selectedProduct.rateCount}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Khẩu phần:</span>
                                        <span className="font-medium ml-2">{selectedProduct.portion || "1 phần"}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Thời gian:</span>
                                        <span className="font-medium ml-2">{selectedProduct.preparationTime}</span>
                                    </div>
                                </div>

                                {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Thành phần:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.ingredients.map((ingredient, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {ingredient}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedProduct.nutritionalInformation && selectedProduct.nutritionalInformation.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Thông tin dinh dưỡng:</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {selectedProduct.nutritionalInformation.map((nutrition, index) => (
                                                <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                                                    <span className="text-gray-600">{nutrition.name}:</span>
                                                    <span className="font-medium">{nutrition.value}{nutrition.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={() => handleEdit(selectedProduct)} className="flex-1">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh Sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleDelete(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Xóa
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchProducts();
                }}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                }}
                onSuccess={() => {
                    fetchProducts();
                }}
                product={editingProduct}
            />
        </div>
    );
}
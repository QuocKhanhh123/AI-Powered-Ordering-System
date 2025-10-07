import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    Star,
    Package,
    DollarSign,
    TrendingUp,
    Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
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

// Mock data - trong thực tế sẽ lấy từ API
const mockProducts = [
    {
        id: 'PRD001',
        name: 'Phở Bò Đặc Biệt',
        category: 'Phở',
        price: 85000,
        originalPrice: 90000,
        description: 'Phở bò truyền thống với thịt bò tái, chín, gân và bánh phở tươi',
        image: '/assets/images/vietnamese-pho-bo-with-beef-and-herbs.jpg',
        status: 'active',
        stock: 50,
        rating: 4.8,
        soldCount: 156,
        createdDate: '2024-01-15',
        ingredients: ['Bánh phở', 'Thịt bò', 'Hành tây', 'Ngò gai', 'Nước dùng'],
        isPopular: true,
        discount: 5
    },
    {
        id: 'PRD002',
        name: 'Bánh Mì Thịt Nướng',
        category: 'Bánh Mì',
        price: 25000,
        originalPrice: 25000,
        description: 'Bánh mì giòn tan với thịt nướng thơm lừng, rau sống tươi ngon',
        image: '/assets/images/vietnamese-banh-mi-sandwich-with-grilled-pork.jpg',
        status: 'active',
        stock: 30,
        rating: 4.6,
        soldCount: 89,
        createdDate: '2024-01-10',
        ingredients: ['Bánh mì', 'Thịt nướng', 'Pate', 'Rau sống', 'Đồ chua'],
        isPopular: true,
        discount: 0
    },
    {
        id: 'PRD003',
        name: 'Cơm Tấm Sườn Bì',
        category: 'Cơm',
        price: 45000,
        originalPrice: 45000,
        description: 'Cơm tấm thơm ngon với sườn nướng, bì và chả trứng',
        image: '/assets/images/vietnamese-com-tam-with-grilled-pork-ribs.jpg',
        status: 'active',
        stock: 25,
        rating: 4.5,
        soldCount: 67,
        createdDate: '2024-01-08',
        ingredients: ['Cơm tấm', 'Sườn nướng', 'Bì', 'Chả trứng', 'Nước mắm'],
        isPopular: false,
        discount: 0
    },
    {
        id: 'PRD004',
        name: 'Bún Bò Huế',
        category: 'Bún',
        price: 55000,
        originalPrice: 60000,
        description: 'Bún bò Huế cay nồng đặc trưng miền Trung với thịt bò và chả cua',
        image: '/assets/images/vietnamese-bun-bo-hue-spicy-noodle-soup.jpg',
        status: 'inactive',
        stock: 0,
        rating: 4.7,
        soldCount: 123,
        createdDate: '2024-01-05',
        ingredients: ['Bún bò', 'Thịt bò', 'Chả cua', 'Nước dùng cay', 'Rau thơm'],
        isPopular: true,
        discount: 8
    }
];

const categories = ['Tất cả', 'Phở', 'Bánh Mì', 'Cơm', 'Bún', 'Món Khác'];

function getStatusBadge(status) {
    const config = {
        active: { label: 'Đang bán', color: 'bg-green-100 text-green-800 border-green-200' },
        inactive: { label: 'Tạm ngưng', color: 'bg-red-100 text-red-800 border-red-200' },
        draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    };

    const statusConfig = config[status] || config.active;
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
}

function ProductCard({ product, onEdit, onDelete, onView }) {
    return (
        <Card className="overflow-hidden">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{product.discount}%
                    </div>
                )}
                {product.isPopular && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Phổ biến
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg truncate">{product.name}</h3>
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

                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{product.category}</Badge>
                    {getStatusBadge(product.status)}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-green-600">
                            {product.price.toLocaleString()} VNĐ
                        </span>
                        {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice.toLocaleString()} VNĐ
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{product.rating}</span>
                    </div>
                    <span>Đã bán: {product.soldCount}</span>
                    <span>Kho: {product.stock}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminProducts() {
    const [products, setProducts] = useState(mockProducts);
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'table'

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

        if (statusFilter !== 'all') {
            filtered = filtered.filter(product => product.status === statusFilter);
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, categoryFilter, statusFilter]);

    const handleEdit = (product) => {
        // Implement edit functionality
        console.log('Edit product:', product);
    };

    const handleDelete = (product) => {
        // Implement delete functionality
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
            setProducts(prev => prev.filter(p => p.id !== product.id));
        }
    };

    const handleView = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                    <p className="text-gray-600">Quản lý menu và danh mục sản phẩm</p>
                </div>
                <Button>
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
                                <p className="text-2xl font-bold">{products.length}</p>
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
                                    {products.filter(p => p.status === 'active').length}
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
                                <p className="text-sm text-gray-600">Tạm Ngưng</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {products.filter(p => p.status === 'inactive').length}
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
                                <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {(products.reduce((sum, p) => sum + (p.price * p.soldCount), 0) / 1000000).toFixed(1)}M
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
                                <SelectItem value="active">Đang bán</SelectItem>
                                <SelectItem value="inactive">Tạm ngưng</SelectItem>
                                <SelectItem value="draft">Nháp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
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

            {filteredProducts.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                        <Button variant="outline">
                            Xóa Bộ Lọc
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Chi Tiết Sản Phẩm</h2>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                                ×
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge variant="outline">{selectedProduct.category}</Badge>
                                    {getStatusBadge(selectedProduct.status)}
                                    {selectedProduct.isPopular && (
                                        <Badge className="bg-orange-100 text-orange-800">
                                            <Star className="w-3 h-3 mr-1" />
                                            Phổ biến
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                                    <p className="text-gray-600">{selectedProduct.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-green-600">
                                        {selectedProduct.price.toLocaleString()} VNĐ
                                    </span>
                                    {selectedProduct.originalPrice > selectedProduct.price && (
                                        <span className="text-lg text-gray-500 line-through">
                                            {selectedProduct.originalPrice.toLocaleString()} VNĐ
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Đánh giá:</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span className="font-medium">{selectedProduct.rating}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Đã bán:</span>
                                        <span className="font-medium ml-2">{selectedProduct.soldCount}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Tồn kho:</span>
                                        <span className="font-medium ml-2">{selectedProduct.stock}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Ngày tạo:</span>
                                        <span className="font-medium ml-2">{selectedProduct.createdDate}</span>
                                    </div>
                                </div>

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

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={() => handleEdit(selectedProduct)} className="flex-1">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh Sửa
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDelete(selectedProduct)}
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
        </div>
    );
}
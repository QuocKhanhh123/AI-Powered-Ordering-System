import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { Badge } from '../ui/badge';
import apiClient from '../../lib/api';
import { toast } from 'sonner';

const CATEGORIES = [
    'Món Chính',
    'Món Phụ',
    'Khai Vị',
    'Tráng Miệng',
    'Đồ Uống',
    'Khác'
];

const TYPES = [
    { value: 'food', label: 'Món ăn' },
    { value: 'drink', label: 'Đồ uống' }
];

export default function AddProductModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Món Chính',
        thumbnail: '',
        images: [''],
        tags: [''],
        type: 'food',
        isAvailable: true,
        preparationTime: '',
        portion: '',
        ingredients: [''],
        nutritionalInformation: [{ name: '', value: '', unit: '' }],
        price: '',
        discountPrice: '',
        discountStartAt: '',
        discountEndAt: ''
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleNutritionChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            nutritionalInformation: prev.nutritionalInformation.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], field === 'nutritionalInformation' ? { name: '', value: '', unit: '' } : '']
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.description || !formData.price) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                setLoading(false);
                return;
            }

            // Prepare data
            const submitData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                thumbnail: formData.thumbnail || undefined,
                images: formData.images.filter(img => img.trim() !== ''),
                tags: formData.tags.filter(tag => tag.trim() !== ''),
                type: formData.type,
                isAvailable: formData.isAvailable,
                preparationTime: formData.preparationTime || undefined,
                portion: formData.portion || undefined,
                ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
                nutritionalInformation: formData.nutritionalInformation
                    .filter(nut => nut.name && nut.value)
                    .map(nut => ({
                        name: nut.name,
                        value: parseFloat(nut.value),
                        unit: nut.unit || ''
                    })),
                price: parseFloat(formData.price),
                discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
                discountStartAt: formData.discountStartAt || undefined,
                discountEndAt: formData.discountEndAt || undefined
            };

            // Call API
            await apiClient.post('/api/menu-items/add', submitData);

            toast.success('Thêm sản phẩm thành công!');
            onSuccess();
            onClose();

            // Reset form
            setFormData({
                name: '',
                description: '',
                category: 'Món Chính',
                thumbnail: '',
                images: [''],
                tags: [''],
                type: 'food',
                isAvailable: true,
                preparationTime: '',
                portion: '',
                ingredients: [''],
                nutritionalInformation: [{ name: '', value: '', unit: '' }],
                price: '',
                discountPrice: '',
                discountStartAt: '',
                discountEndAt: ''
            });
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error(error.message || 'Không thể thêm sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold">Thêm Sản Phẩm Mới</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Thông Tin Cơ Bản</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên Sản Phẩm <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="VD: Phở Bò Đặc Biệt"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Danh Mục</Label>
                                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Loại</Label>
                                    <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPES.map(type => (
                                                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isAvailable"
                                        checked={formData.isAvailable}
                                        onCheckedChange={(checked) => handleChange('isAvailable', checked)}
                                    />
                                    <Label htmlFor="isAvailable">Còn hàng</Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô Tả <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Hình Ảnh</h3>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Ảnh Đại Diện (URL)</Label>
                                <Input
                                    id="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={(e) => handleChange('thumbnail', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Ảnh Chi Tiết (URLs)</Label>
                                    <Button type="button" size="sm" onClick={() => addArrayItem('images')}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Thêm
                                    </Button>
                                </div>
                                {formData.images.map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={img}
                                            onChange={(e) => handleArrayChange('images', index, e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {formData.images.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeArrayItem('images', index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Chi Tiết Sản Phẩm</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="preparationTime">Thời Gian Chuẩn Bị</Label>
                                    <Input
                                        id="preparationTime"
                                        value={formData.preparationTime}
                                        onChange={(e) => handleChange('preparationTime', e.target.value)}
                                        placeholder="VD: 10-15 phút"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="portion">Khẩu Phần</Label>
                                    <Input
                                        id="portion"
                                        value={formData.portion}
                                        onChange={(e) => handleChange('portion', e.target.value)}
                                        placeholder="VD: 1 tô"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Tags</Label>
                                    <Button type="button" size="sm" onClick={() => addArrayItem('tags')}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Thêm
                                    </Button>
                                </div>
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={tag}
                                            onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                                            placeholder="VD: pho, noodle"
                                        />
                                        {formData.tags.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeArrayItem('tags', index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Ingredients */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Thành Phần</Label>
                                    <Button type="button" size="sm" onClick={() => addArrayItem('ingredients')}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Thêm
                                    </Button>
                                </div>
                                {formData.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={ingredient}
                                            onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                                            placeholder="VD: Bánh phở"
                                        />
                                        {formData.ingredients.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeArrayItem('ingredients', index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutritional Information */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Thông Tin Dinh Dưỡng</h3>
                                <Button type="button" size="sm" onClick={() => addArrayItem('nutritionalInformation')}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm
                                </Button>
                            </div>

                            {formData.nutritionalInformation.map((nutrition, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2">
                                    <Input
                                        className="col-span-4"
                                        value={nutrition.name}
                                        onChange={(e) => handleNutritionChange(index, 'name', e.target.value)}
                                        placeholder="Tên (VD: Calories)"
                                    />
                                    <Input
                                        className="col-span-3"
                                        type="number"
                                        value={nutrition.value}
                                        onChange={(e) => handleNutritionChange(index, 'value', e.target.value)}
                                        placeholder="Giá trị"
                                    />
                                    <Input
                                        className="col-span-3"
                                        value={nutrition.unit}
                                        onChange={(e) => handleNutritionChange(index, 'unit', e.target.value)}
                                        placeholder="Đơn vị (VD: kcal)"
                                    />
                                    {formData.nutritionalInformation.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className="col-span-2"
                                            onClick={() => removeArrayItem('nutritionalInformation', index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Giá & Giảm Giá</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Giá Gốc (VNĐ) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleChange('price', e.target.value)}
                                        placeholder="50000"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discountPrice">Giá Giảm (VNĐ)</Label>
                                    <Input
                                        id="discountPrice"
                                        type="number"
                                        value={formData.discountPrice}
                                        onChange={(e) => handleChange('discountPrice', e.target.value)}
                                        placeholder="45000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discountStartAt">Bắt Đầu Giảm Giá</Label>
                                    <Input
                                        id="discountStartAt"
                                        type="datetime-local"
                                        value={formData.discountStartAt}
                                        onChange={(e) => handleChange('discountStartAt', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="discountEndAt">Kết Thúc Giảm Giá</Label>
                                    <Input
                                        id="discountEndAt"
                                        type="datetime-local"
                                        value={formData.discountEndAt}
                                        onChange={(e) => handleChange('discountEndAt', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang thêm...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm Sản Phẩm
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

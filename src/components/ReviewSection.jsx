import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Loader2, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/lib/api';
import authService from '@/lib/authService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';

export default function ReviewSection({ menuItemId }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: '',
        images: []
    });

    const [user, setUser] = useState(authService.getCurrentUser());
    const userReview = reviews.find(r => r.userId?._id === user?.id);

    useEffect(() => {
        fetchReviews();

        // Re-check user on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, [menuItemId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/reviews/menu/${menuItemId}`);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReviewDialog = (review = null) => {
        if (review) {
            setEditingReview(review);
            setReviewForm({
                rating: review.rating,
                comment: review.comment || '',
                images: review.images || []
            });
        } else {
            setEditingReview(null);
            setReviewForm({
                rating: 5,
                comment: '',
                images: []
            });
        }
        setShowReviewDialog(true);
    };

    const handleSubmitReview = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để đánh giá');
            return;
        }

        if (!reviewForm.comment.trim()) {
            toast.error('Vui lòng nhập nhận xét');
            return;
        }

        try {
            setSubmitting(true);

            // Không cần gửi userId vì backend lấy từ token
            const payload = {
                rating: reviewForm.rating,
                comment: reviewForm.comment.trim(),
                images: reviewForm.images
            };

            if (editingReview) {
                await apiClient.patch(`/api/reviews/menu/${menuItemId}/update`, payload);
                toast.success('Cập nhật đánh giá thành công');
            } else {
                await apiClient.post(`/api/reviews/menu/${menuItemId}/add`, payload);
                toast.success('Đánh giá thành công');
            }

            setShowReviewDialog(false);
            setReviewForm({ rating: 5, comment: '', images: [] });
            setEditingReview(null);
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            // Hiển thị thông báo cụ thể từ backend
            if (error.response?.status === 403) {
                toast.error('Bạn cần mua món ăn này trước khi đánh giá');
            } else {
                toast.error(error.response?.data?.message || error.message || 'Không thể gửi đánh giá');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

        try {
            await apiClient.delete(`/api/reviews/menu/${menuItemId}`);
            toast.success('Đã xóa đánh giá');
            setShowReviewDialog(false);
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Không thể xóa đánh giá');
        }
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                        onClick={() => interactive && onRatingChange && onRatingChange(star)}
                    />
                ))}
            </div>
        );
    };

    const getAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    const avgRating = getAverageRating();
    const distribution = getRatingDistribution();

    return (
        <div className="space-y-6">
            {/* Rating Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Đánh giá sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Average Rating */}
                        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                            <div className="text-5xl font-bold text-primary mb-2">{avgRating}</div>
                            {renderStars(Math.round(avgRating))}
                            <p className="text-sm text-gray-600 mt-2">{reviews.length} đánh giá</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-2">
                                    <span className="text-sm w-8">{star} ⭐</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400"
                                            style={{
                                                width: `${reviews.length > 0 ? (distribution[star] / reviews.length) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{distribution[star]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Write Review Button */}
                    {user && (
                        <div className="mt-6">
                            {userReview ? (
                                <Button
                                    variant="outline"
                                    onClick={() => handleOpenReviewDialog(userReview)}
                                    className="w-full"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa đánh giá của bạn
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleOpenReviewDialog()}
                                    className="w-full"
                                >
                                    Viết đánh giá
                                </Button>
                            )}
                        </div>
                    )}
                    {!user && (
                        <p className="text-center text-sm text-gray-600 mt-4">
                            Vui lòng đăng nhập để đánh giá sản phẩm
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tất cả đánh giá ({reviews.length})</h3>

                {reviews.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center text-gray-500">
                            Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                        </CardContent>
                    </Card>
                ) : (
                    reviews.map((review) => (
                        <Card key={review._id}>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={review.userId?.avatar} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {getUserInitials(review.userId?.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-semibold">{review.userId?.name || review.userId?.email || 'Người dùng'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {review.userId?._id === user?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenReviewDialog(review)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {renderStars(review.rating)}

                                        <p className="mt-3 text-gray-700">{review.comment}</p>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex gap-2 mt-3">
                                                {review.images.map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`Review ${idx + 1}`}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Review Dialog */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
                        </DialogTitle>
                        <DialogDescription>
                            Chia sẻ trải nghiệm của bạn về sản phẩm này
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Rating */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Đánh giá <span className="text-red-500">*</span>
                            </label>
                            {renderStars(reviewForm.rating, true, (rating) =>
                                setReviewForm(prev => ({ ...prev, rating }))
                            )}
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Nhận xét <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                placeholder="Chia sẻ trải nghiệm của bạn..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        {/* Images (Optional - for future enhancement) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hình ảnh (tùy chọn)</label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
                                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">Tính năng upload ảnh sẽ được cập nhật</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {editingReview && (
                            <Button
                                variant="destructive"
                                onClick={handleDeleteReview}
                                className="mr-auto"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setShowReviewDialog(false)}
                            className="flex-1"
                            disabled={submitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmitReview}
                            className="flex-1"
                            disabled={submitting || !reviewForm.comment.trim()}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                editingReview ? 'Cập nhật' : 'Gửi đánh giá'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

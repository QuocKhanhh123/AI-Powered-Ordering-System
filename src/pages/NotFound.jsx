import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-orange-500 mb-4">404</h1>
                    <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Trang không tìm thấy!
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 gap-2"
                    >
                        <Home className="h-5 w-5" />
                        Về Trang Chủ
                    </Link>

                    <Link
                        to="/menu"
                        className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition-colors duration-200 gap-2"
                    >
                        <Search className="h-5 w-5" />
                        Xem Thực Đơn
                    </Link>
                </div>

                {/* Fun Element */}
                <div className="mt-12">
                    <div className="text-6xl mb-4">🍜</div>
                    <p className="text-gray-500 text-sm">
                        Trong lúc chờ đợi, tại sao không thử món phở ngon của chúng tôi?
                    </p>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-8 inline-flex items-center text-gray-500 hover:text-orange-500 transition-colors duration-200 gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại trang trước
                </button>
            </div>
        </div>
    );
};

export default NotFound;
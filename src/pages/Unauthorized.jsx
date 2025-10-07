import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <ShieldX className="h-10 w-10 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Không có quyền truy cập
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <Button onClick={handleGoBack} variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </Button>
                        <Button asChild className="w-full">
                            <Link to="/">
                                <Home className="mr-2 h-4 w-4" />
                                Về trang chủ
                            </Link>
                        </Button>
                    </div>
                    <div className="text-center text-sm text-gray-500">
                        <p>Mã lỗi: 403 - Forbidden</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Unauthorized;
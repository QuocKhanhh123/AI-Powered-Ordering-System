import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import apiClient from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Mình là trợ lý AI của FoodieHub. Bạn muốn tìm món gì ạ? 😊',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await apiClient.post('/api/chatbot/send', {
                message: inputMessage,
                sessionId: sessionId
            });

            if (response.success !== false) {
                // Update session ID
                if (response.sessionId && !sessionId) {
                    setSessionId(response.sessionId);
                }

                // Add bot reply
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.reply || 'Xin lỗi, mình không hiểu câu hỏi của bạn. Bạn có thể nói rõ hơn được không?',
                    sender: 'bot',
                    timestamp: new Date(),
                    products: response.products || []
                };

                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(response.error || 'Không thể kết nối đến server');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: 'Xin lỗi, có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại sau.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatMessageText = (text) => {
        // Convert **text** to bold
        const formattedText = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return formattedText;
    };

    const handleViewProduct = (product) => {
        navigate(`/product/${product.id}`);
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat Button - Fixed position */}
            {!isOpen && (
                <Button
                    onClick={handleToggleChat}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                </Button>
            )}

            {/* Chat Window - Fixed position */}
            {isOpen && (
                <Card className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-80 h-16' : 'w-[450px] h-[650px]'
                    }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-primary-foreground">
                                    <AvatarFallback className="bg-primary-foreground text-primary">
                                        <Bot className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Trợ Lý Ảo</h3>
                                <p className="text-xs opacity-90">Trực tuyến</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
                                onClick={handleMinimize}
                                title="Thu gọn"
                            >
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
                                onClick={handleClose}
                                title="Đóng"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    {!isMinimized && (
                        <>
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id}>
                                            <div
                                                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                                                    }`}
                                            >
                                                <Avatar className="h-8 w-8 flex-shrink-0">
                                                    <AvatarFallback className={
                                                        message.sender === 'bot'
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted'
                                                    }>
                                                        {message.sender === 'bot' ? (
                                                            <Bot className="h-4 w-4" />
                                                        ) : (
                                                            <User className="h-4 w-4" />
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
                                                    } max-w-[70%]`}>
                                                    <div className={`rounded-2xl px-4 py-2 ${message.sender === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                        }`}>
                                                        <p
                                                            className="text-sm whitespace-pre-wrap break-words"
                                                            dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Product Cards */}
                                            {message.products && message.products.length > 0 && (
                                                <div className="mt-3 space-y-2 ml-11">
                                                    {message.products.map((product) => (
                                                        <Card
                                                            key={product.id}
                                                            className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                                                                    <img
                                                                        src={product.thumbnail || 'https://via.placeholder.com/80'}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                                        }}
                                                                    />
                                                                    {product.hasDiscount && (
                                                                        <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                                                                            -SALE
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                                                                        {product.name}
                                                                    </h4>
                                                                    {product.description && (
                                                                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                                            {product.description}
                                                                        </p>
                                                                    )}
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className={`font-bold text-sm ${product.hasDiscount ? 'text-red-500' : 'text-primary'
                                                                            }`}>
                                                                            {formatPrice(product.currentPrice || product.price)}
                                                                        </span>
                                                                        {product.hasDiscount && product.price !== product.currentPrice && (
                                                                            <span className="text-xs text-muted-foreground line-through">
                                                                                {formatPrice(product.price)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            className="h-7 text-xs w-full"
                                                                            onClick={() => handleViewProduct(product)}
                                                                        >
                                                                            Xem chi tiết
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="bg-muted rounded-2xl px-4 py-3">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-4 border-t bg-muted/30">
                                <div className="flex gap-2">
                                    <Input
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1"
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        size="icon"
                                        disabled={!inputMessage.trim() || isTyping}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 text-center">
                                    Nhấn Enter để gửi tin nhắn
                                </p>
                            </div>
                        </>
                    )}
                </Card>
            )}
        </>
    );
}

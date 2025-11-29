import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Xin chào! Tôi là trợ lý ảo của Order System. Tôi có thể giúp gì cho bạn?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages([...messages, newMessage]);
        setInputMessage('');

        // Simulate bot typing
        setIsTyping(true);
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: 'Cảm ơn bạn đã liên hệ! Đây là phản hồi mẫu. Tính năng AI chatbot sẽ được tích hợp sau.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
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
                <Card className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
                    } flex flex-col`}>
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
                            >
                                <Minimize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-primary-foreground/20 text-primary-foreground"
                                onClick={handleClose}
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
                                        <div
                                            key={message.id}
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
                                                    <p className="text-sm whitespace-pre-wrap break-words">
                                                        {message.text}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
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

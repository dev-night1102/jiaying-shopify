import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EmojiPicker from 'emoji-picker-react';
import { useDropzone } from 'react-dropzone';
import {
    ArrowLeft,
    Smile,
    Paperclip,
    Send,
    MoreVertical,
    Phone,
    Video,
    X,
    Download,
    Eye,
    Check,
    CheckCheck,
    Clock,
    Image as ImageIcon,
    FileText,
    Upload,
    Wifi,
    WifiOff
} from 'lucide-react';

export default function RealtimeChat({ auth, chat, messages: initialMessages = [], isAdmin = false }) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [typingTimer, setTypingTimer] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Chat partner info
    const partner = isAdmin ? chat.user : { name: 'Support Team', role: 'admin' };

    // Initialize WebSocket connection
    useEffect(() => {
        if (typeof window.Echo === 'undefined') {
            console.warn('Echo not initialized');
            return;
        }

        // Subscribe to private chat channel
        const channel = window.Echo.private(`chat.${chat.id}`);
        
        // Connection status
        window.Echo.connector.pusher.connection.bind('connected', () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        });

        window.Echo.connector.pusher.connection.bind('disconnected', () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        });

        // Listen for new messages
        channel.listen('.message.sent', (e) => {
            console.log('New message received:', e);
            
            // Add message if it's not from current user
            if (e.sender_id !== auth.user.id) {
                setMessages(prev => [...prev, {
                    id: e.id,
                    chat_id: e.chat_id,
                    sender_id: e.sender_id,
                    content: e.content,
                    file_path: e.file_path,
                    created_at: e.created_at,
                    sender: e.sender,
                    delivered_at: new Date().toISOString(),
                }]);
                
                // Auto scroll to bottom
                setTimeout(() => scrollToBottom(), 100);
            }
        });

        // Listen for typing indicator
        channel.listen('.user.typing', (e) => {
            console.log('User typing:', e);
            
            if (e.user.id !== auth.user.id) {
                if (e.is_typing) {
                    setTypingUsers(prev => {
                        if (!prev.find(u => u.id === e.user.id)) {
                            return [...prev, e.user];
                        }
                        return prev;
                    });
                    
                    // Remove typing after 3 seconds
                    setTimeout(() => {
                        setTypingUsers(prev => prev.filter(u => u.id !== e.user.id));
                    }, 3000);
                } else {
                    setTypingUsers(prev => prev.filter(u => u.id !== e.user.id));
                }
            }
        });

        // Cleanup
        return () => {
            channel.stopListening('.message.sent');
            channel.stopListening('.user.typing');
            window.Echo.leave(`chat.${chat.id}`);
        };
    }, [chat.id, auth.user.id]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Auto-resize textarea
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const maxHeight = 120; // Max 4 rows
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [newMessage]);

    // Handle typing indicator
    const handleTyping = () => {
        // Send typing indicator
        router.post(`/chats/${chat.id}/typing`, {
            is_typing: true
        }, {
            preserveState: true,
            preserveScroll: true,
        });

        // Clear previous timer
        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        // Stop typing after 2 seconds of inactivity
        setTypingTimer(setTimeout(() => {
            router.post(`/chats/${chat.id}/typing`, {
                is_typing: false
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 2000));
    };

    // File upload handling
    const onDrop = (acceptedFiles) => {
        const validFiles = acceptedFiles.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB
            
            if (!validTypes.includes(file.type)) {
                alert(`File type ${file.type} is not supported`);
                return false;
            }
            
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Max size is 10MB`);
                return false;
            }
            
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            id: Math.random().toString(36).substring(7)
        }))]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    const removeFile = (fileId) => {
        setSelectedFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            // Revoke object URLs to prevent memory leaks
            prev.filter(f => f.id === fileId && f.preview).forEach(f => {
                URL.revokeObjectURL(f.preview);
            });
            return updated;
        });
    };

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() && selectedFiles.length === 0) return;

        setLoading(true);

        // Prepare data for sending
        const data = {
            content: newMessage,
            type: selectedFiles.length > 0 ? 'file' : 'text',
            _token: document.querySelector('meta[name="csrf-token"]')?.content
        };

        // Append files if any
        if (selectedFiles.length > 0) {
            data.files = selectedFiles.map(f => f.file);
        }

        // Send message
        router.post(`/chats/${chat.id}/send`, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Add message to local state immediately
                const tempMessage = {
                    id: Date.now(),
                    chat_id: chat.id,
                    sender_id: auth.user.id,
                    content: newMessage,
                    created_at: new Date().toISOString(),
                    sender: auth.user,
                };
                
                setMessages(prev => [...prev, tempMessage]);
                setNewMessage('');
                setSelectedFiles([]);
                setLoading(false);
                scrollToBottom();
            },
            onError: () => {
                setLoading(false);
                alert('Failed to send message. Please try again.');
            }
        });
    };

    // Format time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    };

    // Format date separator
    const formatDateSeparator = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
        }
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = new Date(message.created_at).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Chat with ${partner.name}`} />
            
            <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-3 flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => window.history.back()}
                            className="lg:hidden hover:bg-white/10 p-2 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-lg font-semibold">
                                {partner.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        
                        <div>
                            <h2 className="font-semibold">{partner.name}</h2>
                            <div className="flex items-center space-x-2 text-xs text-teal-100">
                                {isConnected ? (
                                    <>
                                        <Wifi className="w-3 h-3" />
                                        <span>Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="w-3 h-3" />
                                        <span>Connecting...</span>
                                    </>
                                )}
                                {typingUsers.length > 0 && (
                                    <span className="ml-2">typing...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="hover:bg-white/10 p-2 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div 
                    className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M0 10h40v1H0zm0 10h40v1H0zm0 10h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    
                    {isDragActive && (
                        <div className="fixed inset-0 bg-teal-500/20 backdrop-blur-sm z-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg p-8 shadow-xl">
                                <Upload className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                                <p className="text-lg font-semibold text-gray-800">Drop files here to upload</p>
                            </div>
                        </div>
                    )}

                    {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                        <div key={date}>
                            {/* Date Separator */}
                            <div className="flex items-center justify-center my-4">
                                <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs text-gray-600 shadow-sm">
                                    {formatDateSeparator(dateMessages[0].created_at)}
                                </span>
                            </div>

                            {/* Messages */}
                            {dateMessages.map((message) => {
                                const isOwn = message.sender_id === auth.user.id;
                                
                                return (
                                    <div
                                        key={message.id}
                                        className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                    >
                                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                            <div
                                                className={`rounded-lg px-4 py-2 shadow-sm ${
                                                    isOwn
                                                        ? 'bg-teal-600 text-white rounded-br-none'
                                                        : 'bg-white text-gray-800 rounded-bl-none'
                                                }`}
                                            >
                                                {!isOwn && (
                                                    <div className="text-xs font-semibold text-teal-600 mb-1">
                                                        {message.sender?.name}
                                                    </div>
                                                )}
                                                
                                                {message.file_path && (
                                                    <div className="mb-2">
                                                        {message.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                            <img 
                                                                src={`/storage/${message.file_path}`} 
                                                                alt="Shared image"
                                                                className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => window.open(`/storage/${message.file_path}`, '_blank')}
                                                            />
                                                        ) : (
                                                            <a 
                                                                href={`/storage/${message.file_path}`}
                                                                target="_blank"
                                                                className={`flex items-center space-x-2 p-2 rounded ${
                                                                    isOwn ? 'bg-teal-700 hover:bg-teal-800' : 'bg-gray-100 hover:bg-gray-200'
                                                                } transition-colors`}
                                                            >
                                                                <FileText className="w-5 h-5" />
                                                                <span className="text-sm">Download File</span>
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {message.content && (
                                                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                                )}
                                                
                                                <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                                                    isOwn ? 'text-teal-100' : 'text-gray-500'
                                                }`}>
                                                    <span>{formatTime(message.created_at)}</span>
                                                    {isOwn && (
                                                        <>
                                                            {message.read_at ? (
                                                                <CheckCheck className="w-4 h-4 text-teal-200" />
                                                            ) : message.delivered_at ? (
                                                                <CheckCheck className="w-4 h-4" />
                                                            ) : (
                                                                <Check className="w-4 h-4" />
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <div className="flex justify-start mb-3">
                            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm text-gray-600">
                                        {typingUsers.map(u => u.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing
                                    </span>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <div className="bg-gray-100 px-4 py-2 border-t">
                        <div className="flex items-center space-x-2 overflow-x-auto">
                            {selectedFiles.map((file) => (
                                <div key={file.id} className="relative group">
                                    {file.preview ? (
                                        <img 
                                            src={file.preview} 
                                            alt={file.file.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                                        {file.file.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="bg-white border-t px-4 py-3">
                    <div className="flex items-end space-x-2">
                        {/* Emoji Picker Button */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Smile className="w-5 h-5" />
                        </button>

                        {/* File Upload Button */}
                        <label className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                            <Paperclip className="w-5 h-5" />
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={(e) => onDrop(Array.from(e.target.files))}
                            />
                        </label>

                        {/* Message Input */}
                        <div className="flex-1">
                            <textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Type a message"
                                className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                rows="1"
                                style={{ minHeight: '40px' }}
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={loading || (!newMessage.trim() && selectedFiles.length === 0)}
                            className={`p-2 rounded-full transition-all ${
                                loading || (!newMessage.trim() && selectedFiles.length === 0)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-teal-600 text-white hover:bg-teal-700 hover:scale-105'
                            }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-20 left-4" ref={emojiPickerRef}>
                            <EmojiPicker
                                onEmojiClick={(emojiObject) => {
                                    setNewMessage(prev => prev + emojiObject.emoji);
                                    setShowEmojiPicker(false);
                                }}
                                width={300}
                                height={400}
                            />
                        </div>
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
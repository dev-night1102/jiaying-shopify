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
    Upload
} from 'lucide-react';

export default function WhatsAppChat({ auth, chat, messages = [], isAdmin = false }) {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimer, setTypingTimer] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);

    // Chat partner info
    const partner = isAdmin ? chat.user : { name: 'Support Team', role: 'admin' };

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Real-time polling
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ 
                only: ['messages'],
                preserveState: true,
                preserveScroll: true
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [chat.id]);

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
        if (!isTyping) {
            setIsTyping(true);
            // Send typing event to server
            router.post(`/chats/${chat.id}/typing`, {}, { 
                preserveState: true,
                preserveScroll: true 
            });
        }

        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        setTypingTimer(setTimeout(() => {
            setIsTyping(false);
            // Send stop typing event to server
        }, 3000));
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

        const formData = new FormData();
        formData.append('content', newMessage);
        formData.append('type', selectedFiles.length > 0 ? 'file' : 'text');
        
        selectedFiles.forEach((fileObj, index) => {
            formData.append(`files[${index}]`, fileObj.file);
        });

        try {
            await router.post(`/chats/${chat.id}/send`, formData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setSelectedFiles([]);
                    setShowEmojiPicker(false);
                    textareaRef.current?.focus();
                }
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle emoji selection
    const onEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = newMessage.slice(0, start) + emoji + newMessage.slice(end);
            setNewMessage(newValue);
            
            // Focus and set cursor position after emoji
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            setNewMessage(prev => prev + emoji);
        }
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getMessageStatus = (message) => {
        if (message.sender_id === auth.user.id) {
            // My message
            if (message.read_at) return <CheckCheck className="w-4 h-4 text-blue-500" />;
            if (message.delivered_at) return <CheckCheck className="w-4 h-4 text-gray-400" />;
            return <Check className="w-4 h-4 text-gray-400" />;
        }
        return null;
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
            return <ImageIcon className="w-5 h-5" />;
        }
        return <FileText className="w-5 h-5" />;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`Chat with ${partner.name}`} />
            
            {/* WhatsApp-style Chat Container */}
            <div className="max-w-md mx-auto h-screen flex flex-col bg-white shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-600 text-white shadow-lg">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => window.history.back()}
                            className="p-1 hover:bg-slate-500 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center font-bold text-sm">
                            {partner.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-sm">{partner.name || 'Support Team'}</h3>
                            <p className="text-xs text-slate-200">
                                {isTyping ? 'typing...' : 'online'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                        <button className="p-2 hover:bg-slate-500 rounded-full transition-colors">
                            <Video className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-500 rounded-full transition-colors">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-slate-500 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area with WhatsApp Background */}
                <div 
                    {...getRootProps()}
                    className={`flex-1 overflow-y-auto p-4 space-y-2 relative ${
                        isDragActive ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                    }`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f2f5' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundColor: '#e5ddd5'
                    }}
                >
                    <input {...getInputProps()} />
                    
                    {isDragActive && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-blue-50/90">
                            <div className="text-center">
                                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                <p className="text-blue-600 font-medium">Drop files here to upload</p>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((message, index) => {
                        const isMyMessage = message.sender_id === auth.user.id;
                        const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
                        
                        return (
                            <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-1`}>
                                <div className={`max-w-[80%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                                    {/* Message Bubble */}
                                    <div className={`
                                        relative px-3 py-2 rounded-2xl shadow-sm
                                        ${isMyMessage 
                                            ? 'bg-green-500 text-white rounded-br-md' 
                                            : 'bg-white text-gray-800 rounded-bl-md'
                                        }
                                    `}>
                                        {/* Message Content */}
                                        {message.type === 'file' && message.file_path && (
                                            <div className="mb-2">
                                                {message.file_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                    <img 
                                                        src={`/storage/${message.file_path}`} 
                                                        alt="Shared image" 
                                                        className="max-w-full rounded-lg cursor-pointer"
                                                        onClick={() => window.open(`/storage/${message.file_path}`, '_blank')}
                                                    />
                                                ) : (
                                                    <div className="flex items-center space-x-2 p-2 bg-black/10 rounded-lg">
                                                        {getFileIcon(message.file_path)}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm truncate">
                                                                {message.file_path.split('/').pop()}
                                                            </p>
                                                            <p className="text-xs opacity-70">Document</p>
                                                        </div>
                                                        <a 
                                                            href={`/storage/${message.file_path}`} 
                                                            download
                                                            className="p-1 hover:bg-black/10 rounded"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {message.content && (
                                            <p className="text-sm break-words">{message.content}</p>
                                        )}
                                        
                                        {/* Timestamp and Status */}
                                        <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                            isMyMessage ? 'text-green-100' : 'text-gray-500'
                                        }`}>
                                            <span className="text-xs">
                                                {formatTime(message.created_at)}
                                            </span>
                                            {getMessageStatus(message)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Auto-scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>

                {/* File Preview Area */}
                {selectedFiles.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 border-t">
                        <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((fileObj) => (
                                <div key={fileObj.id} className="relative">
                                    {fileObj.preview ? (
                                        <div className="relative">
                                            <img 
                                                src={fileObj.preview} 
                                                alt="Preview" 
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => removeFile(fileObj.id)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex flex-col items-center justify-center relative">
                                            {getFileIcon(fileObj.file.name)}
                                            <span className="text-xs mt-1 truncate max-w-full px-1">
                                                {fileObj.file.name.split('.').pop().toUpperCase()}
                                            </span>
                                            <button
                                                onClick={() => removeFile(fileObj.id)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="px-3 py-2 bg-white border-t border-gray-200">
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute bottom-16 left-4 z-50">
                            <EmojiPicker 
                                onEmojiClick={onEmojiClick}
                                width={300}
                                height={350}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                        {/* Emoji Button */}
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Smile className="w-6 h-6" />
                        </button>

                        {/* Message Input */}
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                className="w-full resize-none rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-colors"
                                rows="1"
                                style={{ minHeight: '40px' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </div>

                        {/* File Upload Button */}
                        <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors">
                            <Paperclip className="w-6 h-6" />
                            <input
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        onDrop(Array.from(e.target.files));
                                    }
                                }}
                                className="hidden"
                            />
                        </label>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={loading || (!newMessage.trim() && selectedFiles.length === 0)}
                            className={`p-2 rounded-full transition-all duration-200 ${
                                loading || (!newMessage.trim() && selectedFiles.length === 0)
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-white bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-6 h-6" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
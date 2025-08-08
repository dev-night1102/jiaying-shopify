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

    // Optional scroll to bottom (removed automatic scrolling)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Removed automatic scroll on message changes

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
        // For now, just show typing locally without server request
        // In production, you'd use WebSockets for this
        if (!isTyping) {
            setIsTyping(true);
        }

        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        setTypingTimer(setTimeout(() => {
            setIsTyping(false);
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

        // Prepare data for sending
        const data = {
            content: newMessage,
            type: selectedFiles.length > 0 ? 'file' : 'text',
            _token: document.querySelector('meta[name="csrf-token"]')?.content
        };
        
        // If there are files, we need to use FormData
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            formData.append('content', newMessage);
            formData.append('type', 'file');
            selectedFiles.forEach((fileObj, index) => {
                formData.append(`files[${index}]`, fileObj.file);
            });
            
            router.post(`/chats/${chat.id}/send`, formData, {
                forceFormData: true,
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setSelectedFiles([]);
                    setShowEmojiPicker(false);
                    textareaRef.current?.focus();
                },
                onError: (errors) => {
                    console.error('Failed to send message:', errors);
                    alert('Failed to send message. Please try again.');
                },
                onFinish: () => setLoading(false)
            });
        } else {
            router.post(`/chats/${chat.id}/send`, data, {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setShowEmojiPicker(false);
                    textareaRef.current?.focus();
                },
                onError: (errors) => {
                    console.error('Failed to send message:', errors);
                    alert('Failed to send message. Please try again.');
                },
                onFinish: () => setLoading(false)
            });
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
            // My message - show status
            if (message.is_read || message.read_at) {
                // Message has been read
                return <CheckCheck className="w-4 h-4 text-blue-500" title="Read" />;
            } else if (message.delivered_at || message.created_at) {
                // Message delivered but not read
                return <CheckCheck className="w-4 h-4 text-gray-400" title="Delivered" />;
            } else {
                // Message sent
                return <Check className="w-4 h-4 text-gray-400" title="Sent" />;
            }
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
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`Chat with ${partner.name}`} />
            
            {/* Full-width Chat Container */}
            <div className="h-[calc(100vh-8rem)] flex flex-col bg-white shadow-lg rounded-lg mx-4 my-4">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center font-bold text-sm">
                            {partner.name?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-lg">{partner.name || 'Support Team'}</h3>
                            <p className="text-xs text-emerald-100">
                                {isTyping ? 'typing...' : 'online'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
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
                        background: `linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(20,184,166,0.05) 50%, rgba(59,130,246,0.05) 100%)`,
                        position: 'relative'
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
                                        {/* WhatsApp-style File/Image Display */}
                                        {(message.type === 'file' || message.type === 'image') && message.image_path && (
                                            <div className="mb-2 max-w-sm">
                                                {message.image_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                    /* Image Message */
                                                    <div className="relative group rounded-lg overflow-hidden">
                                                        <img 
                                                            src={`/storage/${message.image_path}`} 
                                                            alt="Shared image" 
                                                            className="w-full max-w-xs rounded-lg cursor-pointer transition-all duration-200 hover:brightness-90"
                                                            onClick={() => window.open(`/storage/${message.image_path}`, '_blank')}
                                                            style={{maxHeight: '300px', objectFit: 'cover'}}
                                                            onError={(e) => {
                                                                console.error('Image failed to load:', e.target.src);
                                                                e.target.style.display = 'none';
                                                                e.target.nextElementSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        {/* Fallback for failed images */}
                                                        <div className="hidden w-full max-w-xs h-40 bg-gray-200 rounded-lg flex-col items-center justify-center">
                                                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                            <p className="text-xs text-gray-500">Image failed to load</p>
                                                            <a 
                                                                href={`/storage/${message.image_path}`} 
                                                                download
                                                                className="mt-2 px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                                                            >
                                                                Download
                                                            </a>
                                                        </div>
                                                        
                                                        {/* WhatsApp-style overlay buttons */}
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(`/storage/${message.image_path}`, '_blank');
                                                                    }}
                                                                    className="p-2 bg-white/90 text-gray-700 rounded-full shadow-lg hover:bg-white transition-colors"
                                                                    title="View full size"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <a 
                                                                    href={`/storage/${message.image_path}`} 
                                                                    download
                                                                    className="p-2 bg-white/90 text-gray-700 rounded-full shadow-lg hover:bg-white transition-colors"
                                                                    title="Download image"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* File Message */
                                                    <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-200 hover:bg-white/70 transition-colors max-w-xs">
                                                        <div className="flex-shrink-0">
                                                            {getFileIcon(message.image_path)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {message.image_path.split('/').pop()}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {message.image_path.split('.').pop().toUpperCase()} File
                                                            </p>
                                                        </div>
                                                        <a 
                                                            href={`/storage/${message.image_path}`} 
                                                            download
                                                            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                                            title="Download file"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {message.content && (
                                            <p className={`break-words ${
                                                message.content.match(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]$/u) 
                                                    ? 'text-5xl' 
                                                    : 'text-sm'
                                            }`}>{message.content}</p>
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
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                            <EmojiPicker 
                                onEmojiClick={onEmojiClick}
                                width={320}
                                height={400}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        {/* Left Actions */}
                        <div className="flex items-center gap-1">
                            {/* Emoji Button */}
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                title="Emojis"
                            >
                                <Smile className="w-5 h-5" />
                            </button>

                            {/* File Upload Button */}
                            <label className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full cursor-pointer transition-colors" title="Attach file">
                                <Paperclip className="w-5 h-5" />
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
                        </div>

                        {/* Message Input */}
                        <div className="flex-1">
                            <textarea
                                ref={textareaRef}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    handleTyping();
                                }}
                                placeholder="Type a message..."
                                className="w-full resize-none rounded-2xl px-4 py-2.5 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                rows="1"
                                style={{ minHeight: '42px', maxHeight: '120px' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={loading || (!newMessage.trim() && selectedFiles.length === 0)}
                            className={`p-2.5 rounded-full transition-all duration-200 ${
                                loading || (!newMessage.trim() && selectedFiles.length === 0)
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                            }`}
                            title="Send message"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
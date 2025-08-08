import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { 
    Upload, 
    X, 
    ShoppingBag, 
    Link as LinkIcon, 
    FileImage, 
    MessageSquare,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Plus,
    Image as ImageIcon,
    Globe
} from 'lucide-react';
import { useState } from 'react';

export default function OrderCreate({ auth }) {
    const { t } = useTranslation();
    const [selectedImages, setSelectedImages] = useState([]);
    
    const { data, setData, post, processing, errors } = useForm({
        product_link: '',
        notes: '',
        images: [],
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
        
        if (validFiles.length !== files.length) {
            alert('Some files were too large (max 5MB per file)');
        }
        
        setSelectedImages(prev => [...prev, ...validFiles].slice(0, 5));
        setData('images', [...data.images, ...validFiles].slice(0, 5));
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setData('images', newImages);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/orders');
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('Submit Order')} />

            {/* Background Image */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%), url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=1080&fit=crop&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            </div>

            {/* Floating Animation Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12 space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Premium Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 shadow-2xl mb-8 animate-slide-down">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                        
                        <div className="relative">
                            <div className="text-center">
                                <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
                                    <ShoppingBag className="w-12 h-12 mr-4 animate-bounce" />
                                    Submit New Order
                                </h1>
                                <p className="text-xl text-white/90">
                                    Get any product from anywhere in the world delivered to your door
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Global Access</h3>
                                    <p className="text-sm text-gray-600">Shop from any website worldwide</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Quality Assured</h3>
                                    <p className="text-sm text-gray-600">Professional inspection service</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">24/7 Support</h3>
                                    <p className="text-sm text-gray-600">Real-time chat assistance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Plus className="w-7 h-7 mr-3 text-indigo-600" />
                                Order Details
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Fill in the details below to get started with your order
                            </p>
                        </div>
                        
                        <form onSubmit={submit} className="p-8 space-y-8">
                            {/* Product Link Section */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <LinkIcon className="w-5 h-5 mr-2 text-indigo-600" />
                                    {t('Product Link')}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        value={data.product_link}
                                        onChange={(e) => setData('product_link', e.target.value)}
                                        className={`w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.product_link 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="https://example.com/product-page"
                                        required
                                    />
                                </div>
                                {errors.product_link && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.product_link}</p>
                                )}
                                <p className="text-sm text-gray-500 flex items-start">
                                    <Globe className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                    Paste any product link from Amazon, eBay, Taobao, or any other website
                                </p>
                            </div>

                            {/* Notes Section */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                                    {t('Special Instructions')} ({t('Optional')})
                                </label>
                                <textarea
                                    className={`w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 resize-none ${
                                        errors.notes 
                                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                            : 'border-gray-200 focus:border-purple-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                    }`}
                                    rows={4}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Specify size, color, quantity, or any special requirements..."
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.notes}</p>
                                )}
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
                                    <ImageIcon className="w-5 h-5 mr-2 text-pink-600" />
                                    {t('Product Images')} ({t('Optional')})
                                </label>
                                
                                <div className="relative">
                                    <div className="flex justify-center px-8 py-12 border-2 border-dashed border-gray-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 group cursor-pointer">
                                        <div className="space-y-4 text-center">
                                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8 text-indigo-600" />
                                            </div>
                                            <div>
                                                <label className="relative cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                                    <span className="text-lg">Click to upload images</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="text-gray-500">or drag and drop</p>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, GIF up to 5MB each (max 5 files)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {selectedImages.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                            <FileImage className="w-4 h-4 mr-2" />
                                            Uploaded Images ({selectedImages.length}/5)
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                            {selectedImages.map((image, index) => (
                                                <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transform scale-75 hover:scale-100 transition-all duration-300 shadow-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                        <p className="text-white text-xs font-medium truncate">{image.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {errors.images && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.images}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transform hover:scale-[1.02] transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 group relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center">
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                                Submitting Order...
                                            </>
                                        ) : (
                                            <>
                                                Submit Order
                                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                            </>
                                        )}
                                    </div>
                                    <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 animate-fade-in">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Our shopping experts are here to help you find and purchase any product from around the world.
                                </p>
                                <a 
                                    href="/chats" 
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                >
                                    Chat with Support
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
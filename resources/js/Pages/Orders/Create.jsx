import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import { Upload, X } from 'lucide-react';
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

            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{t('Submit Order')}</h1>
                    <p className="text-gray-600 mt-2">
                        {t('Paste the product link and provide any additional information')}
                    </p>
                </div>

                <div className="card p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <Input
                            label={t('Product Link')}
                            type="url"
                            value={data.product_link}
                            onChange={(e) => setData('product_link', e.target.value)}
                            error={errors.product_link}
                            placeholder="https://example.com/product"
                            required
                        />

                        <div>
                            <label className="label">{t('Notes')} ({t('Optional')})</label>
                            <textarea
                                className="input"
                                rows={4}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder={t('Any specific requirements, size, color, etc.')}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600 mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">{t('Upload Images')} ({t('Optional')})</label>
                            <div className="mt-2">
                                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                <span>{t('Upload files')}</span>
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <p className="pl-1">{t('or drag and drop')}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB (max 5 files)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedImages.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index + 1}`}
                                                className="h-24 w-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {errors.images && (
                                <p className="text-sm text-red-600 mt-1">{errors.images}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="secondary"
                                href="/orders"
                            >
                                {t('Cancel')}
                            </Button>
                            <Button type="submit" loading={processing}>
                                {t('Submit Order')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
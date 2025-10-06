'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { addItem } from '../../../firebase/firestore';
import { uploadImages } from '../../../firebase/storage';

export default function AddItem() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    dimensions: '',
    condition: '',
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imageFilePreviews, setImageFilePreviews] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles([...imageFiles, ...files]);
      
      // Create URL previews for the new files
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImageFilePreviews([...imageFilePreviews, ...newPreviews]);
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imageFilePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imageFilePreviews]);
  
  const handleRemoveImage = (index) => {
    // Remove the image file and its preview
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newPreviews = [...imageFilePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setImageFilePreviews(newPreviews);
    
    // Adjust main image index if needed
    if (index === mainImageIndex) {
      setMainImageIndex(0); // Reset to first image
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1); // Adjust index
    }
  };
  
  const handleSetMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price) {
      setError('Please fill in all required fields (name, description, price)');
      return;
    }
    
    if (imageFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Upload images first
      const uploadedImages = await uploadImages(imageFiles);
      
      // Add item to Firestore with image URLs and main image index
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        sold: false,
        images: uploadedImages,
        mainImageIndex: mainImageIndex,
        createdAt: new Date(),
      };
      
      await addItem(itemData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        dimensions: '',
        condition: '',
      });
      setImageFiles([]);
      setImageFilePreviews([]);
      setMainImageIndex(0);
      
      setSuccess(true);
      
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agregar Nuevo Artículo</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Regresar al Panel
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Item agregado exitosamente! Redirigiendo al panel...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="price" className="block mb-1 font-medium">
              Precio ($) *
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block mb-1 font-medium">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="dimensions" className="block mb-1 font-medium">
              Dimensiones
            </label>
            <input
              type="text"
              name="dimensions"
              id="dimensions"
              value={formData.dimensions}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., 24in x 36in x 48in"
            />
          </div>

          <div>
            <label htmlFor="condition" className="block mb-1 font-medium">
              Condición
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccionar condición</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Como Nuevo">Como Nuevo</option>
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Deficiente">Deficiente</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Imágenes *
            </label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            <p className="mt-1 text-sm text-gray-500">
              Por favor, sube al menos una imagen del artículo. La primera imagen o la seleccionada como principal será la que se muestre primero.
            </p>
            
            {/* Image previews with main image selection */}
            {imageFilePreviews.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Imágenes seleccionadas:</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Haz clic en &quot;Establecer como principal&quot; para elegir la imagen que se mostrará primero.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imageFilePreviews.map((preview, index) => (
                    <div 
                      key={index} 
                      className={`relative border rounded p-1 ${mainImageIndex === index ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'}`}
                    >
                      <div className="relative h-32 w-full">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="mt-2 flex flex-col space-y-1">
                        {mainImageIndex === index ? (
                          <span className="text-xs text-indigo-600 font-medium">Imagen Principal</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(index)}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Establecer como principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding Item...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}

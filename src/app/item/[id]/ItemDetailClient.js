'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getItemById } from '../../../firebase/firestore';

export default function ItemDetailClient({ id }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const itemData = await getItemById(id);
        if (!itemData) {
          setError('Item not found');
        } else {
          setItem(itemData);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const nextImage = () => {
    if (item?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (item?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md shadow-sm">
          {error || 'Item not found'}
        </div>
        <div className="mt-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500">
            &larr; Regresar a todos los artículos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image gallery */}
        <div className="flex flex-col">
          <div className="relative">
            <div className="aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden">
              {item.images && item.images.length > 0 ? (
                <div className="relative h-96 w-full">
                  <Image
                    src={item.images[currentImageIndex]}
                    alt={`${item.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                  {item.sold && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-sm">
                        VENDIDO
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 w-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">No hay imagen disponible</p>
                </div>
              )}
            </div>

            {/* Image navigation buttons */}
            {item.images && item.images.length > 1 && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                  onClick={prevImage}
                  className="bg-white rounded-full p-2 shadow-md hover:bg-indigo-50 focus:outline-none transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white rounded-full p-2 shadow-md hover:bg-indigo-50 focus:outline-none transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Thumbnail gallery */}
          {item.images && item.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-16 w-full rounded-md overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${item.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item details */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <div className="flex justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">{item.name}</h1>
            <p className="text-3xl font-bold text-indigo-600">${item.price}</p>
          </div>

          {item.sold && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 shadow-sm">
              Este artículo ha sido vendido
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-800">Descripción</h2>
            <div className="mt-4 prose prose-indigo prose-lg text-gray-600">
              <p>{item.description}</p>
            </div>
          </div>

          {item.dimensions && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800">Dimensiones</h2>
            <p className="mt-2 text-gray-600">{item.dimensions}</p>
            </div>
          )}

          {item.condition && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-800">Condición</h2>
            <p className="mt-2 text-gray-600">{item.condition}</p>
            </div>
          )}

          <div className="mt-10">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              &larr; Regresar a todos los artículos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

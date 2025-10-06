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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const itemData = await getItemById(id);
        if (!itemData) {
          setError('Item not found');
        } else {
          setItem(itemData);
          
          // Set the current image index to the main image if available
          if (itemData.images && itemData.images.length > 0) {
            // If mainImageIndex exists and is valid, use it; otherwise default to 0
            if (itemData.mainImageIndex !== undefined && 
                itemData.mainImageIndex >= 0 && 
                itemData.mainImageIndex < itemData.images.length) {
              setCurrentImageIndex(itemData.mainImageIndex);
            }
          }
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
  
  const openModal = () => {
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'auto';
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
                    className="object-cover object-center cursor-pointer"
                    onClick={openModal}
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

          {item.notes && (
            <div className="mt-6">
              <p className="font-bold text-gray-800">{item.notes}</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              &larr; Regresar a todos los artículos
            </Link>
            
            <a 
              href={`https://wa.me/50372457183?text=${encodeURIComponent(`Estoy interesado en ${item.name} por valor de $${item.price}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5 mr-2"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M12 3.8C16.53 3.8 20.2 7.47 20.2 12C20.2 16.53 16.53 20.2 12 20.2C10.34 20.2 8.81 19.7 7.54 18.82L4.22 19.72L5.14 16.45C4.21 15.15 3.7 13.57 3.7 12C3.7 7.47 7.47 3.8 12 3.8M8.85 7.5C8.67 7.5 8.37 7.57 8.12 7.85C7.87 8.12 7.25 8.7 7.25 9.93C7.25 11.15 8.12 12.33 8.24 12.5C8.37 12.68 9.95 15.15 12.38 16.13C14.35 16.95 14.8 16.77 15.28 16.73C15.77 16.7 16.77 16.15 17 15.57C17.22 14.98 17.22 14.5 17.15 14.38C17.08 14.27 16.9 14.2 16.62 14.07C16.35 13.93 15.12 13.35 14.88 13.27C14.63 13.18 14.45 13.13 14.28 13.42C14.1 13.7 13.65 14.2 13.5 14.38C13.34 14.57 13.18 14.6 12.9 14.47C12.62 14.33 11.8 14.07 10.85 13.2C10.1 12.53 9.6 11.7 9.43 11.42C9.27 11.13 9.41 11 9.55 10.87C9.67 10.75 9.82 10.57 9.95 10.42C10.08 10.27 10.12 10.15 10.22 9.98C10.32 9.82 10.27 9.67 10.22 9.53C10.17 9.4 9.67 8.17 9.43 7.6C9.22 7.05 9 7.03 8.83 7.03C8.67 7.03 8.5 7 8.33 7H8.85Z" />
              </svg>
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      {/* Full-size image modal */}
      {isModalOpen && item.images && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={closeModal}>
          <div className="relative max-w-screen-xl max-h-screen p-4">
            <button 
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div 
              className="relative w-full h-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            >
              <Image
                src={item.images[currentImageIndex]}
                alt={`${item.name} - Full size image`}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllItems } from '../../firebase/firestore';

export default function RopaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSold, setShowSold] = useState(false);
  const [showReserved, setShowReserved] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Get only clothing items (Ropa type)
        const allItems = await getAllItems(true, 'Ropa', showReserved); // Get all clothing items including sold ones, and optionally reserved ones
        setItems(allItems);
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching items:', error);
        // More user-friendly error message
        setError('We\'re having trouble connecting to our database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [showReserved]);

  // Add a more robust way to refresh data when navigating back to this page
  useEffect(() => {
    // This will run when the component mounts
    let isActive = true;
    
    const refreshData = () => {
      // Only fetch if component is still mounted
      if (!isActive) return;
      
      // Use a timeout to prevent immediate requests that might be aborted
      const timer = setTimeout(async () => {
        try {
          if (!isActive) return;
          const allItems = await getAllItems(true, 'Ropa', showReserved);
          if (isActive) {
            setItems(allItems);
          }
        } catch (error) {
          console.error('Error refreshing items:', error);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    };

    // Set up a visibility change listener instead of focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up the event listener when the component unmounts
    return () => {
      isActive = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Filter items based on sold and reserved status
  const filteredItems = items.filter(item => {
    // If showSold is false, filter out sold items
    if (!showSold && item.sold) {
      return false;
    }
    
    // If showReserved is false, filter out reserved items
    if (!showReserved && item.reserved && !item.sold) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl md:text-6xl">
          <span className="block">Venta de Ropa</span>
          <span className="block text-indigo-600">Para Tu Estilo</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Explora nuestra colección de ropa de calidad. Cada prenda es única y cuidadosamente seleccionada.
        </p>
      </div>

      <div className="flex justify-end mb-6 space-x-6">
        <div className="flex items-center">
          <label htmlFor="show-sold" className="mr-2 text-sm text-gray-600 cursor-pointer">
            Mostrar artículos vendidos
          </label>
          <div 
            className="relative inline-flex items-center cursor-pointer"
            onClick={() => setShowSold(!showSold)}
          >
            <input
              type="checkbox"
              id="show-sold"
              checked={showSold}
              onChange={() => setShowSold(!showSold)}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 bg-gray-300 peer-checked:bg-indigo-500 rounded-full transition-colors cursor-pointer"
            ></div>
            <span 
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 cursor-pointer"
            ></span>
            <span id="show-sold-label" className="sr-only">
              {showSold ? 'Hide sold items' : 'Show sold items'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center">
          <label htmlFor="show-reserved" className="mr-2 text-sm text-gray-600 cursor-pointer">
            Mostrar artículos reservados
          </label>
          <div 
            className="relative inline-flex items-center cursor-pointer"
            onClick={() => setShowReserved(!showReserved)}
          >
            <input
              type="checkbox"
              id="show-reserved"
              checked={showReserved}
              onChange={() => setShowReserved(!showReserved)}
              className="sr-only peer"
            />
            <div 
              className="w-11 h-6 bg-gray-300 peer-checked:bg-indigo-500 rounded-full transition-colors cursor-pointer"
            ></div>
            <span 
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 cursor-pointer"
            ></span>
            <span id="show-reserved-label" className="sr-only">
              {showReserved ? 'Hide reserved items' : 'Show reserved items'}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md shadow-sm">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-indigo-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-800">No se encontró ropa</h3>
          <p className="mt-1 text-sm text-gray-600">
            {items.length === 0 
              ? "Nuestro inventario está actualmente vacío. Por favor, vuelve más tarde para ver nuevas llegadas." 
              : showSold 
                ? "No hay artículos disponibles en nuestro inventario." 
                : "Todos los artículos han sido vendidos. Vuelve más tarde para ver nuevas llegadas."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredItems.map((item) => (
            <Link 
              key={item.id} 
              href={`/item/${item.id}`}
              className="group"
            >
              <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-200">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={
                      // Use main image if available, otherwise use first image
                      item.mainImageIndex !== undefined && 
                      item.mainImageIndex >= 0 && 
                      item.mainImageIndex < item.images.length
                        ? item.images[item.mainImageIndex]
                        : item.images[0]
                    }
                    alt={item.name}
                    fill
                    priority
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <p className="text-gray-500">No hay imagen</p>
                  </div>
                )}
                {item.sold && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      VENDIDO
                    </span>
                  </div>
                )}
                {!item.sold && item.reserved && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                      RESERVADO
                    </span>
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
              <p className="mt-1 text-lg font-medium text-indigo-600">${item.price}</p>
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

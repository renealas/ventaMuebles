'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllItems } from '../firebase/firestore';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const allItems = await getAllItems(true); // Get all items including sold ones
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
  }, []);

  // Filter items based on sold status
  const filteredItems = showSold 
    ? items 
    : items.filter(item => !item.sold);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl md:text-6xl">
          <span className="block">Venta de Muebles</span>
          <span className="block text-indigo-600">Para Tu Hogar</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Explora nuestra colección de muebles de calidad. Cada pieza es única y cuidadosamente seleccionada.
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <div className="flex items-center">
          <label htmlFor="show-sold" className="mr-2 text-sm text-gray-600">
            Mostrar artículos vendidos
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="show-sold"
              checked={showSold}
              onChange={() => setShowSold(!showSold)}
              className="sr-only"
            />
            <div className={`block h-6 rounded-full w-10 ${showSold ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-0.5 top-0.5 bg-white border-2 ${showSold ? 'border-indigo-500' : 'border-gray-300'} w-5 h-5 rounded-full transition-transform transform ${showSold ? 'translate-x-4' : ''}`}></div>
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
          <h3 className="mt-2 text-sm font-medium text-gray-800">No se encontraron muebles</h3>
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
                    src={item.images[0]}
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

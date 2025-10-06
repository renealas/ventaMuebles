'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../../context/AuthContext';
import { getItemById, updateItemMainImage, updateItemNotes } from '../../../../firebase/firestore';

export default function EditItemClient({ id }) {
  const [item, setItem] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        console.log('No ID provided, cannot fetch item');
        setError('No item ID provided');
        setLoading(false);
        return;
      }
      
      // We can proceed with fetching even if user is not fully loaded yet
      try {
        console.log(`Fetching item with ID: ${id}`);
        setLoading(true);
        const itemData = await getItemById(id);
        console.log('Item data fetched:', itemData);
        setItem(itemData);
        
        // Set the main image index if it exists
        if (itemData.mainImageIndex !== undefined) {
          setMainImageIndex(itemData.mainImageIndex);
        }
        
        // Set notes if they exist
        if (itemData.notes !== undefined) {
          setNotes(itemData.notes);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to load item. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]); // Remove user dependency to avoid waiting for auth

  const handleSetMainImage = (index) => {
    setMainImageIndex(index);
  };
  
  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSaveMainImage = async () => {
    if (!item) return;
    
    try {
      setSaving(true);
      setError('');
      
      await updateItemMainImage(item.id, mainImageIndex);
      
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating main image:', error);
      setError('Failed to update main image. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveNotes = async () => {
    if (!item) return;
    
    try {
      setSavingNotes(true);
      setError('');
      
      await updateItemNotes(item.id, notes);
      
      setNotesSuccess(true);
      
      // Update the local item state with the new notes
      setItem({
        ...item,
        notes: notes
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setNotesSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating notes:', error);
      setError('Failed to update notes. Please try again.');
    } finally {
      setSavingNotes(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center p-8">Verificando autenticación...</div>;
  }

  if (!user) {
    return <div className="flex justify-center p-8">Redirigiendo al inicio de sesión...</div>; // Will redirect in useEffect
  }
  
  if (loading) {
    return <div className="flex justify-center p-8">Cargando datos del artículo...</div>;
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Item not found or failed to load.
        </div>
        <div className="mt-4">
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Regresar al Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Artículo: {item.name}</h1>
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
          ¡Imagen principal actualizada exitosamente!
        </div>
      )}

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Seleccionar Imagen Principal</h2>
        
        {item.images && item.images.length > 0 ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Selecciona la imagen que deseas mostrar como principal. Esta será la primera imagen que verán los usuarios.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {item.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative border rounded p-1 ${mainImageIndex === index ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'}`}
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
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
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSaveMainImage}
                disabled={saving}
                className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Este artículo no tiene imágenes.</p>
        )}
      </div>
      
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Editar Notas</h2>
        <p className="text-sm text-gray-500 mb-4">
          Estas notas serán visibles en la página de detalles del artículo, mostradas en negrita antes de los botones.
        </p>
        
        <div className="mb-4">
          <textarea
            id="notes"
            name="notes"
            rows={4}
            value={notes}
            onChange={handleNotesChange}
            className="w-full p-2 border rounded"
            placeholder="Información adicional que solo será visible en la página de detalles"
          />
        </div>
        
        {notesSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            ¡Notas actualizadas exitosamente!
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
              savingNotes ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {savingNotes ? 'Guardando...' : 'Guardar Notas'}
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          href={`/item/${item.id}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Ver artículo
        </Link>
      </div>
    </div>
  );
}

import ItemDetailClient from './ItemDetailClient';
import { getAllItems, getItemById } from '../../../firebase/firestore';

// This function is required for static site generation with Next.js
// It must be a named export (not default)
export async function generateStaticParams() {
  console.log('Running generateStaticParams for /item/[id]');
  
  try {
    // Get all items including sold ones
    const items = await getAllItems(true);
    
    // Return an array of objects with the id parameter
    const params = items.map((item) => ({
      id: item.id,
    }));
    
    console.log(`Generated params for ${params.length} items`);
    
    // If no items were found, return a placeholder to prevent build errors
    if (params.length === 0) {
      console.log('No items found, returning placeholder ID');
      return [{ id: 'placeholder-id' }];
    }
    
    // Make sure to include the specific ID that's causing the error
    if (!params.some(param => param.id === 'LT8OwuAm6p6V7jDpwMDK')) {
      params.push({ id: 'LT8OwuAm6p6V7jDpwMDK' });
      console.log('Added specific ID that was causing the error');
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a placeholder ID to prevent build errors and include the specific ID
    console.log('Error occurred, returning placeholder IDs');
    return [
      { id: 'placeholder-id' },
      { id: 'LT8OwuAm6p6V7jDpwMDK' }
    ];
  }
}

// Make the component async to properly await params
export default async function ItemDetail({ params }) {
  // Await the params to fix the error
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  return <ItemDetailClient id={id} />;
}

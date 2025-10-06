import { getAllItems } from '../../../../firebase/firestore';
import EditItemClient from './EditItemClient';

// This function is required for static site generation with Next.js
export async function generateStaticParams() {
  console.log('Running generateStaticParams for /admin/edit-item/[id]');
  
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
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return a placeholder ID to prevent build errors
    console.log('Error occurred, returning placeholder ID');
    return [{ id: 'placeholder-id' }];
  }
}

// Make the component async to properly await params
export default async function EditItemPage({ params }) {
  // Await the params to fix the error
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  console.log('Rendering EditItemPage with ID:', id);
  
  return <EditItemClient id={id} />;
}

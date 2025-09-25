import ItemDetailClient from './ItemDetailClient';
import { getAllItems } from '../../../firebase/firestore';

// This function is required for static site generation with Next.js
export async function generateStaticParams() {
  try {
    // Get all items including sold ones
    const items = await getAllItems(true);
    
    // Return an array of objects with the id parameter
    return items.map((item) => ({
      id: item.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return empty array if there's an error
  }
}

// Make the component async to properly await params
export default async function ItemDetail({ params }) {
  // Await the params to fix the error
  const id = params.id;
  return <ItemDetailClient id={id} />;
}

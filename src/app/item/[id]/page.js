import ItemDetailClient from './ItemDetailClient';

// Using dynamic rendering instead of static generation
export default function ItemDetail({ params }) {
  const id = params.id;
  return <ItemDetailClient id={id} />;
}

// Add dynamic metadata to ensure this page is dynamically rendered
export const dynamic = 'force-dynamic';

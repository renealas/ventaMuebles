import { db } from './config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Collection references
const itemsCollection = collection(db, 'items');

// Add a new item
export const addItem = async (itemData) => {
  try {
    const docRef = await addDoc(itemsCollection, {
      ...itemData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding item:', error);
    throw error;
  }
};

// Get all items
export const getAllItems = async (includeSold = false) => {
  try {
    let q;
    if (includeSold) {
      // Get all items including sold ones
      q = query(itemsCollection, orderBy('createdAt', 'desc'));
    } else {
      // Get only unsold items
      q = query(
        itemsCollection, 
        where('sold', '==', false),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    
    // If no documents exist yet, return an empty array
    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
};

// Get available (unsold) items
export const getAvailableItems = async () => {
  try {
    const q = query(
      itemsCollection, 
      where('sold', '==', false),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    // If no documents exist yet, return an empty array
    if (querySnapshot.empty) {
      return [];
    }
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error getting available items:', error);
    throw error;
  }
};

// Get a single item by ID
export const getItemById = async (itemId) => {
  try {
    const docRef = doc(db, 'items', itemId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      };
    } else {
      throw new Error('Item not found');
    }
  } catch (error) {
    console.error('Error getting item:', error);
    throw error;
  }
};

// Update an item's sold status
export const updateItemSoldStatus = async (itemId, isSold) => {
  try {
    const docRef = doc(db, 'items', itemId);
    await updateDoc(docRef, {
      sold: isSold,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating item sold status:', error);
    throw error;
  }
};

// Delete an item
export const deleteItem = async (itemId) => {
  try {
    const docRef = doc(db, 'items', itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

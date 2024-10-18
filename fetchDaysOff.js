
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Import Firestore

// Funkcja pobierająca dane o dniach wolnych z Firestore
export const fetchDaysOff = async () => {
  try {
    const daysOffCollection = collection(db, 'daysOff');
    const daysOffSnapshot = await getDocs(daysOffCollection);
    const daysOffList = daysOffSnapshot.docs.map(doc => doc.data());
    return daysOffList;
  } catch (error) {
    console.error('Błąd przy pobieraniu danych:', error);
    return [];
  }
};

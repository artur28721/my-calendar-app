// saveDaysOff.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase'; // Importujemy bazę danych Firestore
import { Alert } from 'react-native';

export const saveDaysOffToFirestore = async (selectedDays, user) => {
  try {
    // Zapisujemy dokument w Firestore w kolekcji "daysOff" z ID użytkownika
    await setDoc(doc(db, 'daysOff', user.uid), {
      days: selectedDays, // Zaznaczone dni
      timestamp: new Date(), // Aktualna data i czas
      userId: user.uid // ID użytkownika (UID)
    });
    Alert.alert('Prośba o wolne zapisana!'); // Informacja, że zapisano
  } catch (error) {
    Alert.alert('Błąd zapisu', error.message); // Obsługa błędu
  }
};
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, View, Alert, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar } from 'react-native-calendars'; // Import kalendarza
import { auth } from './firebase'; // Import autoryzacji Firebase
import { saveDaysOffToFirestore } from './saveDaysOff'; // Importujemy funkcję zapisu do Firestore
import { fetchDaysOff } from './fetchDaysOff'; // Import funkcji do pobierania danych
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; // Funkcje autoryzacji

// Tworzymy dolną nawigację
const Tab = createBottomTabNavigator();

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Zalogowany użytkownik
  const [selectedDays, setSelectedDays] = useState({}); // Zaznaczone dni wolne
  const [daysOffList, setDaysOffList] = useState([]); // Lista próśb o wolne

  // Sprawdzanie stanu autoryzacji po uruchomieniu aplikacji
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Użytkownik zalogowany
        // Pobierz dane o dniach wolnych po zalogowaniu
        const getData = async () => {
          const data = await fetchDaysOff(); // Pobieramy prośby o wolne
          setDaysOffList(data);
        };
        getData();
      } else {
        setUser(null); // Użytkownik nie zalogowany
      }
    });
    return () => unsubscribe(); // Oczyszczanie przy odłączeniu komponentu
  }, []);

  // Logowanie użytkownika
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log('Zalogowano:', userCredential.user);
      })
      .catch((error) => {
        Alert.alert('Błąd logowania:', error.message);
      });
  };

  // Rejestracja użytkownika
  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        console.log('Zarejestrowano:', userCredential.user);
      })
      .catch((error) => {
        Alert.alert('Błąd rejestracji:', error.message);
      });
  };

  // Ekran z kalendarzem dla pracowników
  function CalendarScreen() {
    const handleDayPress = (day) => {
      const selectedDate = day.dateString;
      setSelectedDays((prevState) => ({
        ...prevState,
        [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' }
      }));
    };

    const submitRequest = () => {
      if (Object.keys(selectedDays).length === 0) {
        Alert.alert('Nie wybrano żadnych dni.');
      } else if (auth.currentUser) {
        saveDaysOffToFirestore(selectedDays, auth.currentUser);
      } else {
        Alert.alert('Musisz być zalogowany, aby złożyć prośbę.');
        console.log('Użytkownik nie jest zalogowany:', auth.currentUser);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Wybierz dni wolne</Text>
        <Calendar
          markedDates={selectedDays}
          onDayPress={handleDayPress}
        />
        <Button title="Złóż prośbę o wolne" onPress={submitRequest} />
      </SafeAreaView>
    );
  }

  // Ekran administratora
  function AdminScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Prośby o wolne pracowników</Text>
        <FlatList
          data={daysOffList}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.title}>Pracownik: {item.userId}</Text>
              <Text>Dni wolne: {Object.keys(item.days).join(', ')}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, pokazujemy ekran logowania/rejestracji
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Zaloguj się</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Hasło"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Zaloguj się" onPress={handleLogin} />
        <Button title="Zarejestruj się" onPress={handleRegister} />
      </SafeAreaView>
    );
  }

  // Zalogowany użytkownik - wyświetlamy zakładki
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Kalendarz" component={CalendarScreen} />
        <Tab.Screen name="Administrator" component={AdminScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

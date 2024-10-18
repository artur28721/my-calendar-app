
const admin = require('firebase-admin');
const fs = require('fs'); // Moduł do obsługi plików

// Inicjalizacja Firebase Admin SDK z kluczem serwisowym
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Przykładowa lista użytkowników do wygenerowania
const users = [
  { email: 'pracownik001@twojafirma.com', password: generatePassword() },
  { email: 'pracownik002@twojafirma.com', password: generatePassword() },
  { email: 'pracownik003@twojafirma.com', password: generatePassword() },
  // Możesz dodać więcej użytkowników tutaj
];

// Funkcja generująca losowe hasła
function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Tworzenie kont użytkowników i zapisywanie wyników do pliku
const result = [];

users.forEach((user) => {
  admin.auth().createUser({
    email: user.email,
    password: user.password,
  })
  .then((userRecord) => {
    console.log('Użytkownik utworzony:', userRecord.uid);
    result.push({ email: user.email, password: user.password, uid: userRecord.uid });
    // Zapisujemy wynik do pliku, gdy wszyscy użytkownicy są dodani
    if (result.length === users.length) {
      fs.writeFileSync('generatedUsers.csv', formatToCSV(result));
      console.log('Dane użytkowników zapisane do pliku generatedUsers.csv');
    }
  })
  .catch((error) => {
    console.error('Błąd przy tworzeniu użytkownika:', error);
  });
});

// Funkcja formatująca dane do formatu CSV
function formatToCSV(data) {
  const header = 'Email,Hasło,UID\n';
  const rows = data.map((row) => `${row.email},${row.password},${row.uid}`).join('\n');
  return header + rows;
}

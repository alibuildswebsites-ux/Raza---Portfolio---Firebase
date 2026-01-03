
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0WO4C6Jzu4Vf70AjFXdJaFaA-hVPXvHI",
  authDomain: "raza-portfolio-e6592.firebaseapp.com",
  projectId: "raza-portfolio-e6592",
  storageBucket: "raza-portfolio-e6592.firebasestorage.app",
  messagingSenderId: "134003417614",
  appId: "1:134003417614:web:7c277d084e6b17a53d525f",
  measurementId: "G-ZT33K08CNZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

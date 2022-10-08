// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: 'AIzaSyDa0P5ZpQ-Km61VYDoqLP1LsD1H-A0vSi8',
    authDomain: 'ma-library-d9752.firebaseapp.com',
    projectId: 'ma-library-d9752',
    storageBucket: 'ma-library-d9752.appspot.com',
    messagingSenderId: '985394644850',
    appId: '1:985394644850:web:e4842350ac1382d31a7feb',
    measurementId: 'G-3K8PDQXJNC',
};

// Initialize firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default { db };

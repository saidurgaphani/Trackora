import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCF8zY53NoGlhW9kRydFFHf1vhsvIGsKu8",
    authDomain: "spin-and-earn-ec06f.firebaseapp.com",
    databaseURL: "https://spin-and-earn-ec06f.firebaseio.com",
    projectId: "spin-and-earn-ec06f",
    storageBucket: "spin-and-earn-ec06f.firebasestorage.app",
    messagingSenderId: "680178502929",
    appId: "1:680178502929:web:cf8a4f182bd2d0031190b0",
    measurementId: "G-7X2EW4Z2CK"
};

const app = initializeApp(firebaseConfig);

export default app;

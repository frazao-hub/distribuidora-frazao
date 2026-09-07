import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD8SnMWXagUVz4uVM87bc2dAakZyGGW3nM",
  authDomain: "distribuidora-frazao.firebaseapp.com",
  projectId: "distribuidora-frazao",
  storageBucket: "distribuidora-frazao.firebasestorage.app",
  messagingSenderId: "642540059204",
  appId: "1:642540059204:web:c113fa6966fd97fc20da11"
};

export const app = initializeApp(firebaseConfig);

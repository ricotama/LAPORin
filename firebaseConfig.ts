// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAM0I05mD5GkUsDNevaIGI_PtRQQ2lF2vk",
  authDomain: "laporin-14518.firebaseapp.com",
  databaseURL: "https://laporin-14518-default-rtdb.firebaseio.com",
  projectId: "laporin-14518",
  storageBucket: "laporin-14518.appspot.com",
  messagingSenderId: "155934136498",
  appId: "1:155934136498:web:8b9dc07bb045aedb7c11ab"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

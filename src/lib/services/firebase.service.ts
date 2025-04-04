import admin from 'firebase-admin';
import { firebaseConfig } from '../config/constants';

// Inicializa o Firebase Admin apenas se ainda não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(firebaseConfig.key!)),
  });
}

export const db = admin.firestore(); 
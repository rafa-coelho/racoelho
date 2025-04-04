import admin from 'firebase-admin';
import { firebaseConfig } from '../config/constants';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig.key),
  });
}

export const db = admin.firestore();



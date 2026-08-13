import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// Твоя конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzMpndOektgWIXy5zsIT6gD0T_zXIpQ98",
  authDomain: "date-invite-6350c.firebaseapp.com",
  projectId: "date-invite-6350c",
  storageBucket: "date-invite-6350c.firebasestorage.app",
  messagingSenderId: "141052072793",
  appId: "1:141052072793:web:1cbbfd0f0f55ae822db248"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Сохранить приглашение
export const saveInvite = async (inviteId, data) => {
  try {
    await setDoc(doc(db, 'invites', inviteId), data);
    console.log('✅ Приглашение сохранено:', inviteId);
    return true;
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error);
    return false;
  }
};

// Получить приглашение
export const getInvite = async (inviteId) => {
  try {
    const docSnap = await getDoc(doc(db, 'invites', inviteId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('❌ Ошибка получения:', error);
    return null;
  }
};

// Слушать изменения (реальное время)
export const listenToInvite = (inviteId, callback) => {
  return onSnapshot(doc(db, 'invites', inviteId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.error('❌ Ошибка слушателя:', error);
  });
};

// Обновить приглашение
export const updateInvite = async (inviteId, data) => {
  try {
    await updateDoc(doc(db, 'invites', inviteId), data);
    console.log('✅ Приглашение обновлено');
    return true;
  } catch (error) {
    console.error('❌ Ошибка обновления:', error);
    return false;
  }
};
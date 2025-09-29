import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  Firestore,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ServicioChatService {
  private app = initializeApp(firebaseConfig);
  private db: Firestore = getFirestore(this.app);

  async sendMessage(conversationId: string, text: string, senderName: string, senderRole: string): Promise<void> {
    const messagesRef = collection(this.db, `conversations/${conversationId}/messages`);
    await addDoc(messagesRef, {
      text,
      senderName, // Almacenamos el nombre del remitente
      senderRole,  // Guardamos el rol del usuario
      timestamp: new Date()
    });
  }

  getMessagesRealtime(conversationId: string, callback: (messages: any[]) => void): void {
    const messagesRef = collection(this.db, `conversations/${conversationId}/messages`);
    const q = query(messagesRef, orderBy('timestamp'));

    onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }

  async getConversations(userId: string): Promise<any[]> {
    const convRef = collection(this.db, 'conversations');
    const q = query(convRef, where('participants', 'array-contains', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  async createConversation(participants: string[]): Promise<string> {
    const convRef = collection(this.db, 'conversations');
    const docRef = await addDoc(convRef, {
      participants,
      createdAt: new Date()
    });
    return docRef.id;
  }
}


const firebaseConfig = {
  apiKey: "AIzaSyDkPpRlEopZBiUoFt8GKoD6KLWkws4HqkQ",
  authDomain: "comercio-7a648.firebaseapp.com",
  projectId: "comercio-7a648",
  storageBucket: "comercio-7a648.firebasestorage.app",
  messagingSenderId: "246230784294",
  appId: "1:246230784294:web:c288085c03729ddca849e7",
  measurementId: "G-4VYBQ02Y6L"
};
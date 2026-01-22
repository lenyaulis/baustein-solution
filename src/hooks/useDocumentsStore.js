// src/hooks/useDocumentsStore.js
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/client';

const COLLECTION_NAME = 'outgoingDocuments';

export function useDocumentsStore() {
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [errorDocuments, setErrorDocuments] = useState(null);

  useEffect(() => {
    const colRef = collection(db, COLLECTION_NAME);
    const qRef = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      qRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            createdAt: data.createdAt || null,
          };
        });
        setDocuments(list);
        setLoadingDocuments(false);
        setErrorDocuments(null);
      },
      (err) => {
        console.error('Error loading outgoing documents:', err);
        setErrorDocuments('Ошибка загрузки документов на выдачу');
        setLoadingDocuments(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addDocument = useCallback(async (name) => {
    if (!name) return;
    const colRef = collection(db, COLLECTION_NAME);
    await addDoc(colRef, {
      name: name.trim(),
      createdAt: serverTimestamp(),
    });
  }, []);

  const removeDocument = useCallback(async (id) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }, []);

  return {
    documents,
    loadingDocuments,
    errorDocuments,
    addDocument,
    removeDocument,
  };
}

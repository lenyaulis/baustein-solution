// src/hooks/useRemoteRequests.js
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,      // 👈 добавить
} from 'firebase/firestore';
import { db } from '../firebase/client';

const COLLECTION_NAME = 'requests_v1';

export function useRemoteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const snap = await getDocs(collection(db, COLLECTION_NAME));
        if (isCancelled) return;

        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setRequests(list);
      } catch (e) {
        console.error(e);
        if (!isCancelled) {
          setError('Не удалось загрузить заявки из облака');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, []);

  async function addRequest(request) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), request);
      const withId = { ...request, id: docRef.id };
      setRequests((prev) => [...prev, withId]);
      return withId;
    } catch (e) {
      console.error(e);
      throw new Error('Не удалось сохранить заявку в облако');
    }
  }

  async function removeRequest(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      throw new Error('Не удалось удалить заявку из облака');
    }
  }

  // 👇 НОВОЕ: обновление документа в Firestore
  async function updateRequest(id, patch) {
    try {
      await updateDoc(doc(db, COLLECTION_NAME, id), patch);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    } catch (e) {
      console.error(e);
      throw new Error('Не удалось обновить заявку в облаке');
    }
  }

  return {
    requests,
    loading,
    error,
    addRequest,
    removeRequest,
    updateRequest,  // 👈 вернуть наружу
    setRequests,
  };
}

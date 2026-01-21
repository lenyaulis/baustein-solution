// src/hooks/useRemindersStore.js
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/client';

export function useRemindersStore() {
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [errorReminders, setErrorReminders] = useState(null);

  useEffect(() => {
    const colRef = collection(db, 'reminders');

    // Общие напоминания для всех, сортируем по времени напоминания
    const qRef = query(colRef, orderBy('dueAt', 'asc'));

    const unsubscribe = onSnapshot(
      qRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || '',
            comment: data.comment || '',
            dueAt: data.dueAt || null,
            isDone: Boolean(data.isDone),
            createdAt: data.createdAt || null,
          };
        });
        setReminders(list);
        setLoadingReminders(false);
        setErrorReminders(null);
      },
      (err) => {
        console.error('Error loading reminders:', err);
        setErrorReminders('Ошибка загрузки напоминаний');
        setLoadingReminders(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Добавление нового напоминания
  const addReminder = useCallback(async ({ title, comment, date, time }) => {
    if (!title) return;

    // date: '2026-01-21', time: '14:30'
    let dueAt = null;
    if (date && time) {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const jsDate = new Date(year, month - 1, day, hours, minutes, 0);
      dueAt = Timestamp.fromDate(jsDate);
    }

    const colRef = collection(db, 'reminders');
    await addDoc(colRef, {
      title: title.trim(),
      comment: comment?.trim() || '',
      dueAt: dueAt,
      isDone: false,
      createdAt: serverTimestamp(),
    });
  }, []);

  // Переключение галочки "выполнено"
  const toggleReminderDone = useCallback(async (id, currentValue) => {
    const docRef = doc(db, 'reminders', id);
    await updateDoc(docRef, {
      isDone: !currentValue,
    });
  }, []);

  // Сколько активных напоминаний просрочено или уже "на сейчас"
  const activeRemindersCount = reminders.filter((r) => {
    if (r.isDone !== false) return false;
    if (!r.dueAt) return false;
    const now = new Date();
    const due = r.dueAt.toDate ? r.dueAt.toDate() : new Date(r.dueAt);
    return due <= now; // всё, что уже пора показать
  }).length;

  return {
    reminders,
    loadingReminders,
    errorReminders,
    addReminder,
    toggleReminderDone,
    activeRemindersCount,
  };
}

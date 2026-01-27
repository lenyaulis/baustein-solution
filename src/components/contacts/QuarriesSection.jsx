// src/components/contacts/QuarriesSection.jsx
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase/client';

export default function QuarriesSection() {
  const [quarries, setQuarries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editContact, setEditContact] = useState(null); // { quarryId, index, name, phones }
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(true);

  // загрузка карьеров
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, 'quarries'));
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setQuarries(items);
      } catch (e) {
        console.error(e);
        alert('Не удалось загрузить карьеры');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startEditContact = (quarryId, contactIndex) => {
    const quarry = quarries.find((q) => q.id === quarryId);
    if (!quarry) return;
    const contact = quarry.contacts?.[contactIndex];
    if (!contact) return;

    setEditContact({
      quarryId,
      index: contactIndex,
      name: contact.name || '',
      phones: (contact.phones || []).join(', '),
    });
  };

  const cancelEdit = () => {
    setEditContact(null);
  };

  const saveContact = async () => {
    if (!editContact) return;
    const { quarryId, index, name, phones } = editContact;

    const quarry = quarries.find((q) => q.id === quarryId);
    if (!quarry) return;

    const newContacts = [...(quarry.contacts || [])];
    const phoneList = phones
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    newContacts[index] = {
      ...(newContacts[index] || {}),
      raw: `${name} ${phoneList.join(' ')}`.trim(),
      name: name || null,
      phones: phoneList,
    };

    try {
      setBusy(true);
      await updateDoc(doc(db, 'quarries', quarryId), {
        contacts: newContacts,
      });

      setQuarries((prev) =>
        prev.map((q) =>
          q.id === quarryId ? { ...q, contacts: newContacts } : q,
        ),
      );
      setEditContact(null);
    } catch (e) {
      console.error(e);
      alert('Не удалось сохранить контакт');
    } finally {
      setBusy(false);
    }
  };

  const deleteContact = async (quarryId, contactIndex) => {
    const ok = window.confirm('Удалить этот контакт?');
    if (!ok) return;

    const quarry = quarries.find((q) => q.id === quarryId);
    if (!quarry) return;

    const newContacts = [...(quarry.contacts || [])];
    newContacts.splice(contactIndex, 1);

    try {
      setBusy(true);
      await updateDoc(doc(db, 'quarries', quarryId), {
        contacts: newContacts,
      });

      setQuarries((prev) =>
        prev.map((q) =>
          q.id === quarryId ? { ...q, contacts: newContacts } : q,
        ),
      );
    } catch (e) {
      console.error(e);
      alert('Не удалось удалить контакт');
    } finally {
      setBusy(false);
    }
  };

  const addContact = async (quarryId) => {
    const quarry = quarries.find((q) => q.id === quarryId);
    if (!quarry) return;

    const name = window.prompt('Имя контакта');
    if (!name) return;
    const phonesStr = window.prompt('Телефон(ы) через запятую');
    if (!phonesStr) return;

    const phoneList = phonesStr
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const newContacts = [
      ...(quarry.contacts || []),
      {
        raw: `${name} ${phoneList.join(' ')}`.trim(),
        name,
        phones: phoneList,
      },
    ];

    try {
      setBusy(true);
      await updateDoc(doc(db, 'quarries', quarryId), {
        contacts: newContacts,
      });

      setQuarries((prev) =>
        prev.map((q) =>
          q.id === quarryId ? { ...q, contacts: newContacts } : q,
        ),
      );
    } catch (e) {
      console.error(e);
      alert('Не удалось добавить контакт');
    } finally {
      setBusy(false);
    }
  };

  const deleteQuarry = async (quarryId) => {
    const ok = window.confirm('Удалить этот карьер целиком?');
    if (!ok) return;

    try {
      setBusy(true);
      await deleteDoc(doc(db, 'quarries', quarryId));
      setQuarries((prev) => prev.filter((q) => q.id !== quarryId));
    } catch (e) {
      console.error(e);
      alert('Не удалось удалить карьер');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: 12,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>Карьеры</span>
        <span style={{ fontSize: 12, color: '#6b7280' }}>
          {open ? 'Свернуть ▲' : 'Развернуть ▼'}
        </span>
      </button>

      {open && (
        <>
          {loading ? (
            <div style={{ marginTop: 8, fontSize: 13 }}>
              Загружаем карьеры...
            </div>
          ) : (
            <div
              style={{
                marginTop: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 12,
              }}
            >
              {quarries.map((q) => (
                <div
                  key={q.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: 8,
                    background: '#f9fafb',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 120,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {q.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#6b7280',
                          marginTop: 2,
                        }}
                      >
                        Материалы:{' '}
                        {(q.materials || []).join(', ') || '—'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteQuarry(q.id)}
                      disabled={busy}
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 6,
                        border: '1px solid #ef4444',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        cursor: busy ? 'default' : 'pointer',
                        height: 24,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Удалить
                    </button>
                  </div>

                  <div style={{ marginTop: 4 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        marginBottom: 4,
                      }}
                    >
                      Контакты
                    </div>

                    {(q.contacts || []).length === 0 && (
                      <div
                        style={{
                          fontSize: 12,
                          color: '#9ca3af',
                          marginBottom: 4,
                        }}
                      >
                        Нет контактов
                      </div>
                    )}

                    {(q.contacts || []).map((c, idx) => {
                      const isEditing =
                        editContact &&
                        editContact.quarryId === q.id &&
                        editContact.index === idx;

                      if (isEditing) {
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 4,
                              marginBottom: 8,
                            }}
                          >
                            <input
                              type="text"
                              value={editContact.name}
                              onChange={(e) =>
                                setEditContact((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="Имя"
                              style={{
                                fontSize: 12,
                                padding: 4,
                                borderRadius: 6,
                                border: '1px solid #e5e7eb',
                              }}
                            />
                            <input
                              type="text"
                              value={editContact.phones}
                              onChange={(e) =>
                                setEditContact((prev) => ({
                                  ...prev,
                                  phones: e.target.value,
                                }))
                              }
                              placeholder="Телефон(ы) через запятую"
                              style={{
                                fontSize: 12,
                                padding: 4,
                                borderRadius: 6,
                                border: '1px solid #e5e7eb',
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                gap: 8,
                                marginTop: 4,
                              }}
                            >
                              <button
                                type="button"
                                onClick={saveContact}
                                disabled={busy}
                                style={{
                                  fontSize: 12,
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  border: 'none',
                                  background: '#16a34a',
                                  color: 'white',
                                  cursor: busy ? 'default' : 'pointer',
                                }}
                              >
                                Сохранить
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                disabled={busy}
                                style={{
                                  fontSize: 12,
                                  padding: '4px 8px',
                                  borderRadius: 6,
                                  border: '1px solid #9ca3af',
                                  background: 'white',
                                  color: '#374151',
                                  cursor: busy ? 'default' : 'pointer',
                                }}
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <div style={{ fontSize: 12 }}>
                            <span style={{ fontWeight: 500 }}>
                              {c.name || 'Без имени'}
                            </span>
                            {c.phones && c.phones.length > 0 && (
                              <span> — {c.phones.join(', ')}</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              type="button"
                              onClick={() => startEditContact(q.id, idx)}
                              disabled={busy}
                              style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                borderRadius: 6,
                                border: '1px solid #3b82f6',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                cursor: busy ? 'default' : 'pointer',
                                height: 24,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteContact(q.id, idx)}
                              disabled={busy}
                              style={{
                                fontSize: 10,
                                padding: '2px 6px',
                                borderRadius: 6,
                                border: '1px solid #ef4444',
                                background: '#fee2e2',
                                color: '#b91c1c',
                                cursor: busy ? 'default' : 'pointer',
                                height: 24,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => addContact(q.id)}
                      disabled={busy}
                      style={{
                        marginTop: 4,
                        fontSize: 11,
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px dashed #6b7280',
                        background: 'white',
                        cursor: busy ? 'default' : 'pointer',
                      }}
                    >
                      Добавить контакт
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

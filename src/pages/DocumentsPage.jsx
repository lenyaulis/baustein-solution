// src/pages/DocumentsPage.jsx
import { useState } from 'react';
import { useDocumentsStore } from '../hooks/useDocumentsStore';

function formatDateTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export default function DocumentsPage() {
  const {
    documents,
    loadingDocuments,
    errorDocuments,
    addDocument,
    removeDocument,
  } = useDocumentsStore();

  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addDocument(name);
    setName('');
  };

  return (
    <div className="page-root">
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        Документы на выдачу
      </h1>
      <p
        style={{
          marginTop: 0,
          marginBottom: 16,
          fontSize: 13,
          color: '#6b7280',
          maxWidth: 520,
        }}
      >
        Список компаний, чьи документы готовы к выдаче из офиса. Когда курьер
        забрал документы, удаляем запись из списка.
      </p>

      {/* Форма добавления */}
      <div
        style={{
          marginBottom: 16,
          padding: 16,
          borderRadius: 12,
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: 10,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Добавить компанию
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: 8,
            maxWidth: 520,
          }}
        >
          <div style={{ display: 'grid', gap: 3 }}>
            <label style={{ fontSize: 12, color: '#4b5563' }}>
              Название компании
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: ООО «СтройИнвест»"
              required
            />
          </div>

          <div style={{ marginTop: 2 }}>
            <button
              type="submit"
              className="primary-btn"
              style={{
                paddingInline: 12,
                paddingBlock: 5,
                fontSize: 13,
              }}
            >
              Добавить в список
            </button>
          </div>
        </form>
      </div>

      {/* Список документов */}
      {loadingDocuments && (
        <div
          style={{
            marginBottom: 12,
            padding: '8px 10px',
            borderRadius: 8,
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: 13,
          }}
        >
          Загрузка списка документов...
        </div>
      )}

      {errorDocuments && (
        <div
          style={{
            marginBottom: 12,
            padding: '8px 10px',
            borderRadius: 8,
            background: '#fef2f2',
            color: '#b91c1c',
            fontSize: 13,
          }}
        >
          {errorDocuments}
        </div>
      )}

      <div
        style={{
          marginTop: 8,
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            background: '#f3f4f6',
            fontSize: 13,
            fontWeight: 500,
            color: '#374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Список документов на выдачу</span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Всего: {documents.length}
          </span>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {documents.length === 0 && (
            <li
              style={{
                padding: 12,
                fontSize: 13,
                color: '#6b7280',
              }}
            >
              Сейчас нет документов, ожидающих выдачи.
            </li>
          )}

          {documents.map((d) => (
            <li
              key={d.id}
              style={{
                borderTop: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  background: '#ffffff',
                }}
              >
                <div style={{ fontSize: 13 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {d.name}
                  </div>
                  {d.createdAt && (
                    <div
                      style={{
                        fontSize: 12,
                        color: '#6b7280',
                        marginTop: 2,
                      }}
                    >
                      Добавлено: {formatDateTime(d.createdAt)}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeDocument(d.id)}
                  className="primary-btn"
                  style={{
                    background: '#111827',
                    boxShadow: 'none',
                    marginTop: 0,
                    paddingInline: 10,
                    paddingBlock: 4,
                    fontSize: 12,
                  }}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

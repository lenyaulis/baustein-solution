// src/pages/ImportContactsPage.jsx
import { useState } from 'react';
import readXlsxFile from 'read-excel-file';
import { parseQuarriesAndExecutorsSheet } from '../utils/excelContactsParser';
import { db } from '../firebase/client';
import { collection, addDoc } from 'firebase/firestore';

function ImportContactsPage() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('');
      // читаем конкретный лист "К-ры и исполнители"
      const rows = await readXlsxFile(file, { sheet: 'К-ры и исполнители' });

      const result = parseQuarriesAndExecutorsSheet(rows);

      console.log('parsed contacts', result);
      setPreview(result);
    } catch (err) {
      console.error('Ошибка чтения файла', err);
      alert('Не удалось прочитать Excel. Проверь, что выбрал правильный файл.');
    }
  };

  const handleImportToFirestore = async () => {
    if (!preview) {
      alert('Сначала выбери файл и дождись превью.');
      return;
    }

    const { quarries, carriers, machines } = preview;

    const ok = window.confirm(
      `Загрузить в Firestore:\n` +
        `- карьеры: ${quarries.length} шт.\n` +
        `- перевозчики: ${carriers.length} шт.\n` +
        `- техника: ${machines.length} шт.\n\n` +
        `Продолжить?`,
    );
    if (!ok) return;

    try {
      setLoading(true);
      setImportStatus('Идёт импорт в Firestore...');

      // простейший вариант — просто addDoc для каждой записи
      for (const q of quarries) {
        await addDoc(collection(db, 'quarries'), q);
      }
      for (const c of carriers) {
        await addDoc(collection(db, 'carriers'), c);
      }
      for (const m of machines) {
        await addDoc(collection(db, 'machines'), m);
      }

      setImportStatus('Импорт завершён успешно.');
      alert('Импорт завершён успешно.');
    } catch (err) {
      console.error('Ошибка импорта в Firestore', err);
      setImportStatus('Ошибка импорта в Firestore. См. консоль.');
      alert('Ошибка импорта в Firestore. Открой консоль разработчика.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-root">
      <h1 className="page-title">Импорт контактов из Excel</h1>

      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
        1) Выбери файл <strong>baza-vsia.xlsx</strong>.<br />
        2) Проверь превью ниже.<br />
        3) Нажми кнопку &laquo;Загрузить в Firestore&raquo;.
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ marginBottom: 16 }}
      />

      {preview && (
        <>
          <button
            type="button"
            onClick={handleImportToFirestore}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              fontSize: 14,
              cursor: loading ? 'default' : 'pointer',
              marginBottom: 12,
            }}
          >
            {loading ? 'Импортируем...' : 'Загрузить в Firestore'}
          </button>

          {importStatus && (
            <div style={{ fontSize: 13, marginBottom: 12 }}>{importStatus}</div>
          )}

          <div style={{ marginTop: 8 }}>
            <h2 style={{ fontSize: 14, marginBottom: 8 }}>Превью данных</h2>
            <pre
              style={{
                maxHeight: 400,
                overflow: 'auto',
                fontSize: 11,
                background: '#f9fafb',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #e5e7eb',
              }}
            >
              {JSON.stringify(preview, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default ImportContactsPage;

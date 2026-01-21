// src/pages/RemindersPage.jsx
import { useState } from 'react';
import { useRemindersStore } from '../hooks/useRemindersStore';

function getDefaultDate() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

function getDefaultTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

function formatDateTime(dueAt) {
  if (!dueAt) return '';
  const date = dueAt.toDate ? dueAt.toDate() : new Date(dueAt);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

export default function RemindersPage() {
  const {
    reminders,
    loadingReminders,
    errorReminders,
    addReminder,
    toggleReminderDone,
  } = useRemindersStore();

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [date, setDate] = useState(getDefaultDate());
  const [time, setTime] = useState(getDefaultTime());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addReminder({ title, comment, date, time });
    setTitle('');
    setComment('');
  };

  const now = new Date();

  return (
    <div className="page-root">
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        Напоминания
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
        Общие напоминания для команды. Галочкой помечаем выполненные задачи,
        чтобы они не мешались в списке.
      </p>

      {/* Форма */}
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
          Новое напоминание
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: 8,
            maxWidth: 620,
          }}
        >
          {/* верхняя строка: название + дата/время компактно */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.7fr)',
              gap: 10,
              alignItems: 'end',
            }}
          >
            <div style={{ display: 'grid', gap: 3 }}>
              <label style={{ fontSize: 12, color: '#4b5563' }}>
                Название
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                style={{ fontSize: 13, paddingBlock: 5, paddingInline: 8 }}
                placeholder="Перезвонить клиенту Иванову"
                required
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              <div style={{ display: 'grid', gap: 3 }}>
                <label style={{ fontSize: 12, color: '#4b5563' }}>Дата</label>
                <input
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ fontSize: 13, paddingBlock: 5, paddingInline: 8 }}
                />
              </div>

              <div style={{ display: 'grid', gap: 3 }}>
                <label style={{ fontSize: 12, color: '#4b5563' }}>Время</label>
                <input
                  type="time"
                  className="input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ fontSize: 13, paddingBlock: 5, paddingInline: 8 }}
                />
              </div>
            </div>
          </div>

          {/* комментарий на всю ширину, но плотный */}
          <div style={{ display: 'grid', gap: 3 }}>
            <label style={{ fontSize: 12, color: '#4b5563' }}>Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="textarea"
              rows={3}
              style={{ fontSize: 13, padding: 8 }}
              placeholder="Детали: телефон, сумма, ссылка, контекст заявки."
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
              Добавить напоминание
            </button>
          </div>
        </form>
      </div>

      {/* Список */}
      {loadingReminders && (
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
          Загрузка напоминаний...
        </div>
      )}

      {errorReminders && (
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
          {errorReminders}
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
          <span>Список напоминаний</span>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            Всего: {reminders.length}
          </span>
        </div>

        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {reminders.length === 0 && (
            <li
              style={{
                padding: 12,
                fontSize: 13,
                color: '#6b7280',
              }}
            >
              Напоминаний пока нет.
            </li>
          )}

          {reminders.map((r) => {
            const isDone = r.isDone === true;
            const formatted = formatDateTime(r.dueAt);

            let dueDate = null;
            if (r.dueAt) {
              if (typeof r.dueAt.toDate === 'function') {
                dueDate = r.dueAt.toDate();
              } else {
                dueDate = new Date(r.dueAt);
              }
            }

            const isOverdue =
              !isDone &&
              dueDate &&
              !Number.isNaN(dueDate.getTime()) &&
              dueDate.getTime() < now.getTime();

            return (
              <li
                key={r.id}
                style={{
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'flex-start',
                    gap: 10,
                    padding: '8px 12px',
                    background: isDone ? '#f9fafb' : '#ffffff',
                    opacity: isDone ? 0.6 : 1,
                  }}
                >
                  <div style={{ paddingTop: 2 }}>
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggleReminderDone(r.id, isDone)}
                    />
                  </div>

                  <div style={{ fontSize: 13 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: 4,
                        color: '#111827',
                      }}
                    >
                      {r.title || 'Без названия'}
                    </div>
                    {r.comment && (
                      <div
                        style={{
                          whiteSpace: 'pre-wrap',
                          color: '#4b5563',
                        }}
                      >
                        {r.comment}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: 12,
                      minWidth: 130,
                    }}
                  >
                    <div
                      style={{
                        color: isOverdue ? '#b91c1c' : '#6b7280',
                        fontWeight: isOverdue ? 600 : 400,
                      }}
                    >
                      {formatted || 'Без даты'}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

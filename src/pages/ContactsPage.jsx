// src/pages/ContactsPage.jsx
import { useState } from 'react';
import QuarriesSection from '../components/contacts/QuarriesSection';
import CarriersSection from '../components/contacts/CarriersSection';
import MachinesSection from '../components/contacts/MachinesSection';
import ClientsSection from '../components/contacts/ClientsSection';

function ContactsAccordionItem({ id, title, description, isOpen, onToggle, children }) {
  return (
    <div
      style={{
        borderTop: '1px solid #e5e7eb',
        backgroundColor: isOpen ? '#f9fafb' : '#ffffff',
        transition: 'background-color 0.15s ease',
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        style={{
          width: '100%',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#111827',
              marginBottom: description ? 2 : 0,
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 12, color: '#6b7280' }}>{description}</div>
          )}
        </div>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '999px',
            border: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#4b5563',
            flexShrink: 0,
          }}
        >
          {isOpen ? '–' : '+'}
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '0 14px 10px 14px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function ContactsPage() {
  // по умолчанию ВСЕ закрыты
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="page-root">
      <h1 className="page-title" style={{ marginBottom: 4 }}>
        Контакты
      </h1>
      <p
        style={{
          marginTop: 0,
          marginBottom: 16,
          fontSize: 13,
          color: '#6b7280',
          maxWidth: 620,
        }}
      >
        Справочник по карьерам, перевозчикам, технике и клиентам. Позже данные
        будут подтягиваться автоматически из таблиц.
      </p>

      <div
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          overflow: 'hidden',
        }}
      >
        <ContactsAccordionItem
          id="quarries"
          title="Карьеры"
          description="Места добычи материалов, контакты и координаты."
          isOpen={openId === 'quarries'}
          onToggle={handleToggle}
        >
          <QuarriesSection />
        </ContactsAccordionItem>

        <ContactsAccordionItem
          id="carriers"
          title="Перевозчики"
          description="Водители и компании, которые возят материалы."
          isOpen={openId === 'carriers'}
          onToggle={handleToggle}
        >
          <CarriersSection />
        </ContactsAccordionItem>

        <ContactsAccordionItem
          id="machines"
          title="Техника"
          description="Самосвалы, спецтехника и их параметры."
          isOpen={openId === 'machines'}
          onToggle={handleToggle}
        >
          <MachinesSection />
        </ContactsAccordionItem>

        <ContactsAccordionItem
          id="clients"
          title="Клиенты"
          description="Заказчики и контактные лица."
          isOpen={openId === 'clients'}
          onToggle={handleToggle}
        >
          <ClientsSection />
        </ContactsAccordionItem>
      </div>
    </div>
  );
}

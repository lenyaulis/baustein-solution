// src/components/contacts/ClientsSection.jsx
import { useState } from 'react';
import AccordionSection from './AccordionSection';
import CLIENTS_DEFAULT from '../../data/contacts/clientsMock';

export default function ClientsSection() {
  const [isOpen, setIsOpen] = useState(true);
  const [clients] = useState(CLIENTS_DEFAULT);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <AccordionSection
      id="clients"
      title="Клиенты"
      isOpen={isOpen}
      onToggle={handleToggle}
    >
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontSize: 13,
        }}
      >
        {clients.map((cl) => (
          <li
            key={cl.id}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              marginBottom: 6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {cl.name}
            </div>
            <div style={{ color: '#4b5563' }}>
              {cl.phone}
              {cl.notes ? ` — ${cl.notes}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </AccordionSection>
  );
}

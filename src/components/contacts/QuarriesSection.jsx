// src/components/contacts/QuarriesSection.jsx
import { useState } from 'react';
import AccordionSection from './AccordionSection';
import QUARRIES_DEFAULT from '../../data/contacts/quarriesMock';

export default function QuarriesSection() {
  const [openSection, setOpenSection] = useState(true);
  const [quarries] = useState(QUARRIES_DEFAULT);

  const handleToggle = () => setOpenSection((prev) => !prev);

  return (
    <AccordionSection
      id="quarries"
      title="Карьеры"
      isOpen={openSection}
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
        {quarries.map((q) => (
          <li
            key={q.id}
            style={{
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              marginBottom: 6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {q.name}
            </div>
            <div style={{ color: '#4b5563' }}>
              {q.org}
              {q.phone ? `, ${q.phone}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </AccordionSection>
  );
}

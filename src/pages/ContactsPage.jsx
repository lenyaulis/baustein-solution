// src/pages/ContactsPage.jsx
import QuarriesSection from '../components/contacts/QuarriesSection';
import CarriersSection from '../components/contacts/CarriersSection';
import MachinesSection from '../components/contacts/MachinesSection';
import ClientsSection from '../components/contacts/ClientsSection';

export default function ContactsPage() {
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
        <QuarriesSection />
        <CarriersSection />
        <MachinesSection />
        <ClientsSection />
      </div>
    </div>
  );
}

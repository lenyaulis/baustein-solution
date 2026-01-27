import { useEffect } from 'react';

function OverdueReminderBanner({ visible, onClose }) {


  return (
    <div className={`overdue-banner ${visible ? 'overdue-banner--visible' : ''}`}>
      <span>Напоминание просрочено!</span>
      <button
        className="overdue-banner__close"
        type="button"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export default OverdueReminderBanner;

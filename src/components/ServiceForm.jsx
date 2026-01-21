// src/components/ServiceForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

export default function ServiceForm({
  onSubmit,
  onUpdate,
  onCancelEdit,
  editingId,
  initialData,
  executors = [],
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: initialData?.id || Date.now(),
      date: initialData?.date || getDefault2026Date(),
      toTime: initialData?.toTime || '18:00',
      serviceName: initialData?.serviceName || '',
      address: initialData?.address || '',
      receiver: initialData?.receiver || '',
      executor: initialData?.executor || 'Не определен',
      countType: initialData?.countType || 'hours', // 'hours' | 'trips'
      hours: initialData?.hours || '',
      trips: initialData?.trips || '',
      unit: initialData?.unit || 'часов',
      price: initialData?.price || '',
      clientName: initialData?.clientName || '',
      clientPrice: initialData?.clientPrice || '',
    },
  });

  const countType = watch('countType');

  useEffect(() => {
    if (editingId && initialData) {
      reset({
        id: initialData.id,
        date: initialData.date || getDefault2026Date(),
        toTime: initialData.toTime || '18:00',
        serviceName: initialData.serviceName || '',
        address: initialData.address || '',
        receiver: initialData.receiver || '',
        executor: initialData.executor || 'Не определен',
        countType: initialData.countType || 'hours',
        hours: initialData.hours || '',
        trips: initialData.trips || '',
        unit: initialData.unit || 'часов',
        price: initialData.price || '',
        clientName: initialData.clientName || '',
        clientPrice: initialData.clientPrice || '',
      });
    } else {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        toTime: '18:00',
        serviceName: '',
        address: '',
        receiver: '',
        executor: 'Не определен',
        countType: 'hours',
        hours: '',
        trips: '',
        unit: 'часов',
        price: '',
        clientName: '',
        clientPrice: '',
      });
    }
  }, [editingId, initialData, reset]);

  const onFormSubmit = (data) => {
    const prepared = {
      ...data,
      hours: data.hours ? Number(data.hours) : '',
      trips: data.trips ? Number(data.trips) : '',
      price: data.price ? Number(data.price) : '',
      clientPrice: data.clientPrice ? Number(data.clientPrice) : '',
    };

    if (editingId) {
      onUpdate({ ...prepared, id: editingId });
    } else {
      onSubmit(prepared);
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        toTime: '18:00',
        serviceName: '',
        address: '',
        receiver: '',
        executor: 'Не определен',
        countType: 'hours',
        hours: '',
        trips: '',
        unit: 'часов',
        price: '',
        clientName: '',
        clientPrice: '',
      });
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Заявка на услугу</h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="form-section">
          <div className="form-section-title">Основное</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Дата</label>
              <input
                type="date"
                className="form-input"
                {...register('date', { required: true })}
              />
              {errors.date && (
                <span className="form-error">Укажи дату</span>
              )}
            </div>

            <div className="form-row">
              <label className="form-label">К которому часу</label>
              <input
                type="time"
                className="form-input"
                {...register('toTime', { required: true })}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Услуга</label>
              <input
                type="text"
                className="form-input"
                {...register('serviceName', { required: true })}
                placeholder="Например, Услуги самосвала"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Адрес</label>
              <input
                type="text"
                className="form-input"
                {...register('address', { required: true })}
                placeholder="Адрес"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Принимающий</label>
              <input
                type="text"
                className="form-input"
                {...register('receiver', { required: true })}
                placeholder="Имя и телефон"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Исполнитель</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Исполнитель</label>
              <select className="form-input" {...register('executor')}>
                {executors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Тип учета</label>
              <select className="form-input" {...register('countType')}>
                <option value="hours">Часы</option>
                <option value="trips">Рейсы</option>
              </select>
            </div>

            {countType === 'hours' ? (
              <div className="form-row">
                <label className="form-label">Количество часов</label>
                <input
                  type="number"
                  className="form-input"
                  {...register('hours')}
                  placeholder="Например, 8"
                />
              </div>
            ) : (
              <div className="form-row">
                <label className="form-label">Количество рейсов</label>
                <input
                  type="number"
                  className="form-input"
                  {...register('trips')}
                  placeholder="Например, 4"
                />
              </div>
            )}

            <div className="form-row">
              <label className="form-label">
                Цена исполнителю ({countType === 'hours' ? 'р/час' : 'р/рейс'})
              </label>
              <input
                type="number"
                className="form-input"
                {...register('price')}
                placeholder="Например, 2000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Клиент</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Клиент</label>
              <input
                type="text"
                className="form-input"
                {...register('clientName')}
                placeholder="ООО Ромашка"
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Цена клиенту ({countType === 'hours' ? 'р/час' : 'р/рейс'})
              </label>
              <input
                type="number"
                className="form-input"
                {...register('clientPrice')}
                placeholder="Например, 2500"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="primary-btn">
            {editingId ? 'Сохранить изменения' : 'Сформировать заявку'}
          </button>
          {editingId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={onCancelEdit}
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// src/components/DriverForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

export default function DriverForm({
  onSubmit,          // create
  onUpdate,          // edit
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
      fromTime: initialData?.fromTime || '09:00',
      toTime: initialData?.toTime || '18:00',
      quarry: initialData?.quarry || '',
      material: initialData?.material || '',
      volume: initialData?.volume || '',
      unit: initialData?.unit || 'т',
      address: initialData?.address || '',
      receiver: initialData?.receiver || '',
      executor: initialData?.executor || 'Не определен',
      trips: initialData?.trips || '',
      pricePerTrip: initialData?.pricePerTrip || '',
      clientName: initialData?.clientName || '',
      clientPrice: initialData?.clientPrice || '',
      quarryPrice: initialData?.quarryPrice || '',
    },
  });

  const unit = watch('unit');

  useEffect(() => {
    if (editingId && initialData) {
      reset({
        id: initialData.id,
        date: initialData.date || getDefault2026Date(),
        fromTime: initialData.fromTime || '09:00',
        toTime: initialData.toTime || '18:00',
        quarry: initialData.quarry || '',
        material: initialData.material || '',
        volume: initialData.volume || '',
        unit: initialData.unit || 'т',
        address: initialData.address || '',
        receiver: initialData.receiver || '',
        executor: initialData.executor || 'Не определен',
        trips: initialData.trips || '',
        pricePerTrip: initialData.pricePerTrip || '',
        clientName: initialData.clientName || '',
        clientPrice: initialData.clientPrice || '',
        quarryPrice: initialData.quarryPrice || '',
      });
    } else {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        fromTime: '09:00',
        toTime: '18:00',
        quarry: '',
        material: '',
        volume: '',
        unit: 'т',
        address: '',
        receiver: '',
        executor: 'Не определен',
        trips: '',
        pricePerTrip: '',
        clientName: '',
        clientPrice: '',
        quarryPrice: '',
      });
    }
  }, [editingId, initialData, reset]);

  const onFormSubmit = (data) => {
    const prepared = {
      ...data,
      volume: data.volume ? Number(data.volume) : '',
      trips: data.trips ? Number(data.trips) : '',
      pricePerTrip: data.pricePerTrip ? Number(data.pricePerTrip) : '',
      clientPrice: data.clientPrice ? Number(data.clientPrice) : '',
      quarryPrice: data.quarryPrice ? Number(data.quarryPrice) : '',
    };

    if (editingId) {
      onUpdate({ ...prepared, id: editingId });
    } else {
      onSubmit(prepared);
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        fromTime: '09:00',
        toTime: '18:00',
        quarry: '',
        material: '',
        volume: '',
        unit: 'т',
        address: '',
        receiver: '',
        executor: 'Не определен',
        trips: '',
        pricePerTrip: '',
        clientName: '',
        clientPrice: '',
        quarryPrice: '',
      });
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Заявка на материал</h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Шапка */}
        <div className="form-section">
          <div className="form-section-title">Шапка</div>
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
              <label className="form-label">Время с / до</label>
              <div className="form-inline">
                <input
                  type="time"
                  className="form-input"
                  {...register('fromTime', { required: true })}
                />
                <span className="form-inline-separator">—</span>
                <input
                  type="time"
                  className="form-input"
                  {...register('toTime', { required: true })}
                />
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Карьер / поставщик</label>
              <input
                type="text"
                className="form-input"
                {...register('quarry', { required: true })}
                placeholder="Северка, Шабры..."
              />
              {errors.quarry && (
                <span className="form-error">Укажи карьер</span>
              )}
            </div>

            <div className="form-row">
              <label className="form-label">Материал</label>
              <input
                type="text"
                className="form-input"
                {...register('material', { required: true })}
                placeholder="Щебень, ПГС..."
              />
            </div>

            <div className="form-row">
              <label className="form-label">Объем для клиента</label>
              <div className="form-inline">
                <input
                  type="number"
                  className="form-input"
                  {...register('volume', { required: true })}
                  placeholder="Например, 20"
                />
                <select className="form-input" {...register('unit')}>
                  <option value="т">тонны</option>
                  <option value="м3">м3</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Цена карьеру за единицу</label>
              <input
                type="number"
                className="form-input"
                {...register('quarryPrice')}
                placeholder="например, 2500"
              />
            </div>
          </div>
        </div>

        {/* Данные клиента */}
        <div className="form-section">
          <div className="form-section-title">Данные клиента</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Клиент (организация)</label>
              <input
                type="text"
                className="form-input"
                {...register('clientName')}
                placeholder="ООО Ромашка"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Адрес</label>
              <input
                type="text"
                className="form-input"
                {...register('address', { required: true })}
                placeholder="Адрес выгрузки"
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

            <div className="form-row">
              <label className="form-label">
                Цена клиенту за единицу ({unit})
              </label>
              <input
                type="number"
                className="form-input"
                {...register('clientPrice')}
                placeholder="например, 3500"
              />
            </div>
          </div>
        </div>

        {/* Данные исполнителя */}
        <div className="form-section">
          <div className="form-section-title">Данные исполнителя</div>
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
              <label className="form-label">Количество рейсов</label>
              <input
                type="number"
                className="form-input"
                {...register('trips')}
                placeholder="Например, 4"
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Цена исполнителю за рейс
              </label>
              <input
                type="number"
                className="form-input"
                {...register('pricePerTrip')}
                placeholder="Например, 3000"
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

// src/components/QuarryForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

export default function QuarryForm({
  onSubmit,
  onUpdate,
  onCancelEdit,
  editingId,
  initialData,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: initialData?.id || Date.now(),
      date: initialData?.date || getDefault2026Date(),
      quarry: initialData?.quarry || '',
      material: initialData?.material || '',
      driverLastName: initialData?.driverLastName || '',
      truckBrand: initialData?.truckBrand || '',
      truckNumber: initialData?.truckNumber || '',
      volume: initialData?.volume || '',
      unit: initialData?.unit || 'м3',
      trips: initialData?.trips || '',
    },
  });

  useEffect(() => {
    if (editingId && initialData) {
      reset({
        id: initialData.id,
        date: initialData.date || getDefault2026Date(),
        quarry: initialData.quarry || '',
        material: initialData.material || '',
        driverLastName: initialData.driverLastName || '',
        truckBrand: initialData.truckBrand || '',
        truckNumber: initialData.truckNumber || '',
        volume: initialData.volume || '',
        unit: initialData.unit || 'м3',
        trips: initialData.trips || '',
      });
    } else {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        quarry: '',
        material: '',
        driverLastName: '',
        truckBrand: '',
        truckNumber: '',
        volume: '',
        unit: 'м3',
        trips: '',
      });
    }
  }, [editingId, initialData, reset]);

  const onFormSubmit = (data) => {
    const prepared = {
      ...data,
      volume: data.volume ? Number(data.volume) : '',
      trips: data.trips ? Number(data.trips) : '',
    };

    if (editingId) {
      onUpdate({ ...prepared, id: editingId });
    } else {
      onSubmit(prepared);
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        quarry: '',
        material: '',
        driverLastName: '',
        truckBrand: '',
        truckNumber: '',
        volume: '',
        unit: 'м3',
        trips: '',
      });
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Заявка в карьер</h2>

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
              <label className="form-label">Карьер</label>
              <input
                type="text"
                className="form-input"
                {...register('quarry', { required: true })}
                placeholder="Например, Северка"
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
              <label className="form-label">Фамилия водителя</label>
              <input
                type="text"
                className="form-input"
                {...register('driverLastName', { required: true })}
                placeholder="Иванов"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Автомобиль</label>
              <div className="form-inline">
                <input
                  type="text"
                  className="form-input"
                  {...register('truckBrand', { required: true })}
                  placeholder="Марка"
                />
                <input
                  type="text"
                  className="form-input"
                  {...register('truckNumber', { required: true })}
                  placeholder="Гос. номер"
                />
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Объем</label>
              <div className="form-inline">
                <input
                  type="number"
                  className="form-input"
                  {...register('volume', { required: true })}
                  placeholder="Например, 20"
                />
                <select className="form-input" {...register('unit')}>
                  <option value="м3">м3</option>
                  <option value="т">т</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Количество рейсов</label>
              <input
                type="number"
                className="form-input"
                {...register('trips', { required: true })}
                placeholder="Например, 4"
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

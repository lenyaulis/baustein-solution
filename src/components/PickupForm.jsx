// src/components/PickupForm.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

export default function PickupForm({
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
      volume: initialData?.volume || '',
      clientUnit: initialData?.clientUnit || 'м3',
      clientName: initialData?.clientName || '',
      driverLastName: initialData?.driverLastName || '',
      truckBrand: initialData?.truckBrand || '',
      truckNumber: initialData?.truckNumber || '',
      // НОВОЕ:
      buyPrice:
        initialData?.buyPrice !== undefined && initialData?.buyPrice !== null
          ? String(initialData.buyPrice)
          : '',
      sellPrice:
        initialData?.sellPrice !== undefined && initialData?.sellPrice !== null
          ? String(initialData.sellPrice)
          : '',
    },
  });

  useEffect(() => {
    if (editingId && initialData) {
      reset({
        id: initialData.id,
        date: initialData.date || getDefault2026Date(),
        quarry: initialData.quarry || '',
        material: initialData.material || '',
        volume: initialData.volume || '',
        clientUnit: initialData.clientUnit || 'м3',
        clientName: initialData.clientName || '',
        driverLastName: initialData.driverLastName || '',
        truckBrand: initialData.truckBrand || '',
        truckNumber: initialData.truckNumber || '',
        buyPrice:
          initialData.buyPrice !== undefined && initialData.buyPrice !== null
            ? String(initialData.buyPrice)
            : '',
        sellPrice:
          initialData.sellPrice !== undefined && initialData.sellPrice !== null
            ? String(initialData.sellPrice)
            : '',
      });
    } else {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        quarry: '',
        material: '',
        volume: '',
        clientUnit: 'м3',
        clientName: '',
        driverLastName: '',
        truckBrand: '',
        truckNumber: '',
        buyPrice: '',
        sellPrice: '',
      });
    }
  }, [editingId, initialData, reset]);

  const onFormSubmit = (data) => {
    const prepared = {
      ...data,
      volume: data.volume ? Number(data.volume) : '',
      buyPrice: data.buyPrice ? Number(data.buyPrice) : null,
      sellPrice: data.sellPrice ? Number(data.sellPrice) : null,
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
        volume: '',
        clientUnit: 'м3',
        clientName: '',
        driverLastName: '',
        truckBrand: '',
        truckNumber: '',
        buyPrice: '',
        sellPrice: '',
      });
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Самовывоз</h2>

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
              <label className="form-label">Объем</label>
              <div className="form-inline">
                <input
                  type="number"
                  className="form-input"
                  {...register('volume', { required: true })}
                  placeholder="Например, 20"
                />
                <select className="form-input" {...register('clientUnit')}>
                  <option value="м3">м3</option>
                  <option value="т">т</option>
                </select>
              </div>
            </div>

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
              <label className="form-label">Фамилия водителя</label>
              <input
                type="text"
                className="form-input"
                {...register('driverLastName')}
                placeholder="Иванов"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Автомобиль</label>
              <div className="form-inline">
                <input
                  type="text"
                  className="form-input"
                  {...register('truckBrand')}
                  placeholder="Марка"
                />
                <input
                  type="text"
                  className="form-input"
                  {...register('truckNumber')}
                  placeholder="Гос. номер"
                />
              </div>
            </div>

            {/* НОВЫЕ ПОЛЯ: цены */}
            <div className="form-row">
              <label className="form-label">
                Цена покупки, ₽ за единицу
              </label>
              <input
                type="number"
                className="form-input"
                {...register('buyPrice')}
                placeholder="Например, 500"
                min="0"
                step="1"
              />
            </div>

            <div className="form-row">
              <label className="form-label">
                Цена продажи, ₽ за единицу
              </label>
              <input
                type="number"
                className="form-input"
                {...register('sellPrice')}
                placeholder="Например, 800"
                min="0"
                step="1"
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

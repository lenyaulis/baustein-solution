import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

// единица измерения для карьера/поставщика по названию
function getQuarryUnitByName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('северка')) return 'тонны';
  if (n.includes('шабры')) return 'м3';
  if (n.includes('шитовской')) return 'м3';
  if (n.includes('горнощит')) return 'тонны';
  if (n.includes('седельник')) return 'тонны';
  if (n.includes('билимбай')) return 'тонны';
  if (n.includes('паритет')) return 'м3';
  if (n.includes('светлая речка')) return 'м3';
  return '';
}

export default function PickupForm({ onAdd, mode = 'create', initialValues }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: initialValues?.id || Date.now(),
      date: initialValues?.date || getDefault2026Date(),
      quarry: initialValues?.quarry || '',
      material: initialValues?.material || '',
      clientName: initialValues?.clientName || '',
      volume: initialValues?.volume || '',
      clientUnit: initialValues?.clientUnit || 'т',
      clientPrice: initialValues?.clientPrice || '',
      driverLastName: initialValues?.driverLastName || '',
      truckNumber: initialValues?.truckNumber || '',
      truckBrand: initialValues?.truckBrand || '',
      quarryPrice: initialValues?.quarryPrice || '',
      quarryUnit: initialValues?.quarryUnit || '',
    },
  });

  const quarryValue = watch('quarry');

  useEffect(() => {
    const unit = getQuarryUnitByName(quarryValue);
    setValue('quarryUnit', unit);
  }, [quarryValue, setValue]);

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset({
        id: initialValues.id,
        date: initialValues.date || getDefault2026Date(),
        quarry: initialValues.quarry || '',
        material: initialValues.material || '',
        clientName: initialValues.clientName || '',
        volume: initialValues.volume || '',
        clientUnit: initialValues.clientUnit || 'т',
        clientPrice: initialValues.clientPrice || '',
        driverLastName: initialValues.driverLastName || '',
        truckNumber: initialValues.truckNumber || '',
        truckBrand: initialValues.truckBrand || '',
        quarryPrice: initialValues.quarryPrice || '',
        quarryUnit: initialValues.quarryUnit || '',
      });
    } else if (mode === 'create') {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        quarry: '',
        material: '',
        clientName: '',
        volume: '',
        clientUnit: 'т',
        clientPrice: '',
        driverLastName: '',
        truckNumber: '',
        truckBrand: '',
        quarryPrice: '',
        quarryUnit: '',
      });
    }
  }, [mode, initialValues, reset]);

  const onSubmit = (data) => {
    const prepared = {
      ...data,
      volume: data.volume ? Number(data.volume) : '',
      clientPrice: data.clientPrice ? Number(data.clientPrice) : '',
      quarryPrice: data.quarryPrice ? Number(data.quarryPrice) : '',
    };
    onAdd(prepared);
    if (mode === 'create') {
      reset({
        id: Date.now(),
        date: getDefault2026Date(),
        quarry: '',
        material: '',
        clientName: '',
        volume: '',
        clientUnit: 'т',
        clientPrice: '',
        driverLastName: '',
        truckNumber: '',
        truckBrand: '',
        quarryPrice: '',
        quarryUnit: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card">
        <h2 className="card-title">Самовывоз</h2>

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
                placeholder="Щебень 5–20"
              />
            </div>
          </div>
        </div>

        {/* Данные клиента */}
        <div className="form-section">
          <div className="form-section-title">Данные клиента</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Клиент</label>
              <input
                type="text"
                className="form-input"
                {...register('clientName')}
                placeholder="ООО Клиент"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Объем (клиент)</label>
              <div className="form-inline">
                <input
                  type="number"
                  className="form-input"
                  {...register('volume')}
                  placeholder="Например, 20"
                />
                <select
                  className="form-input"
                  {...register('clientUnit')}
                >
                  <option value="т">тонны</option>
                  <option value="м3">м3</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Цена клиенту за единицу</label>
              <input
                type="number"
                className="form-input"
                {...register('clientPrice')}
                placeholder="например, 1500"
              />
            </div>
          </div>
        </div>

        {/* Водитель и ТС */}
        <div className="form-section">
          <div className="form-section-title">Водитель и ТС</div>
          <div className="form-grid">
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
              <label className="form-label">Номер ТС</label>
              <input
                type="text"
                className="form-input"
                {...register('truckNumber')}
                placeholder="А123ВС 66"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Марка ТС</label>
              <input
                type="text"
                className="form-input"
                {...register('truckBrand')}
                placeholder="КамАЗ"
              />
            </div>
          </div>
        </div>

        {/* Карьер / поставщик */}
        <div className="form-section">
          <div className="form-section-title">Карьер / поставщик</div>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Цена карьеру за единицу</label>
              <input
                type="number"
                className="form-input"
                {...register('quarryPrice')}
                placeholder="например, 900"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Ед. изм. карьера</label>
              <input
                type="text"
                className="form-input"
                {...register('quarryUnit')}
                disabled
                placeholder="авто выбирается по карьеру"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="primary-btn">
          {mode === 'edit' ? 'Сохранить изменения' : 'Сформировать заявку'}
        </button>
      </div>
    </form>
  );
}

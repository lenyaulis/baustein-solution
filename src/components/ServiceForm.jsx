import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  return `2026-${m}-${d}`;
}

export default function ServiceForm({
  onAdd,
  executors = [],
  mode = 'create', // 'create' | 'edit'
  initialValues,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: initialValues?.id || Date.now(),
      date: initialValues?.date || getDefault2026Date(),
      toTime: initialValues?.toTime || '18:00',
      serviceName: initialValues?.serviceName || '',
      address: initialValues?.address || '',
      receiver: initialValues?.receiver || '',
      executor: initialValues?.executor || 'Не определен',
      countType: initialValues?.countType || 'hours', // hours | trips
      hours: initialValues?.hours || '',
      trips: initialValues?.trips || '',
      unit: initialValues?.unit || 'часов', // для текста заявки
      price: initialValues?.price || '',
      // новые поля
      clientName: initialValues?.clientName || '',
      clientPrice: initialValues?.clientPrice || '',
    },
  });

  const countType = watch('countType');

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      reset({
        id: initialValues.id,
        date: initialValues.date || getDefault2026Date(),
        toTime: initialValues.toTime || '18:00',
        serviceName: initialValues.serviceName || '',
        address: initialValues.address || '',
        receiver: initialValues.receiver || '',
        executor: initialValues.executor || 'Не определен',
        countType: initialValues.countType || 'hours',
        hours: initialValues.hours || '',
        trips: initialValues.trips || '',
        unit: initialValues.unit || 'часов',
        price: initialValues.price || '',
        clientName: initialValues.clientName || '',
        clientPrice: initialValues.clientPrice || '',
      });
    } else if (mode === 'create') {
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
  }, [mode, initialValues, reset]);

  const onSubmit = (data) => {
    const prepared = {
      ...data,
      hours: data.hours ? Number(data.hours) : '',
      trips: data.trips ? Number(data.trips) : '',
      price: data.price ? Number(data.price) : '',
      clientPrice: data.clientPrice ? Number(data.clientPrice) : '',
    };
    onAdd(prepared);
    if (mode === 'create') {
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
            </div>

            <div className="form-row">
            <label className="form-label">Время до</label>
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
                placeholder="Уборка снега"
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
            <label className="form-label">Адрес</label>
            <input
                type="text"
                className="form-input"
                {...register('address', { required: true })}
                placeholder="Адрес работ"
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
            <label className="form-label">Цена клиенту за единицу</label>
            <input
                type="number"
                className="form-input"
                {...register('clientPrice')}
                placeholder="например, 3000"
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
            <label className="form-label">Тип учета</label>
            <select className="form-input" {...register('countType')}>
                <option value="hours">по часам</option>
                <option value="trips">по рейсам</option>
            </select>
            </div>

            <div className="form-row">
            <label className="form-label">Количество часов/рейсов</label>
            <input
                type="number"
                className="form-input"
                {...register('countValue')}
                placeholder="Например, 4"
            />
            </div>

            <div className="form-row">
            <label className="form-label">Цена исполнителю за единицу</label>
            <input
                type="number"
                className="form-input"
                {...register('price')}
                placeholder="например, 2500"
            />
            </div>
        </div>
        </div>

        <button type="submit" className="primary-btn">
        {mode === 'edit' ? 'Сохранить изменения' : 'Сформировать заявку'}
        </button>
    </div>
    );

}

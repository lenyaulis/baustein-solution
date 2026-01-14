import { useForm } from 'react-hook-form';

const QUARRIES = [
  'Северка',
  'Шабры (УралНеруд)',
  'Шитовской (УралНеруд)',
  'Горнощитский',
  'Седельники',
  'Билимбай (УралДоломит)',
  'Паритет',
  'Светлая речка (ИП Меликян)',
];

function getDefault2026Date() {
  const today = new Date();
  const d = String(today.getDate()).padStart(2, '0');
  const m = String(today.getMonth() + 1).padStart(2, '0');
  // всегда год 2026
  return `2026-${m}-${d}`;
}

export default function QuarryForm({ onAdd }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quarry: QUARRIES[0],
      unit: 'т',
      date: getDefault2026Date(),
    },
  });

  const onSubmit = (data) => {
    const prepared = {
      id: Date.now(),
      quarry: data.quarry,
      material: data.material,
      driverLastName: data.driverLastName,
      truckNumber: data.truckNumber,
      truckBrand: data.truckBrand,
      volume: Number(data.volume),
      unit: data.unit,
      trips: Number(data.trips || 1),
      date: data.date,
    };
    onAdd(prepared);
    reset({
      quarry: data.quarry,
      unit: data.unit,
      date: data.date || getDefault2026Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="card">
        <h2 className="card-title">Заявка карьера</h2>

        <div className="form-section">
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
                <label className="form-label">Карьер</label>
                <input
                type="text"
                className="form-input"
                {...register('quarry', { required: true })}
                placeholder="Северка, Шабры..."
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
                <label className="form-label">Номер ТС</label>
                <input
                type="text"
                className="form-input"
                {...register('truckNumber', { required: true })}
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

            <div className="form-row">
                <label className="form-label">Объем</label>
                <div className="form-inline">
                <input
                    type="number"
                    className="form-input"
                    {...register('volume')}
                    placeholder="20"
                />
                <select className="form-input" {...register('unit')}>
                    <option value="т">тонны</option>
                    <option value="м3">м3</option>
                </select>
                </div>
            </div>

            <div className="form-row">
                <label className="form-label">Количество рейсов</label>
                <input
                type="number"
                className="form-input"
                {...register('trips')}
                placeholder="4"
                />
            </div>
            </div>
        </div>

        <button type="submit" className="primary-btn">
            Сформировать заявку
        </button>
        </div>
    </form>
    );

}

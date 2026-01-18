// src/pages/ReportsPageInner.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx-js-style';

function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

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

function ReportsPageInner({
  driverMaterialRequests,
  driverServiceRequests,
  pickupRequests,
}) {
  const todayISO = new Date().toISOString().slice(0, 10);
  const weekAgoISO = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [startDate, setStartDate] = useState(weekAgoISO);
  const [endDate, setEndDate] = useState(todayISO);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      alert('Выбери дату "с" и "по"');
      return;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      alert('Дата "с" не может быть позже даты "по"');
      return;
    }

    setIsGenerating(true);

    try {
      const inRange = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return false;
        return d >= start && d <= end;
      };

      const materialInRange = driverMaterialRequests.filter((r) =>
        inRange(r.date)
      );
      const serviceInRange = driverServiceRequests.filter((r) =>
        inRange(r.date)
      );
      const pickupInRange = pickupRequests.filter((r) => inRange(r.date));

      const rows = [];

      // Материал
      materialInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';
        const clientVolume = r.volume || 0;
        const clientUnit =
          r.unit === 'т' || r.unit === 'тонн' || r.unit === 'тонны'
            ? 'тонны'
            : r.unit || '';
        const clientPricePerUnit = r.clientPrice || 0;
        const clientTotal =
          clientPricePerUnit && clientVolume
            ? clientPricePerUnit * clientVolume
            : 0;

        const executor = r.executor || 'Не определен';
        const truckNumberExec = '';
        const truckBrandExec = '';
        const execCount = r.trips || 0;
        const execUnit = 'рейс';
        const execPricePerUnit = r.pricePerTrip || 0;
        const execTotal =
          execCount && execPricePerUnit ? execCount * execPricePerUnit : 0;

        const quarryName = r.quarry || '';
        const quarryVolume = r.volume || 0;
        const quarryUnit = getQuarryUnitByName(r.quarry);
        const quarryPricePerUnit = r.quarryPrice || 0;
        const quarryTotal =
          quarryPricePerUnit && quarryVolume
            ? quarryPricePerUnit * quarryVolume
            : 0;

        const profit = clientTotal - (execTotal + quarryTotal);

        rows.push([
          dateFormatted,
          r.material || '',
          r.address || '',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount || '',
          execUnit,
          execPricePerUnit || '',
          execTotal || '',
          quarryName,
          quarryVolume || '',
          quarryUnit,
          quarryPricePerUnit || '',
          quarryTotal || '',
          profit || '',
        ]);
      });

      // Самовывоз
      pickupInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';

        const clientVolume = Number(r.volume) || 0;
        const clientUnit =
          r.clientUnit === 'т' ||
          r.clientUnit === 'тонн' ||
          r.clientUnit === 'тонны'
            ? 'тонны'
            : r.clientUnit || '';
        const clientPricePerUnit = Number(r.clientPrice) || 0;
        const clientTotal = clientPricePerUnit * clientVolume;

        const executor = '';
        const truckNumberExec = r.truckNumber || '';
        const truckBrandExec = r.truckBrand || '';
        const execCount = '';
        const execUnit = '';
        const execPricePerUnit = 0;
        const execTotal = 0;

        const quarryName = r.quarry || '';
        const quarryVolume = clientVolume;
        const quarryUnit = r.quarryUnit || getQuarryUnitByName(r.quarry);
        const quarryPricePerUnit = Number(r.quarryPrice) || 0;
        const quarryTotal = quarryPricePerUnit * quarryVolume;

        const profit = clientTotal - quarryTotal;

        rows.push([
          dateFormatted,
          r.material || '',
          'Самовывоз',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount,
          execUnit,
          execPricePerUnit,
          execTotal || '',
          quarryName,
          quarryVolume || '',
          quarryUnit,
          quarryPricePerUnit || '',
          quarryTotal || '',
          profit || '',
        ]);
      });

      // Услуга
      serviceInRange.forEach((r) => {
        const dateFormatted = formatDateDDMMYYYY(r.date);
        const client = r.clientName || '';

        let clientVolume = 0;
        let clientUnit = '';

        if (r.countType === 'hours') {
          clientVolume = Number(r.hours) || 0;
          clientUnit = 'час';
        } else {
          clientVolume = Number(r.trips) || 0;
          clientUnit = 'рейс';
        }

        const clientPricePerUnit = Number(r.clientPrice) || 0;
        const clientTotal = clientPricePerUnit * clientVolume;

        const executor = r.executor || 'Не определен';
        const truckNumberExec = '';
        const truckBrandExec = '';
        const execCount =
          r.countType === 'hours'
            ? Number(r.hours) || 0
            : Number(r.trips) || 0;
        const execUnit = r.countType === 'hours' ? 'час' : 'рейс';
        const execPricePerUnit = Number(r.price) || 0;
        const execTotal = execCount * execPricePerUnit;

        const quarryName = '';
        const quarryVolume = '';
        const quarryUnit = '';
        const quarryPricePerUnit = 0;
        const quarryTotal = '';

        const profit = clientTotal - execTotal;

        rows.push([
          dateFormatted,
          r.serviceName || '',
          r.address || '',
          client,
          clientVolume || '',
          clientUnit,
          clientPricePerUnit || '',
          clientTotal || '',
          executor,
          truckNumberExec,
          truckBrandExec,
          execCount || '',
          execUnit,
          execPricePerUnit || '',
          execTotal || '',
          quarryName,
          quarryVolume,
          quarryUnit,
          quarryPricePerUnit,
          quarryTotal,
          profit || '',
        ]);
      });

      const header = [
        'Дата',
        'Материал/Услуга',
        'Адрес',
        'Клиент',
        'Объем',
        'Ед. изм. клиента',
        'Цена за ед. клиенту',
        'Итог клиенту',
        'Исполнитель',
        'Номер ТС',
        'Марка ТС',
        'Кол-во рейсов/часов',
        'Ед. изм. исполнителя',
        'Цена за ед. исполнителю',
        'Итог исполнителю',
        'Карьер/Поставщик',
        'Объем карьера',
        'Ед. изм. карьера',
        'Цена за ед. карьеру',
        'Итог карьеру',
        'Прибыль',
      ];

      const aoa = [header, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(aoa);

      const range = XLSX.utils.decode_range(ws['!ref']);
      const yellow = { fill: { patternType: 'solid', fgColor: { rgb: 'FFFDE9' } } };
      const turquoise = { fill: { patternType: 'solid', fgColor: { rgb: 'E0FFFF' } } };
      const green = { fill: { patternType: 'solid', fgColor: { rgb: 'E8F5E9' } } };
      const orange = { fill: { patternType: 'solid', fgColor: { rgb: 'FFEFD5' } } };

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;

          if (C === 0) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...yellow };
          }
          if (C >= 8 && C <= 14) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...turquoise };
          }
          if (C >= 15 && C <= 19) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...green };
          }
          if (C === 20) {
            ws[cellRef].s = { ...(ws[cellRef].s || {}), ...orange };
          }
        }
      }

      const startLabel = formatDateDDMMYYYY(startDate);
      const endLabel = formatDateDDMMYYYY(endDate);
      const fileName = `report_${startLabel}-${endLabel}.xlsx`;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Отчет');
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error(e);
      alert('Не удалось сформировать отчет');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 style={{ margin: 0, marginBottom: 20 }}>Отчеты</h1>

      <div
        className="card"
        style={{
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          className="form-section"
          style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}
        >
          <div className="form-section-title">Период отчета</div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'flex-end',
            }}
          >
            <div className="form-row" style={{ maxWidth: 220 }}>
              <label className="form-label">Дата с</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="form-row" style={{ maxWidth: 220 }}>
              <label className="form-label">Дата по</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="primary-btn"
              style={{ marginTop: 0 }}
            >
              {isGenerating ? 'Формируется...' : 'Сформировать отчет'}
            </button>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#6b7280' }}>
        В отчет попадают заявки исполнителю (материал, самовывоз и услуга) за выбранный период.
      </p>
    </div>
  );
}

export default ReportsPageInner;

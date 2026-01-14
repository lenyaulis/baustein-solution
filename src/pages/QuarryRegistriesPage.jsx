// src/pages/QuarryRegistriesPage.jsx
import { useState } from 'react';
import readXlsxFile from 'read-excel-file';
import * as XLSX from 'xlsx';

// ===== Паритет =====

function normalizeParitet(rows) {
  const data = [];

  const formatDayMonth = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      });
    }
    const str = String(value);
    const parts = str.split('.');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}`;
    }
    return str;
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 6) continue;

    const [shipmentNumber, truckNumber, material, volume, customer, date] = row;

    const isVolumeNumber = typeof volume === 'number';
    const isMaterial = typeof material === 'string' && material.includes('-');

    if (!isVolumeNumber || !isMaterial) continue;

    data.push({
      quarryName: 'Паритет',
      date: formatDayMonth(date),
      material: material || '',
      driverLastName: '',
      truckNumber: truckNumber || '',
      truckBrand: '',
      volume: volume || '',
      volumeUnit: 'м3',
    });
  }

  return data;
}

// ===== Северка =====

function normalizeSeverka(rows) {
  const data = [];
  if (!rows.length) return data;

  let headerRowIndex = -1;
  let header = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const lower = row.map((h) => (h ? String(h).toLowerCase() : ''));
    const hasTime = lower.some((h) => h.includes('время отвеса'));
    const hasNetto = lower.some((h) => h.includes('масса нетто'));
    if (hasTime && hasNetto) {
      headerRowIndex = i;
      header = lower;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return data;
  }

  const idxTime = header.findIndex((h) => h.includes('время отвеса'));
  const idxCargo = header.findIndex((h) => h.includes('груз'));
  const idxDriver = header.findIndex((h) => h.includes('водитель'));
  const idxTruckNumber = header.findIndex((h) => h.includes('номер транспорт'));
  const idxTruckBrand = header.findIndex((h) => h.includes('тягач марка'));
  const idxNetto = header.findIndex((h) => h.includes('масса нетто'));

  const formatDayMonth = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      });
    }
    const str = String(value);
    const [datePart] = str.split(' ');
    const parts = datePart.split('.');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}.${parts[1].padStart(2, '0')}`;
    }
    return str;
  };

  const extractMaterial = (value) => {
    if (!value) return '';
    const str = String(value);
    const allowed = ['0-5', '5-20', '20-40', '40-70', '0-20'];
    const found = allowed.find((m) => str.includes(m));
    return found || '';
  };

  const extractDriverLastName = (value) => {
    if (!value) return '';
    const str = String(value).trim();
    return str.split(' ')[0];
  };

  const extractNetto = (value) => {
    if (value == null) return '';
    const digits = String(value).replace(/[^\d]/g, '');
    if (digits.length < 3) return digits;

    const slice = digits.slice(0, 4);
    if (slice.length === 4) {
      return `${slice.slice(0, 2)},${slice.slice(2)}`;
    }
    if (slice.length === 3) {
      return `${slice[0]},${slice.slice(1)}`;
    }
    return slice;
  };

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    if (String(row[0]).toLowerCase().includes('итого')) continue;

    const timeVal = idxTime >= 0 ? row[idxTime] : null;
    const cargoVal = idxCargo >= 0 ? row[idxCargo] : null;
    const driverVal = idxDriver >= 0 ? row[idxDriver] : null;
    const truckNumberVal = idxTruckNumber >= 0 ? row[idxTruckNumber] : null;
    const truckBrandVal = idxTruckBrand >= 0 ? row[idxTruckBrand] : null;
    const nettoVal = idxNetto >= 0 ? row[idxNetto] : null;

    if (!cargoVal && !truckNumberVal && !nettoVal) continue;

    data.push({
      quarryName: 'Северка',
      date: formatDayMonth(timeVal),
      material: extractMaterial(cargoVal),
      driverLastName: extractDriverLastName(driverVal),
      truckNumber: truckNumberVal || '',
      truckBrand: truckBrandVal || '',
      volume: extractNetto(nettoVal),
      volumeUnit: 'т',
    });
  }

  return data;
}

// ===== Уралнеруд (Шабры / Шитовской) Baushtain-2 =====
// Формат по Baushtain-2.xlsx: [date, kontragent, carrier, docNo, time, truck, unit, material, docId, volume, price, sum] [file:221]

function normalizeUralnerudBaushtain(rows) {
  const data = [];

  const excelSerialToDate = (serial) => {
    const d = new Date(1899, 11, 30);
    d.setDate(d.getDate() + serial);
    return d;
  };

  const formatDayMonth = (value) => {
    if (!value) return '';

    // 1) Если это число вида 45963 — Excel serial
    if (typeof value === 'number') {
      const d = excelSerialToDate(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        });
      }
    }

    // 2) Если это Date
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      });
    }

    const str = String(value).trim();

    // 3) "2 Nov", "6 Nov", "11 Nov", "12 Nov", "15 Nov", "16 Nov" [file:221]
    const parts = str.split(' ');
    if (parts.length >= 2) {
      const dayRaw = parts[0];
      const monthRaw = parts[1];
      const monthKey = monthRaw.toLowerCase().slice(0, 3);
      const MONTHS = {
        jan: '01',
        feb: '02',
        mar: '03',
        apr: '04',
        may: '05',
        jun: '06',
        jul: '07',
        aug: '08',
        sep: '09',
        oct: '10',
        nov: '11',
        dec: '12',
      };
      const dd = dayRaw.padStart(2, '0');
      const mm = MONTHS[monthKey];
      if (mm) return `${dd}.${mm}`;
    }

    // 4) "11/16/25 13:51" — берем только дату → "16.11" [file:221]
    const [datePart] = str.split(' ');
    const usParts = datePart.split('/');
    if (usParts.length === 3) {
      const [mm, dd] = usParts;
      return `${dd.padStart(2, '0')}.${mm.padStart(2, '0')}`;
    }

    return str;
  };

  const detectQuarryName = (kontragentCell) => {
    if (!kontragentCell) return '';
    const s = String(kontragentCell).toLowerCase();
    if (s.includes('шабры')) return 'Шабры (Уралнеруд)';
    if (s.includes('шитовской')) return 'Шитовской (Уралнеруд)';
    return '';
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 10) continue;

    const dateCell = row[0];
    const kontragentCell = row[1];
    const truckCell = row[5];
    const unitCell = row[6];
    const materialCell = row[7];
    const volumeCell = row[9];

    if (!kontragentCell && !truckCell && !materialCell && !volumeCell) continue;

    const quarryName = detectQuarryName(kontragentCell);
    if (!quarryName) continue;

    const volume =
      typeof volumeCell === 'number'
        ? volumeCell
        : parseFloat(String(volumeCell).replace(',', '.')) || '';

    const unitStr = unitCell ? String(unitCell).trim() : '';
    const volumeUnit = unitStr || 'м3';

    data.push({
      quarryName,
      date: formatDayMonth(dateCell),
      material: materialCell || '',
      driverLastName: '',
      truckNumber: truckCell || '',
      truckBrand: '',
      volume,
      volumeUnit,
    });
  }

  return data;
}

// ===== Компонент страницы =====

export default function QuarryRegistriesPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [usedQuarries, setUsedQuarries] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleProcess = async () => {
    if (!files.length) {
      alert('Сначала выбери файлы реестров');
      return;
    }

    setIsProcessing(true);
    const allRows = [];

    try {
      for (const file of files) {
        const excelRows = await readXlsxFile(file);
        if (!excelRows || excelRows.length === 0) continue;

        let type = 'paritet';

        // Северка — есть "взвешивания"
        outerSeverka: {
          for (const row of excelRows) {
            if (!row) continue;
            for (const cell of row) {
              if (!cell) continue;
              const s = String(cell).toLowerCase();
              if (s.includes('взвешивания')) {
                type = 'severka';
                break outerSeverka;
              }
            }
          }
        }

        // Уралнеруд (Шабры / Шитовской) — во 2-й колонке "шабры"/"шитовской" [file:221]
        if (type === 'paritet') {
          let hasUralnerud = false;
          for (const row of excelRows) {
            if (!row || row.length < 2) continue;
            const cell = row[1];
            if (!cell) continue;
            const s = String(cell).toLowerCase();
            if (s.includes('шабры') || s.includes('шитовской')) {
              hasUralnerud = true;
              break;
            }
          }
          if (hasUralnerud) type = 'uralnerud-baushtain';
        }

        if (type === 'paritet') {
          allRows.push(...normalizeParitet(excelRows));
        } else if (type === 'severka') {
          allRows.push(...normalizeSeverka(excelRows));
        } else if (type === 'uralnerud-baushtain') {
          allRows.push(...normalizeUralnerudBaushtain(excelRows));
        }
      }

      if (!allRows.length) {
        alert('Не удалось получить данные из файлов. Проверь формат и карьеры.');
        return;
      }

      const uniqQuarries = Array.from(
        new Set(allRows.map((r) => r.quarryName || '').filter(Boolean))
      );
      setUsedQuarries(uniqQuarries);

      const worksheetData = [
        [
          'Название карьера',
          'Дата',
          'Материал',
          'Фамилия водителя',
          'Номер ТС',
          'Марка',
          'Объем',
        ],
        ...allRows.map((r) => [
          r.quarryName,
          r.date,
          r.material,
          r.driverLastName,
          r.truckNumber,
          r.truckBrand,
          `${r.volume} ${r.volumeUnit}`.trim(),
        ]),
      ];

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Реестр');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const formatTodayForFilename = () => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}.${mm}.${yyyy}`;
      };

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const todayStr = formatTodayForFilename();
      link.download = `reestr-karyerov_${todayStr}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert('Ошибка при обработке файлов. Проверь, что загружаешь .xlsx.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Реестры карьеров</h2>

      <div className="field" style={{ maxWidth: 360, marginBottom: 16 }}>
        <label>Файлы реестров (.xlsx)</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>

      <button
        type="button"
        className="primary-btn"
        onClick={handleProcess}
        disabled={isProcessing}
      >
        {isProcessing ? 'Преобразование...' : 'Преобразовать и скачать Excel'}
      </button>

      {usedQuarries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>
            Карьеры в этом реестре
          </h3>
          <table
            style={{
              borderCollapse: 'collapse',
              fontSize: 13,
              minWidth: 260,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    textAlign: 'left',
                    padding: '4px 8px',
                  }}
                >
                  Карьер
                </th>
              </tr>
            </thead>
            <tbody>
              {usedQuarries.map((name) => (
                <tr key={name}>
                  <td
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      padding: '4px 8px',
                    }}
                  >
                    {name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

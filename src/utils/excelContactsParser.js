// src/utils/excelContactsParser.js

// маппинг кодов материалов → нормальные названия
const MATERIAL_MAP = {
  'щеб': 'щебень',
  'дре': 'дресва',
  'асф': 'асфальт',
  'чер': 'чернозем',
  'пес': 'песок',
  'бет': 'бетон',
  'тор': 'торф',
  'торг': 'торфогрунт',
  'ска': 'скала',
  'пгс': 'пгс',
};

// "щеб, дре" -> ["щебень", "дресва"]
export function parseMaterials(raw) {
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((code) => MATERIAL_MAP[code] || code);
}

// "10 тонн" -> 10
export function parseCapacityTons(raw) {
  if (!raw) return null;
  const match = String(raw).match(/\d+/);
  if (!match) return null;
  return Number(match[0]) || null;
}

// "Имя +7900..., Имя2 +7900..." -> [{ raw, name, phones: [...] }, ...]
export function parseContacts(raw) {
  if (!raw) return [];
  const parts = String(raw)
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  return parts.map((chunk) => {
    const phoneMatch = chunk.match(/(\+?\d[\d\s\-()]+)/g);
    const phones = phoneMatch
      ? phoneMatch.map((p) => p.replace(/\s+/g, '').trim())
      : [];

    let name = chunk;
    if (phones.length > 0) {
      phones.forEach((ph) => {
        name = name.replace(ph, '');
      });
      name = name.replace(/\s+/g, ' ').trim();
    }

    return {
      raw: chunk,
      name: name || null,
      phones,
    };
  });
}

// rows — массив строк из листа "К-ры и исполнители"
export function parseQuarriesAndExecutorsSheet(rows) {
  // пропускаем первые 2 строки (заголовки)
  const dataRows = rows.slice(2);

  const quarries = [];
  const carriers = [];
  const machines = [];

  dataRows.forEach((row) => {
    if (!row || row.length === 0) return;

    const [
      quarryName,        // 0: Название карьера
      quarryContactRaw,  // 1: Контакт (карьер)
      quarryCommentRaw,  // 2: Комментарий (материалы)
      carrierName,       // 3: Перевозчик.Название
      carrierContactRaw, // 4: Перевозчик.Контакт
      carrierCommentRaw, // 5: Перевозчик.Комментарий (объём)
      machineName,       // 6: Техника.Название
      machineContactRaw, // 7: Техника.Контакт
      machineCommentRaw, // 8: Техника.Комментарий (типы техники)
    ] = row;

    // --- Карьеры ---
    if (quarryName) {
      quarries.push({
        name: String(quarryName).trim(),
        contacts: parseContacts(quarryContactRaw),
        materials: parseMaterials(quarryCommentRaw),
      });
    }

    // --- Перевозчики ---
    if (carrierName) {
      carriers.push({
        name: String(carrierName).trim(),
        contacts: parseContacts(carrierContactRaw),
        capacityTons: parseCapacityTons(carrierCommentRaw),
      });
    }

    // --- Техника ---
    if (machineName) {
      const equipmentRaw = machineCommentRaw ? String(machineCommentRaw).trim() : '';
      const allEquipment = equipmentRaw.toLowerCase() === 'вся техника';

      const equipmentTypes = allEquipment
        ? []
        : equipmentRaw
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);

      machines.push({
        name: String(machineName).trim(),
        contacts: parseContacts(machineContactRaw),
        allEquipment,
        equipmentTypes,
      });
    }
  });

  return { quarries, carriers, machines };
}

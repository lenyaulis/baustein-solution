// src/hooks/usePersistedRequests.js
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'baust_requests_v1';

function loadRequestsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        driverMaterialRequests: [],
        driverServiceRequests: [],
        quarryRequests: [],
        pickupRequests: [],
      };
    }
    const parsed = JSON.parse(stored);
    return {
      driverMaterialRequests: parsed.driverMaterialRequests || [],
      driverServiceRequests: parsed.driverServiceRequests || [],
      quarryRequests: parsed.quarryRequests || [],
      pickupRequests: parsed.pickupRequests || [],
    };
  } catch (e) {
    console.error('Ошибка чтения localStorage', e);
    return {
      driverMaterialRequests: [],
      driverServiceRequests: [],
      quarryRequests: [],
      pickupRequests: [],
    };
  }
}

export function usePersistedRequests() {
  const [driverMaterialRequests, setDriverMaterialRequests] = useState(
    () => loadRequestsFromStorage().driverMaterialRequests
  );
  const [driverServiceRequests, setDriverServiceRequests] = useState(
    () => loadRequestsFromStorage().driverServiceRequests
  );
  const [quarryRequests, setQuarryRequests] = useState(
    () => loadRequestsFromStorage().quarryRequests
  );
  const [pickupRequests, setPickupRequests] = useState(
    () => loadRequestsFromStorage().pickupRequests
  );

  useEffect(() => {
    try {
      const payload = {
        driverMaterialRequests,
        driverServiceRequests,
        quarryRequests,
        pickupRequests,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Ошибка записи localStorage', e);
    }
  }, [
    driverMaterialRequests,
    driverServiceRequests,
    quarryRequests,
    pickupRequests,
  ]);

  return {
    driverMaterialRequests,
    setDriverMaterialRequests,
    driverServiceRequests,
    setDriverServiceRequests,
    quarryRequests,
    setQuarryRequests,
    pickupRequests,
    setPickupRequests,
  };
}

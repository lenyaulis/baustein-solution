// src/hooks/useRequestsStore.js
import { useMemo } from 'react';
import { useRemoteRequests } from './useRemoteRequests';

export function useRequestsStore() {
  const {
    requests,
    loading,
    error,
    addRequest,
    removeRequest,
    updateRequest,
    setRequests,
  } = useRemoteRequests();

  // разложить общие заявки по типам
  const {
    driverMaterialRequests,
    driverServiceRequests,
    quarryRequests,
    pickupRequests,
  } = useMemo(() => {
    const material = [];
    const service = [];
    const quarry = [];
    const pickup = [];

    for (const r of requests) {
      switch (r.type) {
        case 'driverMaterial':
          material.push(r);
          break;
        case 'driverService':
          service.push(r);
          break;
        case 'quarry':
          quarry.push(r);
          break;
        case 'pickup':
          pickup.push(r);
          break;
        default:
          break;
      }
    }

    return {
      driverMaterialRequests: material,
      driverServiceRequests: service,
      quarryRequests: quarry,
      pickupRequests: pickup,
    };
  }, [requests]);

  // обертки для добавления по типам
  const addDriverMaterial = (payload) =>
    addRequest({ ...payload, type: 'driverMaterial' });

  const addDriverService = (payload) =>
    addRequest({ ...payload, type: 'driverService' });

  const addQuarry = (payload) =>
    addRequest({ ...payload, type: 'quarry' });

  const addPickup = (payload) =>
    addRequest({ ...payload, type: 'pickup' });

  // сеттеры для редактирования (совместимость с RequestsPage)
  const setDriverMaterialRequests = (updater) => {
    setRequests((prev) => {
      const current = prev.filter((r) => r.type === 'driverMaterial');
      const next =
        typeof updater === 'function' ? updater(current) : updater;
      const map = new Map(next.map((r) => [r.id, r]));
      return prev.map((r) =>
        r.type === 'driverMaterial' ? map.get(r.id) || r : r
      );
    });
  };

  const setDriverServiceRequests = (updater) => {
    setRequests((prev) => {
      const current = prev.filter((r) => r.type === 'driverService');
      const next =
        typeof updater === 'function' ? updater(current) : updater;
      const map = new Map(next.map((r) => [r.id, r]));
      return prev.map((r) =>
        r.type === 'driverService' ? map.get(r.id) || r : r
      );
    });
  };

  const setQuarryRequests = (updater) => {
    setRequests((prev) => {
      const current = prev.filter((r) => r.type === 'quarry');
      const next =
        typeof updater === 'function' ? updater(current) : updater;
      const map = new Map(next.map((r) => [r.id, r]));
      return prev.map((r) =>
        r.type === 'quarry' ? map.get(r.id) || r : r
      );
    });
  };

  const setPickupRequests = (updater) => {
    setRequests((prev) => {
      const current = prev.filter((r) => r.type === 'pickup');
      const next =
        typeof updater === 'function' ? updater(current) : updater;
      const map = new Map(next.map((r) => [r.id, r]));
      return prev.map((r) =>
        r.type === 'pickup' ? map.get(r.id) || r : r
      );
    });
  };

  return {
    driverMaterialRequests,
    driverServiceRequests,
    quarryRequests,
    pickupRequests,
    loading,
    error,
    addDriverMaterial,
    addDriverService,
    addQuarry,
    addPickup,
    removeRequest,
    updateRequest,
    setDriverMaterialRequests,
    setDriverServiceRequests,
    setQuarryRequests,
    setPickupRequests,
  };
}

// src/utils/groupCarriersByCapacity.js

export function groupCarriersByCapacity(carriers) {
  const map = {};
  carriers.forEach((carrier) => {
    (carrier.capacities || []).forEach((cap) => {
      if (!map[cap]) map[cap] = [];
      map[cap].push(carrier);
    });
  });
  return map;
}

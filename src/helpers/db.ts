import { getStoredOrders, saveOrders } from '../utils/storage';

export const db = {
  deleteFrom: (table: string) => ({
    executeTakeFirst: async () => {
      if (table === 'videoOrders') {
        const count = getStoredOrders().length;
        saveOrders([]);
        return { numDeletedRows: BigInt(count) };
      }
      return { numDeletedRows: 0n };
    }
  })
};

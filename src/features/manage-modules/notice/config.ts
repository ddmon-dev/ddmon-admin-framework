export const CONFIG = {
  tableName: 'notices',
  tableType: 'Notices',
} as const;

export type TableType = typeof CONFIG.tableType;

import { DataSourceType } from "../types/data-source";

const hubSpotTables = [
  {
    label: "Contacts",
    name: "contacts",
  },
  {
    label: "Companies",
    name: "companies",
  },
  {
    label: "Deals",
    name: "deals",
  },
];
const dataSourceTablesMap = new Map([[DataSourceType.HUB_SPOT, hubSpotTables]]);
export const getDataSourceTables = (dataSourceType: DataSourceType) => {
  return dataSourceTablesMap.get(dataSourceType);
};

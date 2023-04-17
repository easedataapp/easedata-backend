import DataSourceTypeDef from "./data-source";
import healthCheckTypeDef from "./health-check";
import queryTypeDef from "./query";
import userTypeDef from "./user";
import workspaceTypeDef from "./workspace";
import msOfficeSheetAPITypeDef from "./ms-office-sheet-api";

const typeDefs = [
  userTypeDef,
  healthCheckTypeDef,
  DataSourceTypeDef,
  workspaceTypeDef,
  queryTypeDef,
  msOfficeSheetAPITypeDef,
];

export default typeDefs;

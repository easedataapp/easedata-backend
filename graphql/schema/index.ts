import DataSourceTypeDef from "./data-source";
import healthCheckTypeDef from "./health-check";
import hubSpotTypeDef from "./hubspot";
import queryTypeDef from "./query";
import userTypeDef from "./user";
import workspaceTypeDef from "./workspace";

const typeDefs = [
  userTypeDef,
  healthCheckTypeDef,
  DataSourceTypeDef,
  hubSpotTypeDef,
  workspaceTypeDef,
  queryTypeDef,
];

export default typeDefs;

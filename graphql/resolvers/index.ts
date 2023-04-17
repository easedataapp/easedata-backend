import merge from "lodash.merge";
import { DataSourceResolver } from "./data-source";
import { HealthCheckResolver } from "./health-check";
import { DataQueryResolver } from "./query";
import { UserResolver } from "./user";
import { WorkspaceResolver } from "./workspace";
import { MSOfficeSheetAPIResolver } from "./ms-office-sheet-api";

const resolvers = merge(
  UserResolver,
  HealthCheckResolver,
  WorkspaceResolver,
  DataQueryResolver,
  DataSourceResolver,
  MSOfficeSheetAPIResolver
);

export default resolvers;

import { ApolloError } from "apollo-server-lambda";
import { checkWorkSpaceWriteAuthorization } from "../common/autherization";
import { DataSource } from "../model/data-source";
import { deleteAllQueryOfADataSource } from "../model/query";
import {
  deleteDataSourceFromWorkspace,
  getDataSourceToWorkspace,
} from "../model/workspace-to-data-source";
import { DataSourceType } from "../types/data-source";
import { getDataSourceTables } from "../utils/data-source-tables";
// import {
//   getGaAccountSummaries,
//   getGaColumns,
//   getGaSegments,
// } from "./google-analytics";

export const deleteDataSource = async ({ id, user }) => {
  const workspaceToDataSource = await getDataSourceToWorkspace(id);
  if (!workspaceToDataSource) {
    throw new ApolloError("Data source not found", "USER_INPUT_ERROR");
  }
  await checkWorkSpaceWriteAuthorization({
    user,
    workspaceId: workspaceToDataSource.workspace_id,
  });
  await Promise.all([
    DataSource.deleteDataSource(id),
    deleteDataSourceFromWorkspace({
      workspaceId: workspaceToDataSource.workspace_id,
      dataSourceId: id,
    }),
    deleteAllQueryOfADataSource(id),
  ]);
  return {
    id,
    success: true,
  };
};

const getGASchema = async (dataSource: any) => {
  const schema = {
    objects: [],
  };
  // const [accounts, columns, segments] = await Promise.all([
  //   getGaAccountSummaries(dataSource.refresh_token),
  //   getGaColumns(dataSource.refresh_token),
  //   getGaSegments(dataSource.refresh_token),
  // ]);
  const accounts = [];
  const columns = [];
  const segments = [];
  return {
    ...schema,
    accounts,
    columns,
    segments,
  };
};
const getHubSpotSchema = () => {
  const schema = {
    objects: getDataSourceTables(DataSourceType.HUB_SPOT),
  };
  return schema;
};
export const getDataSourceSchema = async ({ dataSourceId }) => {
  //TODO: check if the user has access to the data source
  const dataSource = await DataSource.get(dataSourceId);
  if (!dataSource) {
    throw new ApolloError("Data source not found", "USER_INPUT_ERROR");
  }
  const dataSourceWithOnlyRequiredFields = {
    id: String(dataSource.id),
    type: dataSource.type,
    tables: [],
    created_at: dataSource.created_at,
    updated_at: dataSource.updated_at,
  };
  let schema = {};
  if (dataSource.type === DataSourceType.HUB_SPOT) {
    schema = getHubSpotSchema();
  }
  if (dataSource.type === DataSourceType.GOOGLE_ANALYTICS) {
    schema = await getGASchema(dataSource);
  }
  return {
    data_source: dataSourceWithOnlyRequiredFields,
    schema,
  };
};

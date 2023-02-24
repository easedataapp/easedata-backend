import { DataSourceType } from "../types/data-source";
import { PostGrace, Table } from "../core/db-connection";

interface input {
  workspaceId: number;
  dataSourceId: DataSourceType;
}
export const addDataSourceToWorkspace = async (input: input) => {
  const { workspaceId, dataSourceId } = input;
  const results = await PostGrace.DB()
    .insert({
      workspace_id: workspaceId,
      data_source_id: dataSourceId,
    })
    .returning("*")
    .into(Table.WORKSPACE_TO_DATA_SOURCE);
  return results;
};

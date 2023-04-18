import { ApolloError } from "apollo-server-lambda";
import { PostGrace, Table } from "../core/db-connection";
import { DataSourceType } from "../types/data-source";

export type CreateOpts = {
  type: DataSourceType;
  access_token: string;
  refresh_token: string;
};

export async function create(opts: CreateOpts) {
  try {
    const { type, access_token, refresh_token } = opts;
    const results = await PostGrace.DB()
      .insert({
        type,
        access_token,
        refresh_token,
      })
      .returning("*")
      .into(Table.DATA_SOURCE);
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't create data source", "DBError");
  }
}

export async function getAllForAWorkspace(workspaceId) {
  try {
    const results = await PostGrace.DB()
      .select(
        "ds.id",
        "ds.type",
        "ds.access_token",
        "ds.refresh_token",
        "ds.created_at",
        "ds.updated_at"
      )
      .from("data_source as ds")
      .innerJoin(
        "workspace_to_data_source",
        "ds.id",
        "=",
        "workspace_to_data_source.data_source_id"
      )
      .where({ workspace_id: workspaceId });
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't find workspace", "DBError");
  }
}

export async function get(id) {
  try {
    const results = await PostGrace.DB()
      .select("*")
      .from(Table.DATA_SOURCE)
      .where({ id });
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't find data source", "DBError");
  }
}

export async function deleteDataSource(id) {
  try {
    const results = await PostGrace.DB()
      .delete()
      .from(Table.DATA_SOURCE)
      .where({ id });
    return results[0];
  } catch (error) {
    throw new ApolloError("Couldn't delete data source", "DBError");
  }
}

export * as DataSource from "./data-source";

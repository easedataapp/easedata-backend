import { ApolloError } from "apollo-server-lambda";
import { PostGrace } from "../core/db-connection";

export type CreateOpts = {
  name: string;
  description?: string;
  data_source_id: number;
  table_name: string;
  workspace_id: number;
  fields: string[];
};
export const create = async (opts: CreateOpts) => {
  try {
    const {
      name,
      description,
      data_source_id,
      table_name,
      workspace_id,
      fields,
    } = opts;
    const results = await PostGrace.DB()
      .insert({
        name,
        description,
        data_source_id,
        table_name,
        workspace_id,
        fields,
      })
      .returning("*")
      .into("query")
      .then((rows) => rows[0]);
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't create data query", "DBError");
  }
};

export const get = async (id: string) => {
  try {
    const results = await PostGrace.DB()
      .select("*")
      .from("query")
      .where({ id })
      .then((rows) => rows[0]);
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't get data query", "DBError");
  }
};

export const getDataQueriesOfAWorkspace = async (workspaceId: string) => {
  try {
    const results = await PostGrace.DB()
      .select("*")
      .from("query")
      .where({ workspace_id: workspaceId })
      .then((rows) => rows);
    return results;
  } catch (error) {
    throw new ApolloError("Couldn't get data query", "DBError");
  }
};

export * as DataQuery from "./query";

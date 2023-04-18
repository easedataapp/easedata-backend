import knex from "knex";

class SingletonDB {
  static db: any = null;

  static getInstance() {
    if (!SingletonDB.db) {
      SingletonDB.db = knex({
        client: "pg",
        connection: process.env.DATABASE_URL,
        pool: {
          min: 50,
          max: 100,
          createRetryIntervalMillis: 200,
          idleTimeoutMillis: 1000, //1 sec
          acquireTimeoutMillis: 10000, // 10 sec
          createTimeoutMillis: 10000, // 10 sec
        },
      });
    }
    return SingletonDB.db;
  }
}

export const DB = () => SingletonDB.getInstance();

export enum Table {
  USERS = "users",
  DATA_SOURCE = "data_source",
  WORKSPACE_TO_DATA_SOURCE = "workspace_to_data_source",
  WORKSPACE = "workspace",
  WORKSPACE_TO_USER = "workspace_to_users",
}

export * as PostGrace from "./db-connection";

import { DataSource } from "../model/data-source";
import { DataQuery } from "../model/query";
import { Workspace } from "../model/workspace";
import { UserForJWTGeneration } from "../types/user";
import { DataSourceType, HUB_SPOT_TABLES } from "../types/data-source";
import {
  getHubSpotCompanies,
  getHubSpotDeals,
  hubspotClient,
  makeObjectFromKeys,
  refreshAccessToken,
  _getHubSpotContacts,
} from "./hubspot";

interface DataQueryInput {
  user: UserForJWTGeneration;
  input: DataQuery.CreateOpts;
}
export const createQuery = async (data: DataQueryInput) => {
  const { user, input } = data;
  //TODO:keep the check if workspace exists otherwise throw error
  //TODO:only admin of the workspace can create a query keep this check here.
  const result = await DataQuery.create(input);
  return result;
};
interface GetQueryInput {
  id: number;
  user: UserForJWTGeneration;
}
interface GenericInput {
  user: UserForJWTGeneration;
  id: string;
}
export const getAQuery = async ({ id, user }: GenericInput) => {
  //TODO: keep the check if query exists otherwise throw error
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const result = await DataQuery.get(id);
  return result;
};

export const getDataQueriesOfAWorkspace = async ({
  id,
  user,
}: GenericInput) => {
  const workspace = await Workspace.getAWorkspace(id);
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const results = await DataQuery.getDataQueriesOfAWorkspace(id);
  return results;
};

const getFilteredObjects = async ({
  refreshToken,
  fields,
  filters,
  sort,
  table_name,
}) => {
  await refreshAccessToken(refreshToken);
  const filterGroup = {
    filters: filters.map((filter) => {
      const filterObj = {
        propertyName: filter.field,
        operator: filter.operator,
        value: filter.value,
      };
      return filterObj;
    }),
  };
  let stringifySort = "";
  //TODO:fix the sort not working as expected
  if (sort) {
    stringifySort = JSON.stringify({
      propertyName: sort.field,
      direction: sort.direction,
    });
  }
  //Here by default sending an empty query.
  const query = "";
  const limit = 100;
  const after = 0;

  const publicObjectSearchRequest = {
    filterGroups: [filterGroup],
    ...(stringifySort && { sorts: [stringifySort] }),
    query,
    properties: fields,
    limit,
    after,
  };
  const response = await hubspotClient.crm[table_name].searchApi.doSearch(
    //@ts-ignore
    publicObjectSearchRequest
  );
  return response.results.map((result) => {
    const onlyQueriedFields = makeObjectFromKeys(fields, result.properties);
    return onlyQueriedFields;
  });
};

export const executeQuery = async ({ user, input }) => {
  //TODO: keep the check if user is part of the workspace otherwise throw error
  const { data_source_id, table_name, fields, filters, sort } = input;
  const dataSource = await DataSource.get(data_source_id);
  if (dataSource.type === DataSourceType.HUB_SPOT) {
    //TODO:Enhancements. Ideally we can have only one function for all the tables but for now keeping it separate.
    if (table_name === HUB_SPOT_TABLES.CONTACTS) {
      if (filters?.length) {
        const filteredContacts = await getFilteredObjects({
          refreshToken: dataSource.refresh_token,
          fields,
          filters,
          sort,
          table_name,
        });
        return { data: filteredContacts };
      }
      const contacts = await _getHubSpotContacts({
        refreshToken: dataSource.refresh_token,
        fields,
      });
      return { data: contacts };
    }
    if (table_name === HUB_SPOT_TABLES.COMPANIES) {
      if (filters?.length) {
        const filterCompanies = await getFilteredObjects({
          refreshToken: dataSource.refresh_token,
          fields,
          filters,
          sort,
          table_name,
        });
        return { data: filterCompanies };
      }
      const companies = await getHubSpotCompanies({
        refreshToken: dataSource.refresh_token,
        fields,
      });
      return { data: companies };
    }
    if (table_name === HUB_SPOT_TABLES.DEALS) {
      if (filters?.length) {
        const filterDeals = await getFilteredObjects({
          refreshToken: dataSource.refresh_token,
          fields,
          filters,
          sort,
          table_name,
        });
        return { data: filterDeals };
      }
      const deals = await getHubSpotDeals({
        refreshToken: dataSource.refresh_token,
        fields,
      });
      return { data: deals };
    }
  }
  return [];
};

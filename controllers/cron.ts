import { ApolloError } from "apollo-server-lambda";
import { DataSource } from "../model/data-source";
import { DataQuery } from "../model/query";
import { populateGSheet } from "./gsheeet";
import { executeQuery, getHubSpotDataUsingRestAPICall } from "./query";
import { refreshAccessToken } from "./hubspot";
import axios from "axios";
type RunScheduleQueryArgs = {
  queryId: number | string;
  gSheetId: string;
};
const getAllPaginatedData = async (query) => {
  console.log(`Getting all paginated data`);
  let pageInfo;
  const data: any[] = [];
  const requestBody = {
    user: {},
    input: {
      data_source_id: query.data_source_id,
      table_name: query.table_name,
      fields: query.fields,
    },
    limit: 100,
    after: "0",
  };
  try {
    const response = await executeQuery(requestBody);
    pageInfo = response.page_info;
    data.push(...response.data);
    while (pageInfo?.has_next_page) {
      const result = await executeQuery({
        ...requestBody,
        after: pageInfo.end_cursor,
      });
      data.push(...result.data);
      pageInfo = result.page_info;
    }
    console.log("Got all Data:: ", data.length);
    return data;
  } catch (e) {
    console.log(`Error in getting all paginated data:: `, e);
    console.log(e);
    return [];
  }
};

export const runScheduleQuery = async (input: RunScheduleQueryArgs) => {
  console.log(`Running schedule query:: `, input);
  const { queryId, gSheetId } = input;
  // //TODO:some of these async calls can be made parallel for better performance.
  const query = await DataQuery.get(queryId as string);
  console.log(`Query:: `, query);
  const data = await getAllPaginatedData(query);
  console.log(`Data:: `, data?.length);
  const gsheetDataSource = await DataSource.getGSheetDataSourceOfAWorkspace(
    query.workspace_id
  );
  if (!gsheetDataSource) {
    throw new ApolloError(`No GSheet data source found for workspace`);
  }
  return await populateGSheet({
    data,
    gsheetId: gSheetId,
    gsheetOauthRefreshToken: gsheetDataSource.refresh_token,
  });
};

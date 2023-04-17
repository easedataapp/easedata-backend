import { google } from "googleapis";

import { verifyToken } from "../common/jwt";
import { DataSource } from "../model/data-source";
import { DataSourceType } from "./../types/data-source";
import { addDataSourceToWorkspace } from "../model/workspace-to-data-source";

const oauth2Client = new google.auth.OAuth2(
  process.env.GA_CLIENT_ID,
  process.env.GA_CLIENT_SECRET,
  process.env.GA_REDIRECT_URI
);
export async function handler(event, context, callback) {
  console.log({ qs: event?.queryStringParameters });
  const code = event?.queryStringParameters?.code;
  const state = JSON.parse(event.queryStringParameters.state);
  const user = verifyToken(state.token);
  //TODO: validate the workspaceId is valid and the "user" has access to it

  const { tokens } = await oauth2Client.getToken(code);
  const dataSourceRow = await DataSource.create({
    access_token: tokens.access_token as string,
    refresh_token: tokens.refresh_token as string,
    type: DataSourceType.GOOGLE_ANALYTICS,
  });
  console.log({ dataSourceRow });
  await addDataSourceToWorkspace({
    dataSourceId: dataSourceRow.id,
    workspaceId: state.workspaceId,
  });
  return {
    statusCode: 301,
    headers: { Location: process.env.REDIRECT_TO_DASHBOARD },
  };
}

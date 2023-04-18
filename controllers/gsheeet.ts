import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

const oauthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
});
const getAccessToken = async (refreshToken: string) => {
  const data = {
    client_id: process.env.GA_CLIENT_ID,
    client_secret: process.env.GA_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };
  const response = await axios.post(
    "https://oauth2.googleapis.com/token",
    data
  );
  oauthClient.setCredentials({
    access_token: response.data.access_token,
    refresh_token: refreshToken,
  });
  return response.data.access_token;
};
export const populateGSheet = async () => {
  const spreadsheetId = "1K341xHzbQcSvqcRyaI3hUD00SctWZ2818OvAU-oeGD0";
  await getAccessToken(
    "1//0gbgLToW5hojtCgYIARAAGBASNwF-L9Ir4j2b7Qi7eSXeCVwGH_IQT_aaBK2QPoToMbzke7whT8t0pJBM_8R3_movh0o4tP61ldw"
  );
  const doc = new GoogleSpreadsheet(spreadsheetId);
  doc.useOAuth2Client(oauthClient);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  // await sheet.setHeaderRow(["name", "email"]);
  const moreRows = await sheet.addRows([
    { name: "Sergey Brin", email: "sergey@google.com" },
    { name: "Eric Schmidt", email: "eric@google.com" },
  ]);
};

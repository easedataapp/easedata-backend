import axios from "axios";
import querystring from "querystring";
import { makeObjectFromKeys, refreshAccessToken } from "./hubspot";
import { getHubSpotDataUsingRestAPICall } from "./query";
import fs from "fs";

export const getNewAccessToken = async () => {
  const scope = ["offline_access", "Files.ReadWrite"].join(" ");
  const refreshToken =
    "M.R3_BL2.-CVruOSu!ArxT0QI9dvSyy3w1m0L0eSljZwr9dL!TZK9*sAqDZ!!m4xyfK99lfXhKezaEuap07edWzcIx6uGihB14r0!e61bpajrjW!VCNq346RWbvCjEN*j26ZkyIIIWh1GAvkrdhvnLUr0zQcw9WouiZ3mlR3hMuL7*xPEBiChXRMaYzgSaTQuIjgIHa0pxEWdcLKxeumiCuTWGbfMT4jtk0vkZtfPUqhnWmcTopTqG4UOt3LeVdE!M!QVCcfX2guTPrrqBEuDdTuoFE15IqncezQEKjxPXNXmjVh3RFtsp9ZuPNItPjIQONeLsLUPcEbckxGY0aV9!xL6h6c2SR*M$";
  const url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const formData = {
    scope,
    grant_type: "refresh_token",
    client_id: process.env.MS_CLIENT_ID,
    client_secret: process.env.MS_CLIENT_SECRET,
    redirect_uri: process.env.MS_REDIRECT_URI,
    refresh_token: refreshToken,
  };
  try {
    const result = await axios({
      method: "post",
      url: url,
      data: querystring.stringify(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return result.data.access_token;
  } catch (e) {
    console.log(e);
  }
};

export const getWorkBookId = async (msOfficeXLSheetURL: string) => {
  if (msOfficeXLSheetURL.includes("onedrive.live.com")) {
    const urlObj = new URL(msOfficeXLSheetURL);
    const workbookId = urlObj.searchParams.get("resid");
    return workbookId;
  }
  const accessToken = await getNewAccessToken();
  const urlObj = new URL(msOfficeXLSheetURL);
  const sourcedoc = urlObj.searchParams.get("sourcedoc");
  const fileId = sourcedoc?.slice(3, -3);
  const _filedId = "E8641F0A-DDC9-4511-99A5-58D914829B9A";
  console.log({ fileId });
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${_filedId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.id;
  } catch (e) {
    console.log(e);
  }
};

const fetchDataFromHubspot = async (fields) => {
  const hubspotRefreshToken = "d7677c45-bf22-459a-b17c-77e7eb037090";
  const accessToken = await refreshAccessToken(hubspotRefreshToken);
  const data = await getHubSpotDataUsingRestAPICall({
    accessToken,
    properties: fields,
  });
  const requiredFormatData = data.results.map((result) => {
    const primaryPropertiesObject = makeObjectFromKeys(
      fields,
      result.properties
    );
    return primaryPropertiesObject;
  });
  console.log(requiredFormatData);
  return requiredFormatData;
};

const getEndCellAddress = (data) => {
  const numRows = data.length;
  const numCols = Object.keys(data[0]).length;
  const endColLetter = String.fromCharCode("A".charCodeAt(0) + numCols - 1);
  const endCell = `${endColLetter}${numRows + 1}`;
  return { endCell, endColLetter };
};

const prepareDataForMSOfficeFormat = (data) => {
  const columns = Object.keys(data[0]);
  const { endCell, endColLetter } = getEndCellAddress(data);
  const values = [
    [...columns],
    ...data.map((item) => [...Object.values(item)]),
  ];
  return {
    values,
    range: `A1:${endCell}`,
    columnsRange: `A1:${endColLetter}1`,
  };
};
const colorCells = async ({ workbookId, range, accessToken }) => {
  const worksheetId = "Sheet1";
  const fillColor = "#8EA9DB";
  const response = await axios.patch(
    `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets('${worksheetId}')/range(address='${range}')/format/font`,
    { bold: true },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
};
export const populateDataToSheet = async (workbookId) => {
  const accessToken = await getNewAccessToken();
  const columns = ["firstname", "lastname", "email", "createdate"];
  const hubspotData = await fetchDataFromHubspot(columns);
  const { values, range, columnsRange } =
    prepareDataForMSOfficeFormat(hubspotData);
  const data = {
    values,
  };
  const worksheetId = "Sheet1";
  try {
    const response = await axios.patch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${workbookId}/workbook/worksheets/${worksheetId}/range(address='${range}')`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    await colorCells({
      workbookId,
      range: columnsRange,
      accessToken,
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

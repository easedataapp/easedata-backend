import { Client } from "@hubspot/api-client";
import { DataSource, getMostRecentDataSource } from "../model/data-source";
import { HUB_SPOT_TABLES } from "../types/data-source";
export const hubspotClient = new Client({
  numberOfApiCallRetries: 3,
});
export const refreshAccessToken = async (refreshToken: string) => {
  const data = await hubspotClient.oauth.tokensApi.createToken(
    "refresh_token",
    undefined,
    undefined,
    process.env.HUB_SPOT_CLIENT_ID,
    process.env.HUB_SPOT_CLIENT_SECRET,
    refreshToken
  );
  hubspotClient.setAccessToken(data.accessToken);
};
//TODO:Cleanup remove it not needed anymore
export const getHubSpotContacts = async (userId) => {
  const dataSource = await getMostRecentDataSource(userId);
  //ideally we can use the same access token un till it's not expired but here currently I am getting a new access token on each request.
  await refreshAccessToken(dataSource.refresh_token);
  const limit = 100;
  const after = "0";
  const properties = ["createdate", "firstname", "lastname"];
  const data = await hubspotClient.crm.contacts.basicApi.getPage(
    limit,
    after,
    properties
  );
  const requiredFormatData = data.results.map((result) => {
    const { createdate, firstname, lastname } = result.properties;
    const primaryPropertiesObject = {
      created_at: createdate,
      first_name: firstname,
      last_name: lastname,
    };
    return primaryPropertiesObject;
  });
  return requiredFormatData;
};
export const makeObjectFromKeys = (keys, values) => {
  const obj = {};
  keys.forEach((key) => {
    obj[key] = values[key];
  });
  return obj;
};
export const _getHubSpotContacts = async ({ refreshToken, fields }) => {
  //ideally we can use the same access token un till it's not expired but here currently I am getting a new access token on each request.
  await refreshAccessToken(refreshToken);
  const limit = 100;
  const after = "0";
  const data = await hubspotClient.crm.contacts.basicApi.getPage(
    limit,
    after,
    fields
  );
  const requiredFormatData = data.results.map((result) => {
    const primaryPropertiesObject = makeObjectFromKeys(
      fields,
      result.properties
    );
    return primaryPropertiesObject;
  });
  return requiredFormatData;
};
export const getHubSpotCompanies = async ({ refreshToken, fields }) => {
  //ideally we can use the same access token un till it's not expired but here currently I am getting a new access token on each request.
  await refreshAccessToken(refreshToken);
  const limit = 100;
  const after = "0";
  const data = await hubspotClient.crm.companies.basicApi.getPage(
    limit,
    after,
    fields
  );
  const requiredFormatData = data.results.map((result) => {
    const primaryPropertiesObject = makeObjectFromKeys(
      fields,
      result.properties
    );
    return primaryPropertiesObject;
  });
  return requiredFormatData;
};
export const getHubSpotDeals = async ({ refreshToken, fields }) => {
  //ideally we can use the same access token un till it's not expired but here currently I am getting a new access token on each request.
  await refreshAccessToken(refreshToken);
  const limit = 100;
  const after = "0";
  const data = await hubspotClient.crm.deals.basicApi.getPage(
    limit,
    after,
    fields
  );
  const requiredFormatData = data.results.map((result) => {
    const primaryPropertiesObject = makeObjectFromKeys(
      fields,
      result.properties
    );
    return primaryPropertiesObject;
  });
  return requiredFormatData;
};

type InputType = {
  objectName: HUB_SPOT_TABLES;
  dataSourceId: string;
};
const getFieldDataType = (type) => {
  switch (type) {
    case "string":
      return "TEXT";
    case "number":
      return "NUMBER";
    case "datetime":
      return "DATE";
    default:
      return "TEXT";
  }
};
export const getAllImportantObjectProperties = async ({
  objectName,
  dataSourceId,
}: InputType) => {
  const dataSource = await DataSource.get(dataSourceId);
  await refreshAccessToken(dataSource.refresh_token);
  const data = await hubspotClient.crm.properties.coreApi.getAll(objectName);
  if (objectName === HUB_SPOT_TABLES.DEALS) {
    //In case of deals I am sending all properties because I am not sure which properties are important.
    const importantProperties = data.results
      .sort((a, b) => {
        if (!a?.displayOrder || !b?.displayOrder) return 0;
        return b.displayOrder - a.displayOrder;
      })
      .map((result) => {
        return {
          name: result.name,
          label: result.label,
          data_type: getFieldDataType(result.type),
        };
      });
    return importantProperties;
  }
  //TODO:this can be optimized
  const importantProperties = data.results
    .filter((result) => {
      return result.formField === true || result.name === "createdate";
    })
    .sort((a, b) => {
      if (!a?.displayOrder || !b?.displayOrder) return 0;
      return b.displayOrder - a.displayOrder;
    })
    .map((result) => {
      return {
        name: result.name,
        label: result.label,
        data_type: getFieldDataType(result.type),
      };
    });
  return importantProperties;
};

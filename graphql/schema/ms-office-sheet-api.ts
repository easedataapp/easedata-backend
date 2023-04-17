import { gql } from "apollo-server-lambda";

const msOfficeSheetAPITypeDef = gql`
  type Mutation {
    msOfficeSheetAPI: OfficeSheetAPIResponse!
  }

  type OfficeSheetAPIResponse {
    status: String
  }
`;

export default msOfficeSheetAPITypeDef;

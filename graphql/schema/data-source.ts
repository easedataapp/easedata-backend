import { gql } from "apollo-server-lambda";

/*TODO: Define a proper type for date Reference the below docs 
https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/ 
*/
const DataSourceTypeDef = gql`
  type Query {
    getDataSourceTableFields(input: GetDataSourceTableFieldsInput!): [Field!]!
  }
  type DataSource {
    id: ID!
    type: String!
    tables: [Table!]!
    created_at: String!
    updated_at: String!
  }
  type Table {
    name: String!
    label: String!
  }
  input GetDataSourceTableFieldsInput {
    data_source_id: ID!
    table_name: String!
  }
  type Field {
    name: String!
    label: String!
    data_type: DataType!
  }
  enum DataType {
    TEXT
    NUMBER
    DATE
  }
`;

export default DataSourceTypeDef;

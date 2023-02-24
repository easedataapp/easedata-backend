import { getAllImportantObjectProperties } from "../../controllers/hubspot";

export const DataSourceResolver = {
  Query: {
    getDataSourceTableFields: async (_parent, args, ctx, _info) => {
      ctx.assertAuthenticated();
      const fields = await getAllImportantObjectProperties({
        objectName: args.input.table_name,
        dataSourceId: args.input.data_source_id,
      });
      return fields;
    },
  },
};

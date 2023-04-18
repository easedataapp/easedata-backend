import {
  createQuery,
  executeQuery,
  getAQuery,
  getDataQueriesOfAWorkspace,
  scheduleQuery,
} from "../../controllers/query";

export const DataQueryResolver = {
  Query: {
    getDataQuery: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const query = await getAQuery({
        id: _args.id,
        user,
      });
      return query;
    },
    listAllDataQueriesOfAWorkspace: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const dataQueries = await getDataQueriesOfAWorkspace({
        id: _args.workspaceId,
        user,
      });
      return dataQueries;
    },
    executeQuery: async (_parent, args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      return await executeQuery({
        user,
        input: args.input,
        limit: args?.limit,
        after: args?.after,
      });
    },
  },
  Mutation: {
    createDataQuery: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const createdQuery = await createQuery({
        user,
        input: _args.input,
      });
      return createdQuery;
    },
    scheduleQuery: async (_parent, _args, ctx, _info) => {
      const user = ctx.assertAuthenticated();
      const scheduledQuery = await scheduleQuery({
        user,
        input: _args.input,
      });
      return scheduledQuery;
    },
  },
};

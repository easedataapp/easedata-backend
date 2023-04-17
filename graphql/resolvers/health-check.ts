export const HealthCheckResolver = {
  Query: {
    health: async (_parent, _args, _ctx) => {
      const getEndCellAddress = (data) => {
        const numRows = data.length;
        const numCols = Object.keys(data[0]).length;
        const endColLetter = String.fromCharCode(
          "A".charCodeAt(0) + numCols - 1
        );
        const endCell = `${endColLetter}${numRows + 1}`;
        return endCell;
      };
      getEndCellAddress([
        {
          firstname: "Shadab",
          lastname: "Alam",
          email: "shadabsaharsa@gmail.com",
        },
        { firstname: "Test", lastname: "last", email: "test1@gmail.com" },
        {
          firstname: "Shafaque",
          lastname: "Perween",
          email: "something@gmail.com",
        },
        {
          firstname: "Faisal",
          lastname: "Ahmad",
          email: "faisalahmad@gmail.com",
        },
        {
          firstname: "Sabir",
          lastname: "Vibes",
          email: "shadab14meb346@gmail.com",
        },
        {
          firstname: "Megan",
          lastname: "Liell",
          email: "mliellhf@tuttocitta.it",
        },
        { firstname: "Rhodia", lastname: "Jay", email: "rjay1w@salon.com" },
        {
          firstname: "Locke",
          lastname: "Storrock",
          email: "lstorrockj5@usnews.com",
        },
        {
          firstname: "Ede",
          lastname: "Bonnin",
          email: "ebonninov@answers.com",
        },
        {
          firstname: "Bobinette",
          lastname: "Godwyn",
          email: "bgodwyni5@canalblog.com",
        },
      ]);
      return {
        status: "OK",
      };
    },
  },
};

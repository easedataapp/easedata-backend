import {
  getWorkBookId,
  populateDataToSheet,
} from "../../controllers/ms-office-xl";

export const MSOfficeSheetAPIResolver = {
  Mutation: {
    msOfficeSheetAPI: async (_parent, _args, ctx) => {
      const user = ctx.assertAuthenticated();
      const workbookId = await getWorkBookId(
        "https://onedrive.live.com/edit.aspx?action=editnew&resid=A6BDA95AA8BA5E40!152&ithint=file%2cxlsx&action=editnew&ct=1681383737201&wdNewAndOpenCt=1681383737201&wdPreviousSession=07caa808-9720-4371-a07c-f2232d2689a3&wdOrigin=OFFICECOM-WEB.MAIN.NEW"
      );
      await populateDataToSheet(workbookId);
      return {
        status: "sheet api",
      };
    },
  },
};

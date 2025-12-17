import { NextRequest } from "next/server";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import { CoreSheetData, CoreSheetName } from "@/types/coreSheet";

class GoogleService {
  private _sheetId = process.env.APP_SHEET_ID || "";
  private _sheetNames: CoreSheetName[] = [
    CoreSheetName.ADVANCERS,
    CoreSheetName.PLANNERS,
    CoreSheetName.ORGANIZERS,
    CoreSheetName.STAFF,
    CoreSheetName.LOGISTIC_SUPPORT,
  ];
  async getCoreSheet(req: NextRequest) {
    try {
      const googleAuth = await getGoogleAuth(req);
      const sheets = google.sheets({ version: "v4", auth: googleAuth });
      const existingSheets = await this._filterExistingSheets(
        this._sheetNames,
        googleAuth
      );
      if (existingSheets.length === 0) {
        return [];
      }
      const res = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: this._sheetId,
        ranges: existingSheets,
      });

      const parsedData = this._parseSheetData(res.data.valueRanges || []);
      return parsedData;
    } catch (error) {
      console.error("Error in getCoreSheet:", error);
      throw error;
    }
  }

  private _parseSheetData(data: any): CoreSheetData {
    const parsedData: CoreSheetData = {};
    data.forEach((range: any) => {
      const sheetName = range.range.split("!")[0];
      const coreSheetName = this._sheetNames.find(
        (name) =>
          name.toLowerCase().trim() ===
          sheetName.replaceAll("'", "").toLowerCase().trim()
      );
      if (coreSheetName) {
        parsedData[coreSheetName] = {
          headers: range.values[0],
          values: range.values.slice(1),
        };
      }
    });
    return parsedData;
  }

  private async _filterExistingSheets(sheets: string[], googleAuth: any) {
    const sheetsApi = google.sheets({ version: "v4", auth: googleAuth });
    const res = await sheetsApi.spreadsheets.get({
      spreadsheetId: this._sheetId,
    });

    const existingSheetTitles =
      res.data.sheets?.map((sheet) =>
        sheet.properties?.title?.trim().toLowerCase()
      ) || [];

    return sheets.filter((sheet) =>
      existingSheetTitles.includes(sheet.toLowerCase())
    );
  }
}

export const googleService = new GoogleService();

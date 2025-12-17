import { NextRequest } from "next/server";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";

class GoogleService {
  private _sheetId = process.env.APP_SHEET_ID || "";
  private _sheetNames = [
    "advancers",
    "planners",
    "organizers",
    "staff",
    "logistic support",
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

      return res.data.valueRanges;
    } catch (error) {
      console.error("Error in getCoreSheet:", error);
      throw error;
    }
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

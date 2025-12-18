import { NextRequest } from "next/server";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import {
  CoreSheetData,
  coreSheetHeaders,
  CoreSheetName,
} from "@/types/coreSheet";

class GoogleService {
  private _sheetId = process.env.APP_SHEET_ID || "";
  private _sheetNames: CoreSheetName[] = [
    CoreSheetName.ADVANCERS,
    CoreSheetName.PLANNERS,
    CoreSheetName.ORGANIZERS,
    CoreSheetName.STAFF,
    CoreSheetName.LOGISTIC_SUPPORT,
  ];
  private _isInitilizingSheets = false;
  async getCoreSheet(req: NextRequest) {
    try {
      console.log("Getting core sheets from Google Sheets");
      const googleAuth = await getGoogleAuth(req);
      const sheets = google.sheets({ version: "v4", auth: googleAuth });
      const existingSheets = await this._filterExistingSheets(
        this._sheetNames,
        googleAuth
      );
      await this._generateMissingSheets(existingSheets, googleAuth);
      if (this._isInitilizingSheets) {
        console.log(
          "Sheet initialization in progress. Please try again later."
        );
        return {};
      }
      const res = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: this._sheetId,
        ranges: this._sheetNames,
      });

      const parsedData = this._parseSheetData(res.data.valueRanges || []);
      return parsedData;
    } catch (error) {
      console.error("Error in getCoreSheet:", error);
      throw error;
    }
  }

  private async _generateMissingSheets(
    existingSheets: string[],
    googleAuth: any
  ) {
    try {
      if (this._isInitilizingSheets) {
        console.log("Sheet initialization already in progress. Skipping...");
        return;
      }
      const missingSheets = this._sheetNames.filter(
        (sheet) => !existingSheets.includes(sheet.toLowerCase())
      );
      if (missingSheets.length === 0) return;
      this._isInitilizingSheets = true;
      console.log("Generating missing sheets:", missingSheets);
      const sheetsApi = google.sheets({ version: "v4", auth: googleAuth });
      const requests = missingSheets.map((sheet) => ({
        addSheet: {
          properties: {
            title: sheet,
          },
        },
      }));

      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId: this._sheetId,
        requestBody: {
          requests,
        },
      });

      for (const sheet of missingSheets) {
        console.log("Initializing headers for sheet:", sheet);
        await sheetsApi.spreadsheets.values.append({
          spreadsheetId: this._sheetId,
          range: `${sheet}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [coreSheetHeaders[sheet as CoreSheetName]],
          },
        });
      }

      this._isInitilizingSheets = false;
      console.log("Finished generating missing sheets.");
    } catch (error) {
      console.error("Error in _generateMissingSheets:", error);
      this._isInitilizingSheets = false;
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
        const mappedData = range.values.slice(1).map((row: any[]) => {
          const rowData: { [key: string]: any } = {};
          range.values[0].forEach((header: string, index: number) => {
            rowData[header] = row[index];
          });
          return rowData;
        });
        parsedData[coreSheetName] = {
          headers: range.values[0],
          values: range.values.slice(1),
          mappedData,
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

import { NextRequest } from "next/server";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import {
  CoreSheetData,
  coreSheetHeaders,
  CoreSheetName,
} from "@/types/coreSheet";
import crypto from "crypto";

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
  private _isBackfillingIds = false;

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
      await this._backFillMissingIds(googleAuth);
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
  /**
   * method will backfill all ids if any ids are missing in the core sheets
   * simplest way to handle it vs backfilling only missing ids
   * @param sheetDataValueRanges
   * @param googleAuth
   * @returns
   */
  private async _backFillMissingIds(googleAuth: any) {
    try {
      const sheetsApi = google.sheets({ version: "v4", auth: googleAuth });
      const res = await sheetsApi.spreadsheets.values.batchGet({
        spreadsheetId: this._sheetId,
        ranges: this._sheetNames,
      });
      if (!res.data.valueRanges) return;
      if (res.data.valueRanges.length === 0) return;
      const missingIdRangeData = [];
      for (const rangeData of res.data.valueRanges) {
        const values = rangeData.values || [];
        const foundIds: Map<string, boolean> = new Map();
        for (let value of values) {
          const id = value[0];
          if (foundIds.has(id)) {
            // if duplicate id, consider it missing and regenerate ids for the whole sheet
            console.log("Duplicate ID found", rangeData.range, id);
            missingIdRangeData.push({ rangeData });
          }
          if (id === undefined || id === null || id === "") {
            console.log("Missing ID found", rangeData.range);
            missingIdRangeData.push({ rangeData });
          } else {
            foundIds.set(id, true);
          }
        }
      }
      if (missingIdRangeData.length === 0) return;
      if (this._isBackfillingIds) {
        console.log("Backfilling IDs already in progress. Skipping...");
        return;
      }
      this._isBackfillingIds = true;
      console.log("Backfilling missing IDs", this._isBackfillingIds);
      for (const { rangeData } of missingIdRangeData) {
        if (!rangeData.values) continue;
        const updatedValues = rangeData.values.map(
          (row: any[], index: number) => {
            if (index === 0) return row; // skip header row
            row[0] = crypto.randomUUID();
            return row;
          }
        );
        await sheetsApi.spreadsheets.values.update({
          spreadsheetId: this._sheetId,
          range: rangeData.range as string,
          valueInputOption: "RAW",
          requestBody: {
            values: updatedValues,
          },
        });
      }
      this._isBackfillingIds = false;
      console.log("Finished backfilling missing IDs");
    } catch (error) {
      console.error("Error in _backFillMissingIds:", error);
      this._isBackfillingIds = false;
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

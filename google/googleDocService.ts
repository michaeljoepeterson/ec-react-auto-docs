import { SampleDocData } from "@/types/sampleDoc";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import { NextRequest } from "next/server";
import { get } from "http";

class GoogleDocService {
  private _baseDocName = "Leader’s Itinerary";
  async createSampleDoc(req: NextRequest, docData: SampleDocData) {
    const googleAuth = await getGoogleAuth(req);
    const drive = google.drive({
      version: "v3",
      auth: googleAuth,
    });
    const evenDate = new Date(docData.eventDate);

    let name = `${this._baseDocName} - ${evenDate.toDateString()}`;

    let hasDoc = await this.checkExistingDoc(name, googleAuth);
    let version = 1;
    while (hasDoc) {
      version++;
      const newName = `${name} - V${version}`;
      console.log("Checking for existing doc with name:", newName);
      hasDoc = await this.checkExistingDoc(newName, googleAuth);
      if (!hasDoc) {
        name = newName;
        break;
      }
    }

    const res = await drive.files.create({
      requestBody: {
        name: name,
        mimeType: "application/vnd.google-apps.document",
        parents: [process.env.FOLDER_ID || ""],
      },
    });

    const id = res.data.id;
    if (id) {
      await this.formatDocument(req, id, docData, googleAuth);
    }
    return { id, name };
  }

  async checkExistingDoc(title: string, auth: any) {
    const drive = google.drive({ version: "v3", auth });
    const escapedTitle = title.replace(/'/g, "\\'");

    const res = await drive.files.list({
      q: [
        `'${process.env.FOLDER_ID}' in parents`,
        `name = '${escapedTitle}'`,
        `mimeType = 'application/vnd.google-apps.document'`,
        `trashed = false`,
      ].join(" and "),
      fields: "files(id, name, parents)",
      spaces: "drive",
    });

    return res.data.files && res.data.files.length > 0;
  }

  async formatDocument(
    req: NextRequest,
    docId: string,
    docData: SampleDocData,
    auth: any
  ) {
    try {
      console.log("Formatting document with ID:", docId);
      const googleAuth = await getGoogleAuth(req);
      const docs = google.docs({
        version: "v1",
        auth: googleAuth,
      });

      const doc = await docs.documents.get({
        auth,
        documentId: docId,
      });

      const requests: any[] = [];
      const docHeadingText = `Event Date: ${new Date(
        docData.eventDate
      ).toDateString()}\n`;
      requests.push({
        insertText: {
          location: {
            index: 1,
          },
          text: docHeadingText,
        },
      });

      const tableStartIndex = docHeadingText.length + 1;
      const tableRows = 3;
      const tableColumns = 3;

      requests.push({
        insertTable: {
          rows: tableRows,
          columns: tableColumns,
          location: {
            index: tableStartIndex,
          },
        },
      });
      // likely wont work due to working with indexes in doc

      //   requests.push({
      //     insertText: {
      //       location: {
      //         index: this.getTableCellIndex(tableStartIndex, tableColumns, 0, 2),
      //       },
      //       text: "Phone",
      //     },
      //   });

      //   requests.push({
      //     insertText: {
      //       location: {
      //         index: this.getTableCellIndex(tableStartIndex, tableColumns, 0, 1),
      //       },
      //       text: "Email",
      //     },
      //   });

      //   requests.push({
      //     insertText: {
      //       location: {
      //         index: this.getTableCellIndex(tableStartIndex, tableColumns, 0, 0),
      //       },
      //       text: "Name",
      //     },
      //   });

      // Add more formatting requests based on docData as needed

      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: requests,
        },
      });
    } catch (error) {
      console.error("Error formatting document:", error);
      throw error;
    }
  }

  getTableCellIndex(
    tableStart: number,
    columns: number,
    row: number,
    col: number
  ) {
    return tableStart + 1 + (row * columns + col) * 2;
  }
}

export const googleDocService = new GoogleDocService();

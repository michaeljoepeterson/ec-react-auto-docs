import { SampleDocData } from "@/types/sampleDoc";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import { NextRequest } from "next/server";
class GoogleDocService {
  private _baseDocName = "Leader’s Itinerary";
  private _baseTemplateName = "EC Template";

  /**
   * base creation of the sample doc using the template and filling in data
   * @param req
   * @param docData
   * @returns
   */
  async createSampleDoc(req: NextRequest, docData: SampleDocData) {
    const googleAuth = await getGoogleAuth(req);
    const templateFileId = await this.getTemplateFileId(googleAuth);
    if (templateFileId == null) {
      throw new Error("Template file not found");
    }
    let name = this.getTitleName(docData);

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

    const id = await this.copyTemplate(templateFileId, name, googleAuth);
    if (id) {
      await this.formatDocFromTemplate(id, docData, googleAuth);
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

  async getTemplateFileId(auth: any) {
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      q: [
        `'${process.env.FOLDER_ID}' in parents`,
        `name = '${this._baseTemplateName}'`,
        `mimeType = 'application/vnd.google-apps.document'`,
        `trashed = false`,
      ].join(" and "),
      fields: "files(id, name, parents)",
      spaces: "drive",
    });

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id;
    }
    return null;
  }

  async copyTemplate(templateId: string, newName: string, auth: any) {
    console.log(
      "Copying template ID:",
      templateId,
      "to new document:",
      newName
    );
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.copy({
      auth,
      fileId: templateId,
      requestBody: {
        name: newName,
        mimeType: "application/vnd.google-apps.document",
        parents: [process.env.FOLDER_ID || ""],
      },
    });

    // Returns the new document ID
    return res.data.id;
  }

  async formatDocFromTemplate(
    copiedTemplateId: string,
    docData: SampleDocData,
    auth: any
  ) {
    const titleSelector = "{{title}}";
    console.log("Formatting document from template ID:", copiedTemplateId);
    const docs = google.docs({
      version: "v1",
      auth,
    });
    let name = this.getTitleName(docData);
    console.log("Setting document title to:", name);
    await docs.documents.batchUpdate({
      auth,
      documentId: copiedTemplateId,
      requestBody: {
        requests: [
          {
            replaceAllText: {
              containsText: { text: titleSelector, matchCase: true },
              replaceText: name,
            },
          },
        ],
      },
    });
  }

  getTitleName(docData: SampleDocData) {
    const evenDate = new Date(docData.eventDate);
    return `${this._baseDocName} - ${evenDate.toDateString()}`;
  }
}

export const googleDocService = new GoogleDocService();

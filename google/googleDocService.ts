import { SampleDocData } from "@/types/sampleDoc";
import { getGoogleAuth } from "./auth";
import { google } from "googleapis";
import { NextRequest } from "next/server";
import { PersonType } from "@/types/coreSheet";
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
    const plannerFullSelector = "{{planner_full}}";
    const advanceFullSelector = "{{advance_full}}";
    const organizerFullSelector = "{{organizer_full}}";
    const staffFullSelector = "{{staff_full}}";
    const logisticFullSelector = "{{logistic_support_full}}";

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
              containsText: { text: titleSelector },
              replaceText: name,
            },
          },
          {
            replaceAllText: {
              containsText: { text: plannerFullSelector },
              replaceText: this.formatPersonFull(docData.selectedPlanner),
            },
          },
          {
            replaceAllText: {
              containsText: { text: advanceFullSelector },
              replaceText: this.formatPersonFull(docData.selectedAdvancer),
            },
          },
          {
            replaceAllText: {
              containsText: { text: organizerFullSelector },
              replaceText: this.formatPersonFull(docData.selectedOrganizer),
            },
          },
          {
            replaceAllText: {
              containsText: { text: staffFullSelector },
              replaceText: this.formatPersonFull(docData.selectedStaff),
            },
          },
          {
            replaceAllText: {
              containsText: { text: logisticFullSelector },
              replaceText: this.formatPersonFull(
                docData.selectedLogisticSupport
              ),
            },
          },
          {
            replaceAllText: {
              containsText: { text: "{{test_name}}" },
              replaceText: "This is a test name",
            },
          },
          {
            replaceAllText: {
              containsText: { text: "{{test_email}}" },
              replaceText: "This is a test email",
            },
          },
          {
            replaceAllText: {
              containsText: { text: "{{test_phone}}" },
              replaceText: "This is a test phone",
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

  formatPersonFull(person: PersonType) {
    if (!person) return "N/A";
    return `${person.name} (${person.phone}); ${person.email}`;
  }
}

export const googleDocService = new GoogleDocService();

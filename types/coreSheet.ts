export enum CoreSheetName {
  ADVANCERS = "advancers",
  PLANNERS = "planners",
  ORGANIZERS = "organizers",
  STAFF = "staff",
  LOGISTIC_SUPPORT = "logistic support",
}

export interface CoreSheetData {
  [key: string]: CoreSheetRawData;
}

export interface CoreSheetRawData {
  headers: string[];
  values: any[][];
  // todo potentially type mappedData more strictly
  mappedData: any[];
}

/**
 * Represents a person in the core sheet.
 */
export interface PersonType {
  name: string;
  id: string;
  email: string;
  phone: string;
}

export const basicUserHeaders = ["id", "name", "email", "phone"];

export const coreSheetHeaders = {
  [CoreSheetName.ADVANCERS]: [...basicUserHeaders],
  [CoreSheetName.PLANNERS]: [...basicUserHeaders],
  [CoreSheetName.ORGANIZERS]: [...basicUserHeaders],
  [CoreSheetName.STAFF]: [...basicUserHeaders],
  [CoreSheetName.LOGISTIC_SUPPORT]: [...basicUserHeaders],
};

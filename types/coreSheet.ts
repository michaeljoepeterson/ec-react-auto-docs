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
  mappedData: { [key: string]: any }[];
}

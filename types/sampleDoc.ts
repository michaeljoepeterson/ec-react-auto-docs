import { PersonType } from "./coreSheet";

export interface SampleDocData {
  selectedPlanner: PersonType;
  selectedAdvancer: PersonType;
  selectedOrganizer: PersonType;
  selectedStaff: PersonType;
  selectedLogisticSupport: PersonType;
  eventDate: Date;
  weatherData?: any;
  addressData?: AddressData;
}

export interface AddressData {
  formattedAddress: string;
  city?: string;
  province?: string;
  lat?: number;
  lng?: number;
}

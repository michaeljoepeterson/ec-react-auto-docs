import { useState } from "react";
import AppSelect from "../core/SheetSelect";
import { CoreSheetData, PersonType } from "@/types/coreSheet";
import { Button } from "@mui/material";
import { AddressData, SampleDocData } from "@/types/sampleDoc";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import AppMap from "../maps/AppMap";

const CreateECDocForm = ({
  sheetData,
  onSubmit,
}: {
  sheetData: CoreSheetData;
  onSubmit: (event: SampleDocData) => void;
}) => {
  const [selectedPlanner, setSelectedPlanner] = useState<string>("");
  const [selectedAdvancer, setSelectedAdvancer] = useState<string>("");
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedLogisticSupport, setSelectedLogisticSupport] =
    useState<string>("");
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = mapSubmitData();
    onSubmit(submitData);
  };

  const mapSubmitData = (): SampleDocData => {
    const allPeople = [
      ...sheetData.planners.mappedData,
      ...sheetData.advancers.mappedData,
      ...sheetData.organizers.mappedData,
      ...sheetData.staff.mappedData,
      ...sheetData["logistic support"].mappedData,
    ];

    return {
      selectedPlanner: allPeople.find((p) => p.id === selectedPlanner) || null,
      selectedAdvancer:
        allPeople.find((p) => p.id === selectedAdvancer) || null,
      selectedOrganizer:
        allPeople.find((p) => p.id === selectedOrganizer) || null,
      selectedStaff: allPeople.find((p) => p.id === selectedStaff) || null,
      selectedLogisticSupport:
        allPeople.find((p) => p.id === selectedLogisticSupport) || null,
      eventDate: eventDate ? new Date(eventDate.toISOString()) : new Date(),
      addressData: addressData || undefined,
    };
  };

  const handleGeocode = (event: any) => {
    console.log("Map clicked at parent: ", event);
    const formattedAddress = event.formatted_address || "";
    const cityComponent = event.address_components.find((comp: any) =>
      comp.types.includes("locality")
    );
    const provinceComponent = event.address_components.find((comp: any) =>
      comp.types.includes("administrative_area_level_1")
    );
    const city = cityComponent ? cityComponent.long_name : "";
    const province = provinceComponent ? provinceComponent.short_name : "";
    const lat = event.lat;
    const lng = event.lng;

    setAddressData({
      formattedAddress,
      city,
      province,
      lat,
      lng,
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <AppMap onGeoCodeResult={handleGeocode} title="Select Location" />
      </div>
      <div>
        <DatePicker
          className="w-full md:w-1/2"
          value={eventDate}
          onChange={setEventDate}
        />
      </div>
      <div className="w-full grid gap-4 md:grid-cols-2">
        <AppSelect
          label="Planner"
          value={selectedPlanner}
          onChange={setSelectedPlanner}
          required={true}
          options={
            sheetData?.planners?.mappedData.map((planner: PersonType) => ({
              label: planner.name,
              value: planner.id,
            })) || []
          }
        />
        <AppSelect
          label="Advancers"
          value={selectedAdvancer}
          onChange={setSelectedAdvancer}
          required={true}
          options={
            sheetData?.advancers?.mappedData.map((planner: PersonType) => ({
              label: planner.name,
              value: planner.id,
            })) || []
          }
        />
        <AppSelect
          label="Organizers"
          value={selectedOrganizer}
          onChange={setSelectedOrganizer}
          required={true}
          options={
            sheetData?.organizers?.mappedData.map((planner: PersonType) => ({
              label: planner.name,
              value: planner.id,
            })) || []
          }
        />
        <AppSelect
          label="Staff"
          value={selectedStaff}
          onChange={setSelectedStaff}
          options={
            sheetData?.staff?.mappedData.map((planner: PersonType) => ({
              label: planner.name,
              value: planner.id,
            })) || []
          }
        />
        <AppSelect
          label="Logistic Support"
          value={selectedLogisticSupport}
          onChange={setSelectedLogisticSupport}
          required={true}
          options={
            sheetData?.["logistic support"]?.mappedData.map(
              (planner: PersonType) => ({
                label: planner.name,
                value: planner.id,
              })
            ) || []
          }
        />
      </div>
      <div>
        <Button variant="contained" type="submit">
          Create Document
        </Button>
      </div>
    </form>
  );
};

export default CreateECDocForm;

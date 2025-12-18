import { useState } from "react";
import AppSelect from "../core/SheetSelect";
import { CoreSheetData, PersonType } from "@/types/coreSheet";
import { Button } from "@mui/material";
import { SampleDocData } from "@/types/sampleDoc";

const CreateECDocForm = ({
  sheetData,
  onSubmit,
}: {
  sheetData: CoreSheetData;
  onSubmit: ({
    selectedPlanner,
    selectedAdvancer,
    selectedOrganizer,
    selectedStaff,
    selectedLogisticSupport,
  }: SampleDocData) => void;
}) => {
  const [selectedPlanner, setSelectedPlanner] = useState<string>("");
  const [selectedAdvancer, setSelectedAdvancer] = useState<string>("");
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedLogisticSupport, setSelectedLogisticSupport] =
    useState<string>("");

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
    };
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
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
      <div className="mt-4">
        <Button variant="contained" type="submit">
          Create Document
        </Button>
      </div>
    </form>
  );
};

export default CreateECDocForm;

"use client";

import AppSelect from "@/components/core/SheetSelect";
import { CoreSheetData } from "@/types/coreSheet";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [sheetData, setSheetData] = useState<CoreSheetData | null>(null);
  const [selectedPlanner, setSelectedPlanner] = useState<string>("");

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch("/api/drive/core-sheet", {
          next: {
            revalidate: 60,
          },
        });
        const data = await response.json();
        setSheetData(data.data);
        console.log("Fetched Sheet Data:", data.data);
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      }
    };

    fetchSheetData();
  }, []);

  return (
    <div>
      <h1>Sample Document Creation</h1>
      {selectedPlanner}
      <form>
        <AppSelect
          label="Planner"
          value={selectedPlanner}
          onChange={setSelectedPlanner}
          options={
            sheetData?.planners?.mappedData.map((planner) => ({
              label: planner.name,
              value: planner.id,
            })) || []
          }
        />
      </form>
    </div>
  );
};

export default HomePage;

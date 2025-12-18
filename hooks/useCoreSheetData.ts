import { CoreSheetData } from "@/types/coreSheet";
import { useState, useEffect } from "react";

const useCoreSheetData = () => {
  const [sheetData, setSheetData] = useState<CoreSheetData | null>(null);

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

  return { sheetData };
};

export default useCoreSheetData;

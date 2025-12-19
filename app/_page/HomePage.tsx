"use client";
import CreateECDocForm from "@/components/forms/CreateECDocForm";
import { useNotification } from "@/context/NotificationProvider";
import { googleClientWeatherService } from "@/google/googleWeatherService";
import useCoreSheetData from "@/hooks/useCoreSheetData";
import { SampleDocData } from "@/types/sampleDoc";
import { useState } from "react";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const { sheetData } = useCoreSheetData();
  const { notifyMessage } = useNotification();

  const createDoc = async (values: SampleDocData) => {
    console.log("Creating document...", values);
    setLoading(true);
    try {
      if (
        values.addressData &&
        values.addressData.lat &&
        values.addressData.lng
      ) {
        const weatherData =
          await googleClientWeatherService.getWeatherDataToday(
            values.addressData.lat,
            values.addressData.lng
          );
        if (weatherData) {
          values.weatherData = weatherData;
        }
        console.log("Weather Data:", weatherData);
      }
      const response = await fetch("/api/drive/ec-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      notifyMessage("Document created successfully!");
      console.log("Document created successfully:", data);
    } catch (error) {
      console.error("Error creating document:", error);
      notifyMessage("Error creating document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sample Document Creation</h1>
      {sheetData && (
        <CreateECDocForm
          sheetData={sheetData}
          onSubmit={createDoc}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default HomePage;

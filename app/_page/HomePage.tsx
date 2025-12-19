"use client";
import CreateECDocForm from "@/components/forms/CreateECDocForm";
import { googleClientWeatherService } from "@/google/googleWeatherService";
import useCoreSheetData from "@/hooks/useCoreSheetData";
import { SampleDocData } from "@/types/sampleDoc";
import { useState } from "react";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const { sheetData } = useCoreSheetData();

  const createDoc = async (values: SampleDocData) => {
    console.log("Creating document...", values);
    setLoading(true);
    try {
      const weatherData =
        await googleClientWeatherService.getWeatherDataToday();
      if (weatherData) {
        values.weatherData = weatherData;
      }
      const response = await fetch("/api/drive/ec-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log("Document created successfully:", data);
      console.log("Weather Data:", weatherData);
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sample Document Creation</h1>
      {sheetData && (
        <CreateECDocForm sheetData={sheetData} onSubmit={createDoc} />
      )}
    </div>
  );
};

export default HomePage;

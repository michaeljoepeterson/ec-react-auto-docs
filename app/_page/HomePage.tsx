"use client";
import CreateECDocForm, {
  ECDocSubmitData,
} from "@/components/forms/CreateECDocForm";
import useCoreSheetData from "@/hooks/useCoreSheetData";

const HomePage = () => {
  const { sheetData } = useCoreSheetData();

  const createDoc = (values: ECDocSubmitData) => {
    console.log("Creating document...", values);
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

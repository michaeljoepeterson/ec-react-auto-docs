import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const AppPin = ({ lat, lng }: { lat: number; lng: number }) => {
  return (
    <AdvancedMarker position={{ lat, lng }}>
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
    </AdvancedMarker>
  );
};

export default AppPin;

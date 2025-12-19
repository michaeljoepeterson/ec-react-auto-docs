import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

const AppPin = ({
  lat,
  lng,
  onClick,
}: {
  lat: number;
  lng: number;
  onClick?: () => void;
}) => {
  return (
    <AdvancedMarker position={{ lat, lng }} onClick={onClick}>
      <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
    </AdvancedMarker>
  );
};

export default AppPin;

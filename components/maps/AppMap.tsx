import { Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import AppPin from "./Pin";
import { useState } from "react";

export interface PinPosition {
  lat: number;
  lng: number;
}

const AppMap = ({
  onPinUpdate,
}: {
  onPinUpdate?: (position: PinPosition) => void;
}) => {
  const [pinPosition, setPinPosition] = useState<PinPosition | null>(null);

  const handleMapClick = (event: MapMouseEvent) => {
    console.log("Map clicked at: ", event);
    if (onPinUpdate && event.detail?.latLng) {
      onPinUpdate(event.detail.latLng);
    }
    if (event.detail?.latLng) {
      setPinPosition({
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      });
    } else {
      setPinPosition(null);
    }
  };

  const pinClicked = () => {
    setPinPosition(null);
  };
  return (
    <Map
      style={{ width: "100vw", height: "30vh" }}
      defaultCenter={{ lat: 53.532259, lng: -113.5808211 }}
      defaultZoom={5}
      gestureHandling="greedy"
      disableDefaultUI
      mapId={process.env.NEXT_PUBLIC_MAP_ID}
      onClick={handleMapClick}
    >
      {pinPosition && (
        <AppPin
          lat={pinPosition.lat}
          lng={pinPosition.lng}
          onClick={pinClicked}
        />
      )}
    </Map>
  );
};

export default AppMap;

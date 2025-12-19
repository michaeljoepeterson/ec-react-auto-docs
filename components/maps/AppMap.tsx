import { Map, MapMouseEvent, useMapsLibrary } from "@vis.gl/react-google-maps";
import AppPin from "./Pin";
import { useState } from "react";

export interface PinPosition {
  lat: number;
  lng: number;
}

const AppMap = ({
  onPinUpdate,
  onGeoCodeResult,
  title,
}: {
  onPinUpdate?: (position: PinPosition) => void;
  onGeoCodeResult?: (results: any) => void;
  title?: string;
}) => {
  const [pinPosition, setPinPosition] = useState<PinPosition | null>(null);
  const geocoding = useMapsLibrary("geocoding");

  const handleMapClick = (event: MapMouseEvent) => {
    console.log("Map clicked at: ", event);
    if (geocoding && onGeoCodeResult) {
      const geocoder = new geocoding.Geocoder();
      geocoder.geocode(
        { location: event.detail?.latLng },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            console.log("Geocoding result:", results);
            onGeoCodeResult(results[0]);
          } else {
            console.error("Geocoding failed:", status);
          }
        }
      );
    }
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
    <div>
      {title && <p>{title}</p>}
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
    </div>
  );
};

export default AppMap;

/**
 * Thin wrapper over the browser Geolocation API. Used to find the nearest
 * hospital. Degrades gracefully — denial or unavailability just falls back to
 * manual entry (the backend defaults to Lahore for the demo).
 */
import { useCallback, useState } from "react";

export type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unavailable";

export interface GeoCoords {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<GeoCoords | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("granted");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setCoords(null);
  }, []);

  return { status, coords, request, reset };
}

import { useEffect, useState } from "react";

interface IGetGeoLocation {
  lat?: number;
  lng?: number;
  isError: boolean;
  message: string;
}

interface IOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

function getGeoLocation(options: IOptions): Promise<IGetGeoLocation> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        res => {
          const { coords } = res;
          const { latitude, longitude } = coords;
          resolve({
            lat: latitude,
            lng: longitude,
            isError: false,
            message: ""
          });
        },
        err => {
          reject({ message: err.message, isError: true });
        },
        options
      );
    } else {
      reject({
        isError: true,
        message: "Geolocation is not supported for this Browser/OS."
      });
    }
  });
}

interface IUseGeoLocationHook {
  when?: boolean;
}

const defaultHookOptions = {
  when: false
};

const defaultGeoLocationOptions = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0
};

function useGeolocation(
  hooksOptions: IUseGeoLocationHook = defaultHookOptions,
  geoLocationOptions: IOptions = defaultGeoLocationOptions
) {
  const [geoObj, setGeoObj] = useState(null);
  const { when } = hooksOptions;

  useEffect(() => {
    async function getGeoCode() {
      const value = await getGeoLocation(geoLocationOptions);
      setGeoObj(value);
    }
    if (when) {
      getGeoCode();
    }
  }, [when, geoLocationOptions]);

  return geoObj;
}

export { useGeolocation };

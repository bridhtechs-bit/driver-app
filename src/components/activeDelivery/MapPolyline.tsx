import { Fragment } from "react";

interface Props {

  /**
   * Future Google Directions API
   */
  coordinates?: {
    latitude: number;
    longitude: number;
  }[];

}

export function MapPolyline({
  coordinates,
}: Props) {

  /**
   * Demain :
   *
   * <Polyline />
   *
   * ou
   *
   * <MapViewDirections />
   */

  if (!coordinates?.length) {
    return null;
  }

  return (
    <Fragment />
  );

}
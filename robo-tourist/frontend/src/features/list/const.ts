import drivingIcon from "../../assets/driving.svg";
import publicTransportIcon from "../../assets/public-transport.svg";
import walkingIcon from "../../assets/walking.svg";
import { TravelMode } from "../map/interfaces";

export const travelModeIcons: { [index: string]: any } = {
  Walking: walkingIcon,
  Driving: drivingIcon,
  "Public Transport": publicTransportIcon,
};

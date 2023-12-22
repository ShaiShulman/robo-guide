import drivingIcon from "../../assets/driving.svg";
import publicTransportIcon from "../../assets/public-transport.svg";
import walkingIcon from "../../assets/walking.svg";
import cyclingIcon from "../../assets/cycling.svg";
import { TravelMode } from "../../data/interfaces";

export const travelModeIcons = {
  [TravelMode.Walking]: walkingIcon,
  [TravelMode.Driving]: drivingIcon,
  [TravelMode.Transit]: publicTransportIcon,
  [TravelMode.Bicycling]: cyclingIcon,
};

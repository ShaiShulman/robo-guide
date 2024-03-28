import { PlanPersist } from "./interfaces";

export const extractPlanList = (plans: PlanPersist[]) =>
  plans.map((plan: PlanPersist) => ({
    uid: plan.uid,
    caption: getFirstWords(plan.target, 6, true),
    subcaption: capitalizeFirstChar(plan.preference),
    photos: plan.markers // Get first 4 markers with photos
      .filter((marker) => marker.photo)
      .slice(0, 4)
      .map((marker) => marker.photo),
  }));

const getFirstWords = (
  str: string,
  num: number,
  capitalize: boolean = false
): string => {
  const words = str.split(" ");
  const firstXWords = words.slice(0, num);

  if (capitalize) {
    for (let i = 0; i < firstXWords.length; i++) {
      firstXWords[i] =
        firstXWords[i].charAt(0).toUpperCase() + firstXWords[i].slice(1);
    }
  }

  let result = firstXWords.join(" ");
  if (words.length > num) {
    result += "...";
  }

  return result;
};

const capitalizeFirstChar = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

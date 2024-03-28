// plan-storage.ts
import { QueryClient, useMutation, useQuery } from "react-query";
import { v4 as uuidv4 } from "uuid";

import { PlanPersist, PlanPersistSummary } from "./interfaces";
import { extractPlanList } from "./plan-storage-utils";

const queryClient = new QueryClient();
export const PLAN_LIST_KEY = "planLists";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const savePlanToLocalStorage = async (plan: Omit<PlanPersist, "uid">) => {
  await delay(1000);
  let planJson = JSON.parse(localStorage.getItem(PLAN_LIST_KEY) || "[]");
  const newPlan = { ...plan, uid: uuidv4() };
  planJson.push(newPlan);
  localStorage.setItem(PLAN_LIST_KEY, JSON.stringify(planJson));
  return newPlan;
};

const loadPlansHeadingsFromLocalStorage = async () => {
  await delay(1000);
  const plans = JSON.parse(localStorage.getItem(PLAN_LIST_KEY) || "[]");
  return extractPlanList(plans);
};

export const loadPlanByIdFromLocalStorage = (uid: string) => {
  const plans = JSON.parse(localStorage.getItem(PLAN_LIST_KEY) || "[]");
  return plans.find((plan: PlanPersist) => plan.uid === uid);
};

export const useSavePlan = () => {
  return useMutation(savePlanToLocalStorage, {
    onSuccess: (newPlan) => {
      queryClient.setQueryData<PlanPersist[]>([PLAN_LIST_KEY], (oldData) => [
        ...(Array.isArray(oldData) ? oldData : []),
        { ...newPlan },
      ]);
      queryClient.invalidateQueries([PLAN_LIST_KEY]);
    },
  });
};

export const useLoadPlanNames = () => {
  return useQuery<PlanPersistSummary[]>(
    [PLAN_LIST_KEY],
    loadPlansHeadingsFromLocalStorage,
    {
      staleTime: 100,
      cacheTime: 100,
    }
  );
};

export const useLoadPlan = (uid: string) => {
  return useQuery([PLAN_LIST_KEY, uid], () =>
    loadPlanByIdFromLocalStorage(uid)
  );
};

export const useLoadPlanData = (uid: string) => {
  return useQuery([PLAN_LIST_KEY, uid], () =>
    loadPlanByIdFromLocalStorage(uid)
  );
};

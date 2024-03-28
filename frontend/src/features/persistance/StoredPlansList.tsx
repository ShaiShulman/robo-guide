import { useQueryClient } from "react-query";
import QuadrantImage from "../../components/QuadrantImage";
import {
  PLAN_LIST_KEY,
  loadPlanByIdFromLocalStorage,
  useLoadPlanData,
  useLoadPlanNames,
} from "./plan-storage";
import { markersActions } from "../../store/markerSlice";
import getDispatch from "../../lib/get-dispatch";
import { PlanPersist } from "./interfaces";
import { appActions } from "../../store/appSlice";

const StoredPlansList: React.FC = ({}) => {
  const plansQuery = useLoadPlanNames();
  const queryClient = useQueryClient();
  const dispatch = getDispatch();

  const handlePlanClick = async (event: React.MouseEvent<HTMLLIElement>) => {
    const uid = event.currentTarget.getAttribute("data-key");
    if (!uid) return;
    console.log("clicked", uid);
    await queryClient.prefetchQuery([PLAN_LIST_KEY, uid], () =>
      loadPlanByIdFromLocalStorage(uid)
    );

    const data = queryClient.getQueryData<PlanPersist>([PLAN_LIST_KEY, uid]);
    console.log(data);
    dispatch(markersActions.reset());
    dispatch(markersActions.reset());
    data.markers.forEach((marker) => dispatch(markersActions.add(marker)));
    dispatch(appActions.setMode("Result"));
  };

  return (
    <div className="list-section stored">
      {plansQuery.isLoading && <div>Loading...</div>}
      <ul>
        {plansQuery.isSuccess &&
          plansQuery.data.map((plan) => (
            <li key={plan.uid} data-key={plan.uid} onClick={handlePlanClick}>
              <div className="list-item">
                <div className="place-image">
                  <QuadrantImage urls={plan.photos} />
                </div>
                <div className="item-info">
                  <h2 className="item-title">{plan.caption}</h2>
                  <div className="item-description">{plan.subcaption}</div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default StoredPlansList;

import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import getDispatch from "../lib/get-dispatch";
import { appActions, selectAppState } from "../store/appSlice";

const Error: React.FC = (props) => {
  const dispatch = getDispatch();
  const appState = useSelector(selectAppState);

  return (
    <Alert variant="danger">
      {appState.error}
      <br />
      <Alert.Link onClick={() => dispatch(appActions.setMode("Prompt"))}>
        Click
      </Alert.Link>{" "}
      to reset.
    </Alert>
  );
};

export default Error;

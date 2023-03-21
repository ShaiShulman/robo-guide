import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";

const getDispatch: () => AppDispatch = () => useDispatch();

export default getDispatch;

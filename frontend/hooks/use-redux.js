// app/hooks.js
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch(); // Custom hook for dispatch
export const useAppSelector = useSelector;

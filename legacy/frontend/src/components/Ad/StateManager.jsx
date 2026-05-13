import { useReducer } from "react";

import {
  GET_ADS_FAILURE,
  GET_ADS_REQUEST,
  GET_ADS_SUCCESS,
} from "../../utils/action-types";

const initialState = {
  ads: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_ADS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case GET_ADS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        ads: action.payload.ads,
      };
    case GET_ADS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const StateManager = ({ position, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return children({ state, dispatch, position });
};

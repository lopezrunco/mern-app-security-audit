import { useContext, useReducer } from "react";

import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../../utils/action-types";
import { AuthContext } from "../../App";

const initialState = {
  postsList: [],
  isFetching: false,
  hasError: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        hasError: false,
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        postsList: action.payload.posts,
      };
    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        hasError: true,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const StateManager = ({ numbOfItems, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  return children({ state, dispatch, authState, authDispatch, numbOfItems });
};

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
} from "../../utils/action-types";
import { apiUrl } from "../../utils/api-url";

export const Fetcher = ({
  dispatch,
  authState,
  authDispatch,
  numbOfItems,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FETCH_POSTS_REQUEST });

      try {
        const response = await fetch(
          apiUrl(`posts/published?page=1&itemsPerPage=${numbOfItems}`),
          {
            method: "GET",
            headers: {
              Authorization: authState.token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: FETCH_POSTS_SUCCESS,
            payload: data,
          });
        } else {
          throw response;
        }
      } catch (error) {
        console.error("Error trying to fetch the posts", error);
        if (error.status === 401) {
          refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
          navigate("/forbidden");
        } else {
          dispatch({
            type: FETCH_POSTS_FAILURE,
          });
        }
      }
    };

    fetchData();
  }, [
    authDispatch,
    authState.refreshToken,
    authState.token,
    navigate,
    numbOfItems,
  ]);

  return null;
};

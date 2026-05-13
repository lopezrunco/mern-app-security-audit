import { useEffect } from "react";

import {
  GET_ADS_FAILURE,
  GET_ADS_REQUEST,
  GET_ADS_SUCCESS,
} from "../../utils/action-types";
import { apiUrl } from "../../utils/api-url";

export const Fetcher = ({ position, dispatch }) => {
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: GET_ADS_REQUEST });

      try {
        const response = await fetch(apiUrl(`/ads/position/${position}`));
        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: GET_ADS_SUCCESS,
            payload: data,
          });
        } else {
          throw response;
        }
      } catch (error) {
        console.error("Error trying to fetch the ads", error);
        dispatch({
          type: GET_ADS_FAILURE,
        });
      }
    };

    fetchData();
  }, [position, dispatch]);

  return null;
};

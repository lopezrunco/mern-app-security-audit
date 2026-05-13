import { useContext, useEffect } from "react";

import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import { AuthContext } from "../../App";
import {
    FETCH_TAGS_FAILURE,
    FETCH_TAGS_REQUEST,
    FETCH_TAGS_SUCCESS,
} from "../../utils/action-types";

export const Fetcher = (dispatch, navigate) => {
    const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: FETCH_TAGS_REQUEST });

            try {
                const response = await fetch(apiUrl("/tags"), {
                    method: "GET",
                    headers: {
                        Authorization: authState.token,
                        "Content-Type": "application/json",
                    },
                })
                if (response.ok) {
                    const data = await response.json()
                    dispatch({
                        type: FETCH_TAGS_SUCCESS,
                        payload: data,
                    });
                } else {
                    throw response;
                }
            } catch (error) {
                console.error("Error trying to fetch the tags", error);
                if (error.status === 401) {
                    refreshToken(authState.refreshToken, authDispatch, navigate);
                } else if (error.status === 403) {
                    navigate("/forbidden");
                } else {
                    dispatch({
                        type: FETCH_TAGS_FAILURE,
                    });
                }
            }
        }

        fetchData()
    }, [authDispatch, authState.refreshToken, authState.token, dispatch, navigate]);
}
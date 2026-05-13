import { refreshToken } from "../../utils/refresh-token";
import { apiUrl } from "../../utils/api-url";
import {
    FETCH_POSTS_FAILURE,
    FETCH_POSTS_REQUEST,
    FETCH_POSTS_SUCCESS,
    NO_RESULTS,
} from "../../utils/action-types";

export const Fetcher = async (searchQuery, dispatch, authState, authDispatch, navigate) => {
    dispatch({ type: FETCH_POSTS_REQUEST })

    try {
        const response = await fetch(apiUrl(`/posts/search/published?title=${encodeURIComponent(searchQuery)}`))

        if (response.ok) {
            const data = await response.json()
            dispatch({
                type: FETCH_POSTS_SUCCESS,
                payload: data
            })
            if (data.posts.length > 0) {
                navigate("/resultados-busqueda", {
                    state: { results: data.posts },
                })
            }
        } else {
            throw response
        }
    } catch (error) {
        console.error("Error trying to fetch posts by title", error)
        
        if (error.status === 401) {
            refreshToken(authState.refreshToken, authDispatch, navigate);
        } else if (error.status === 403) {
            navigate("/forbidden");
        } else if (error.status === 404) {
            dispatch({
                type: NO_RESULTS,
            });
        } else {
            dispatch({
                type: FETCH_POSTS_FAILURE,
            });
        }
    }
}
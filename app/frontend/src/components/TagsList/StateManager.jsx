import { useReducer } from "react";
import {
    FETCH_TAGS_FAILURE,
    FETCH_TAGS_REQUEST,
    FETCH_TAGS_SUCCESS,
} from "../../utils/action-types";

const initialState = {
    tagsList: [],
    isFetching: false,
    hasError: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_TAGS_REQUEST:
            return {
                ...state,
                isFetching: true,
                hasError: false,
            };
        case FETCH_TAGS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                tagsList: action.payload.tags.filter((tag) => tag.trim() !== ""), // Filter empty or whitespace tags
            };
        case FETCH_TAGS_FAILURE:
            return {
                ...state,
                hasError: true,
                isFetching: false,
            };
        default:
            return state;
    }
};

export const StateManager = () => useReducer(reducer, initialState)
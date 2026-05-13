import { useReducer } from "react";

import {
    CLEAR_SEARCH,
    FETCH_POSTS_FAILURE,
    FETCH_POSTS_REQUEST,
    FETCH_POSTS_SUCCESS,
    NO_RESULTS,
} from "../../utils/action-types";

const initialState = {
    searchResults: [],
    isSearching: false,
    hasError: false,
    noResults: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_POSTS_REQUEST:
            return {
                ...state,
                isSearching: true,
                hasError: false,
            };
        case FETCH_POSTS_SUCCESS:
            return {
                ...state,
                isSearching: false,
                searchResults: action.payload.posts,
            };
        case FETCH_POSTS_FAILURE:
            return {
                ...state,
                isSearching: false,
                hasError: true,
            };
        case NO_RESULTS:
            return {
                ...state,
                isSearching: false,
                noResults: true,
            };
        case CLEAR_SEARCH:
            return {
                ...state,
                searchResults: [],
                isSearching: false,
                hasError: false,
                noResults: false,
            };
        default:
            return state;
    }
};

export const StateManager = () => {
    return useReducer(reducer, initialState)
}
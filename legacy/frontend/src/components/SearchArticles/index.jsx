import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../../App";
import { CLEAR_SEARCH } from "../../utils/action-types";

import { StateManager } from "./StateManager"
import { Fetcher } from "./Fetcher"
import { Renderer } from "./Renderer"

import "./styles.scss";

export const SearchArticles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);
  const [state, dispatch] = StateManager()

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      Fetcher(searchQuery, dispatch, authState, authDispatch, navigate)
    }
  };

  const handleKeyPress = (e) => {
    e.key === "Enter" && handleSearch();
  };

  const clearSearch = () => {
    dispatch({
      type: CLEAR_SEARCH,
    });
  };

  return (
    <div className="search-article">
      <div className="wrapper">
        <label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Buscar..."
          />
          <button onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </label>
      </div>
      {(state.hasError || state.noResults) && (
        <Renderer state={state} clearSearch={clearSearch} />
      )}
    </div>
  );
};

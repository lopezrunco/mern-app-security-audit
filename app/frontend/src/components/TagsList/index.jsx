import { useNavigate } from "react-router-dom";

import { StateManager } from "./StateManager"
import { Renderer } from "./Renderer"
import { Fetcher } from "./Fetcher"

import "./styles.scss";

export const TagsList = () => {
  const navigate = useNavigate();
  const [state, dispatch] = StateManager();

  Fetcher(dispatch, navigate)

  return <Renderer tagsList={state.tagsList} />
};

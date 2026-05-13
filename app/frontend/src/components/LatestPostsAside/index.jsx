import React from "react";

import { StateManager } from "./StateManager";
import { Fetcher } from "./Fetcher";
import { Renderer } from "./Renderer";

import "./styles.scss";

export const LatestPostsAside = ({ numbOfItems }) => {
  return (
    <StateManager numbOfItems={numbOfItems}>
      {({ state, dispatch, authState, authDispatch }) => (
        <React.Fragment>
          <Fetcher
            dispatch={dispatch}
            authState={authState}
            authDispatch={authDispatch}
            numbOfItems={numbOfItems}
          />
          <Renderer state={state} />
        </React.Fragment>
      )}
    </StateManager>
  );
};

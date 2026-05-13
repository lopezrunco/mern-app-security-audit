import React from "react";

import { StateManager } from "./StateManager";
import { Fetcher } from "./Fetcher";
import { Renderer } from "./Renderer";

export const Ad = ({ position }) => {
  return (
    <StateManager position={position}>
      {({ state, dispatch }) => (
        <React.Fragment>
          <Fetcher position={position} dispatch={dispatch} />
          <Renderer state={state} position={position} />
        </React.Fragment>
      )}
    </StateManager>
  );
};

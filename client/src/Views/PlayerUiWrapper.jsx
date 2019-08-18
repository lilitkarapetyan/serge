import React from "react";
import { PlayerStateProvider } from "../Store/PlayerUi";
import PlayerUi from "./PlayerUi";

export default () => (
  <PlayerStateProvider>
    <PlayerUi/>
  </PlayerStateProvider>
)
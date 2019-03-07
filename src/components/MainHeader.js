import React from "react";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

import withApp from '../withApp';

const MainHeader = ({ auth }) => (
  <CommandBar
    items={[
      {
        key: "app-name",
        name: "DQL Explorer",
        disabled: true,
        ariaLabel: "Name of the app"
      }
    ]}
    farItems={[
      {
        key: "display-name",
        name: auth.displayName,
        disabled: true,
        ariaLabel: "Display Name"
      }
    ]}
  />
);

export default withApp(MainHeader);
/**
 * Copyright (c) International Business Machines
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
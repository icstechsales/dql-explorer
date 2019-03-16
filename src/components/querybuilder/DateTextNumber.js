/**
 * Copyright (c) IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { IconButton } from "office-ui-fabric-react/lib/Button";

const DateTextNumber = ({
  id,
  onValueTypeChange,
  showText,
  showDateSelector
}) => {
  const _items = [
    {
      key: "text",
      text: showText ? "is text" : "",
      iconProps: { iconName: "InsertTextBox" },
      onClick: () => onValueTypeChange(id, "text")
    },
    {
      key: "number",
      text: showText ? "is number" : "",
      iconProps: { iconName: "NumberSymbol" },
      onClick: () => onValueTypeChange(id, "number")
    },
    {
      key: "name",
      text: showText ? "is name" : "",
      iconProps: { iconName: "user" },
      onClick: () => onValueTypeChange(id, "name")
    }
  ];

  if (showDateSelector) {
    _items.push({
      key: "calendar",
      text: showText ? "is date" : "",
      iconProps: { iconName: "Calendar" },
      onClick: () => onValueTypeChange(id, "date")
    })
  }

  return (
    <React.Fragment>
      <IconButton
        menuProps={{
          items: _items
        }}
      />
    </React.Fragment>
  );
};

export default DateTextNumber;

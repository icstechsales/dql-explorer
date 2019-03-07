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

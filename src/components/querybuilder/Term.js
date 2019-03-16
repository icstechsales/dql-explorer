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
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { DefaultButton, IconButton } from "office-ui-fabric-react/lib/Button";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import withApp from '../../withApp';
import DateTextNumber from "./DateTextNumber";

const DayPickerStrings = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year',
  closeButtonAriaLabel: 'Close date picker',
  isRequiredErrorMessage: 'Start date is required.',
  invalidInputErrorMessage: 'Invalid date format.'
};

var booleans = [
  { value: "and", display: "and", className: "and" },
  { value: "or", display: "or", className: "or" },
  { value: "and not", display: "and not", className: "andnot" },
  { value: "or not", display: "or not", className: "ornot" }
];

var booleanOptions = booleans.map((boolean, index) => {
  var classString = "operator " + boolean.className;
  return (
    <option className={classString} value={boolean.value} key={index}>
      {boolean.display}
    </option>
  );
});

const desc = 'Date field.';

const _onFormatDate = (date) => {
  let dt = new Date(date);
  return (dt.getMonth() + 1)+ '/' + dt.getDate()  + '/' + (dt.getFullYear() % 100);
};

const _onParseDateFromString = (value) => {
  const date = this.props.childQuery.value || new Date();
  const values = (value || '').trim().split('/');
  const day = values.length > 0 ? Math.max(1, Math.min(31, parseInt(values[0], 10))) : date.getDate();
  const month = values.length > 1 ? Math.max(1, Math.min(12, parseInt(values[1], 10))) - 1 : date.getMonth();
  let year = values.length > 2 ? parseInt(values[2], 10) : date.getFullYear();
  if (year < 100) {
    year += date.getFullYear() - (date.getFullYear() % 100);
  }
  return new Date(year, month, day);
};

const _onRenderOption = (option) => {
  return (
    <div className="dropdownExample-option">
      {option.data && option.data.icon && (
        <Icon style={{ marginRight: '8px' }} iconName={option.data.icon} aria-hidden="true" title={option.data.icon} />
      )}
      <span>{option.text}</span>
    </div>
  );
};

function compare(a,b) {
  if (a.text < b.text)
    return -1;
  if (a.text > b.text)
    return 1;
  return 0;
}

const Term = ({ index, indexValue, addTermValue, removeTerm, onTermChange, onValuesChange, onTermValueTypeChange, onTermBooleanChange, childQuery, databases, 
  selectedDatabase: { filepath, formviewfolder, fvfName }, onTermDateChange }) => {
  
  let selectedDatabase = databases.find(database => database.filepath === `${filepath}`);
  let selectedObject = undefined; 
  let options = [];
  if (formviewfolder === 'forms') {
    selectedObject = selectedDatabase.forms.find(form => form.name === fvfName);    
    if (selectedObject) {
      selectedObject.fields.map((field) => {
        let iconType;
        switch (field.type) {
          case 'number': //number
            iconType = 'number'; 
            break;
          case 'date': // date time, 
            iconType = 'date';
            break;
          case 'name': // readers, authors, names fields
            iconType = 'name';
            break;
          case 'richtext': // rich text, 
          case 'formula': // formula
          case 'text': // listbox, combobox, radiobutton, checkbox, dialoglist, password, timezone
          case 'other': // allow multi { listbox, checkbox, dialog list, number , date time, formula, text, color }
          default:
            iconType = 'text';
        }
      
        options.push({
          key: field.name,
          text: field.displayName,
          data: { icon: iconType === 'date' ? 'Calendar' : iconType === 'number' ? 'NumberSymbol' : iconType === 'name' ? 'user' : 'InsertTextBox',
                  type: iconType }
        });
        return options;
      })
    }
  }

  if ((formviewfolder === 'views') || (formviewfolder === 'folders')) {  
    selectedObject = selectedDatabase.viewsfolders.find(viewfolder => viewfolder.alias !== '' ? viewfolder.alias === fvfName : viewfolder.name === fvfName);
    if (selectedObject) {
      selectedObject.columns.map((column) => {
        let iconType = 'text';

        if (column.displayName !== '') {
          options.push({
            key: column.name,
            text: column.displayName,
            data: { icon: 'InsertTextBox',
                  type: iconType }
          });
        }
        return options;
      })
    }
  }

  const _onSelectDate = (date) => {
    onTermDateChange(childQuery.id, "value", date);
  };

  return (
    <div className="query condition">
      <div className="" dir="ltr">
        <div className="queryRow">
          {indexValue !== 0 ? (
            <div className="">
              <select
                className="operators condition"
                value={childQuery.boolean}
                onChange={(event) => onTermBooleanChange(index, event)}
              >
                {booleanOptions}
              </select>
            </div>
          ) : null}
          <div className="">
            <Dropdown
              placeholder={formviewfolder === 'views' ? "Select column" : formviewfolder === 'forms' ? "Select field" : "Select column"}
              selectedKey={childQuery.identifier}
              className="selectFields"
              onChange={(event, data) =>
                onTermChange(index, "identifier", data)
              }
              options={options.sort(compare)}
              onRenderOption={_onRenderOption}
            />
          </div>
          <div className="">
            <Dropdown
              placeholder="Select operator"
              selectedKey={childQuery.operator}
              className="operators"
              dropdownWidth="40"
              onChange={(event, data) =>
                onTermChange(index, "operator", data)
              }
              options={[
                { key: "=", text: "=" },
                { key: ">", text: ">" },
                { key: ">=", text: ">=" },
                { key: "<", text: "<" },
                { key: "<=", text: "<=" },
                { key: "in", text: "in" },
                { key: "in all", text: "in all" }
              ]}
            />
          </div>
          { childQuery.operator !== "in" && childQuery.operator !== "in all"? (
            <div className="valueGroup">
              {childQuery.valueType === "text" && (
                <TextField
                  placeholder="Text"
                  className="valueField textField"
                  value={childQuery.value}
                  onChange={(event, data) =>
                    onTermChange(index, "value", data)
                  }
                  iconProps={{ iconName: 'InsertTextBox', className: 'inFieldIcon' }}
                />
                
              )}
              {childQuery.valueType === "number" && (
                <TextField
                  placeholder="Number"
                  className="valueField numberField"
                  value={childQuery.value}
                  onChange={(event, data) =>
                    onTermChange(index, "value", data)
                  }
                  iconProps={{ iconName: 'NumberSymbol', className: 'inFieldIcon' }}
                />
              )}
              {childQuery.valueType === "name" && (
                <TextField
                  placeholder="Name"
                  className="valueField textField"
                  value={childQuery.value}
                  onChange={(event, data) =>
                    onTermChange(index, "value", data)
                  }
                  iconProps={{ iconName: 'user', className: 'inFieldIcon' }}
                />
              )}
              {childQuery.valueType === "date" && (
                <DatePicker
                isRequired={false}
                allowTextInput={true}
                ariaLabel={desc}
                strings={DayPickerStrings}
                value={childQuery.dateValue ? new Date(childQuery.dateValue) : new Date()}
                onSelectDate={_onSelectDate}
                formatDate={_onFormatDate}
                parseDateFromString={_onParseDateFromString}
              />
              )}

              <DateTextNumber
                showText={false}
                id={childQuery.id}
                onValueTypeChange={(event, data) => onTermValueTypeChange(index, data)}
                showDateSelector={true}
              />

            </div>
          ) : (
            <div className="valueGroup">
              <div className="">
                {childQuery.valueType === "text" && (
                  <TextField
                    placeholder="Text"
                    className="valueField textField"
                    value={childQuery.value}
                    onChange={(event, data) =>
                      onTermChange(index, "value", data)
                    }
                    iconProps={{ iconName: 'InsertTextBox', className: 'inFieldIcon' }}
                  />
                )}
                {childQuery.valueType === "number" && (
                  <TextField
                    placeholder="Number"
                    className="valueField numberField"
                    value={childQuery.value}
                    onChange={(event, data) =>
                      onTermChange(index, "value", data)
                    }
                    iconProps={{ iconName: 'NumberSymbol', className: 'inFieldIcon' }}
                  />
                )}
                {childQuery.valueType === "name" && (
                  <TextField
                    placeholder="Name"
                    className="valueField textField"
                    value={childQuery.value}
                    onChange={(event, data) =>
                      onTermChange(index, "value", data)
                    }
                    iconProps={{ iconName: 'user', className: 'inFieldIcon' }}
                  />
                )}
                <DateTextNumber
                  showText={false}
                  id={childQuery.id}
                  onValueTypeChange={(event, data) => onTermValueTypeChange(index, data)}
                />
              </div>
              <div className="plusButton">
                <IconButton
                  onClick={(event, data) => addTermValue(childQuery.id, event, data)}
                  iconProps={{ iconName: "CirclePlus" }}
                  title="Add Value"
                  ariaLabel="Add"
                />
              </div>
              <div className="valuesPicker">
                <Dropdown
                  placeholder="Values"
                  className='dataTypePicker'
                  selectedKeys={childQuery.selectedItems}
                  onChange={(event, item) =>
                    onValuesChange(childQuery.id, event, item)
                  }
                  multiSelect
                  // isDisabled={childQuery.options.length === 0 ? true : false}
                  disabled={childQuery.options.length === 0 ? true : false}
                  options={childQuery.options}
                />
              </div>
            </div>
          )}
          <div className="groupCancel">
            <DefaultButton
              iconProps={{ iconName: "Cancel" }}
              onClick={() => removeTerm(index)}
            />
          </div>
        </div>
      </div>
    </div>
  )};

export default withApp(Term);

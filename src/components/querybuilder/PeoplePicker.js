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

import React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import {
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { Promise } from 'es6-promise';
import { Label } from "office-ui-fabric-react";

import withApp from '../../withApp';

const suggestionProps = {
  suggestionsHeaderText: 'Suggested Names',
  mostRecentlyUsedHeaderText: 'Suggested Names',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested names'
};

export const people = [
  {
    key: 1,
    imageInitials: 'AM',
    text: 'Andrew Manby',
    // secondaryText: 'Director, Product Management',
    tertiaryText: 'CN=Andrew Manby/O=MyOrg'
  },
  {
    key: 2,
    imageInitials: 'DP',
    text: 'Dimitri Prosper',
    // secondaryText: 'Developer',
    tertiaryText: 'CN=Dimitri Prosper/O=MyOrg'
  },
  {
    key: 3,
    imageInitials: 'LG',
    text: 'Luis Guirigay',
    // secondaryText: 'Technical Leader',
    tertiaryText: 'CN=Luis Guirigay/O=MyOrg'
  },
  {
    key: 4,
    imageInitials: 'SG',
    text: 'Scott Good',
    // secondaryText: 'Designer',
    tertiaryText: 'CN=Scott Good/O=MyOrg'
  }
];

const mru = people.slice(0, 5);

class PeoplePicker extends BaseComponent {
  _picker = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      currentPicker: 1,
      delayResults: false,
      peopleList: people,
      mostRecentlyUsed: mru,
      isPickerDisabled: false
    };
  }

  render() {
    let readers = this._renderReadersPicker();
    let authors = this._renderAuthorsPicker();

    return (
      <React.Fragment>
        {readers}
        {authors}
      </React.Fragment>
    );
  }

  _getTextFromItem(persona) {
    return persona.text;
  }

  _renderReadersPicker() {
    return (
      <React.Fragment>
        <Label>Can use this query</Label>
        <NormalPeoplePicker
            onResolveSuggestions={this._onFilterChanged}
            onEmptyInputFocus={this._returnMostRecentlyUsed}
            getTextFromItem={this._getTextFromItem}
            pickerSuggestionsProps={suggestionProps}
            className={'ms-PeoplePicker'}
            onValidateInput={this._validateInput}
            selectedItems={this.props.formdata.readers}
            onChange={this._onReadersChange}
            componentRef={this._picker}
            resolveDelay={300}
            disabled={this.state.isPickerDisabled}
        />
      </React.Fragment>

    );
  }

  _renderAuthorsPicker() {
    return (
      <React.Fragment>
          <Label>Can modify this query</Label>
          <NormalPeoplePicker
              onResolveSuggestions={this._onFilterChanged}
              onEmptyInputFocus={this._returnMostRecentlyUsed}
              getTextFromItem={this._getTextFromItem}
              pickerSuggestionsProps={suggestionProps}
              className={'ms-PeoplePicker'}
              onValidateInput={this._validateInput}
              selectedItems={this.props.formdata.authors}
              onChange={this._onAuthorsChange}
              componentRef={this._picker}
              resolveDelay={300}
              disabled={this.state.isPickerDisabled}
          />
      </React.Fragment>
    );
  }

  _onReadersChange = (items) => {
    this.props.onReadersChange(items);
  };

  _onAuthorsChange = (items) => {
    this.props.onAuthorsChange(items);
  };

  _onFilterChanged = (
    filterText,
    currentPersonas,
    limitResults
  ) => {
    if (filterText) {
      let filteredPersonas = this._filterPersonasByText(filterText);

      filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
      return this._filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  _returnMostRecentlyUsed = (currentPersonas) => {
    let { mostRecentlyUsed } = this.state;
    mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    return this._filterPromise(mostRecentlyUsed);
  };

  _filterPromise(personasToReturn) {
    if (this.state.delayResults) {
      return this._convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  }

  _listContainsPersona(persona, personas) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
  }

  _filterPersonasByText(filterText) {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item.text, filterText));
  }

  _doesTextStartWith(text, filterText) {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }

  _convertResultsToPromise(results) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(results), 2000));
  }

  _removeDuplicates(personas, possibleDupes) {
    return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
  }

   _validateInput = (input) => {
    if (input.indexOf('@') !== -1) {
      return ValidationState.valid;
    } else if (input.length > 1) {
      return ValidationState.warning;
    } else {
      return ValidationState.invalid;
    }
  };

}

export default withApp(PeoplePicker);
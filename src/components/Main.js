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
import { Label } from 'office-ui-fabric-react/lib/Label';
import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';

import './styles.scss';
import Results from './Results';
import SavedQueries from './SavedQueries';
import DatabasesList from './DatabasesList';
import QueryBuilder from './querybuilder';
import withApp from '../withApp';

class TabUI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPivotKey: "databaseslist",
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  handlePivotClick = (tab) => {
    this.setState({ selectedPivotKey: tab});
  }

  onPivotLinkClick = (item) => {
    this.setState({ selectedPivotKey: item.props.itemKey });
  }

  render() {
    const { formaction: { runquery, queryValid }, selectedDatabase: { filepath } } = this.props;
    let pivotItems = [];
    pivotItems.push(
      <PivotItem linkText="New Query" itemKey="databaseslist" key="databaseslist" >
        <div className="ms-Grid-col ms-sm10 ms-md8 ms-lg6">
          <DatabasesList handlePivotClick={this.handlePivotClick} />
        </div>
      </PivotItem>
    );

    if (filepath) {
      pivotItems.push(
        <PivotItem linkText="Build Query" itemKey="query" key="query">
          <div className="ms-Grid-col ms-sm9 ms-md8 ms-lg9 queryOuterContainer">
            <QueryBuilder filepath={filepath} handlePivotClick={this.handlePivotClick} />
          </div>
        </PivotItem>
      );
    }

    if (runquery && queryValid) {
      pivotItems.push(
        <PivotItem linkText="Results" itemKey="results" key="results">
          <div className="ms-Grid" dir="ltr">
            <Results />
          </div>
        </PivotItem>
      );
    } else {
      //@todo This is absoutely horrible code, but it works for a demo.
      if (pivotItems.length === 3) {
        pivotItems.pop();
      }
    }

    return (
      <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg2 savedQueriesColumn">
            <Label>{' '}</Label>
            <SavedQueries handlePivotClick={this.handlePivotClick} />
          </div>
          <Label>{' '}</Label>
          <Pivot selectedKey={`${this.state.selectedPivotKey}`} onLinkClick={this.onPivotLinkClick}>
            {pivotItems}
          </Pivot>
          <div className="ms-Grid-col ms-sm6 ms-md8 ms-lg9"></div>
          <div className="ms-Grid-col ms-sm6 ms-md4 ms-lg1"></div>

        </div>
      </div>
    );
  }

}

export default withApp(TabUI);
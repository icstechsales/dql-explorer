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

import React, { Component } from "react";

import { AuthCtx } from "./App";

function withApp(ComposedComponent) {
  return class extends Component {
    render() {
      return (
        <AuthCtx.Consumer>
          {({
            selectedDatabase,
            onChangeFilePath,
            auth,
            onShareDialog,
            formdata,
            formaction,
            onReadersChange,
            onAuthorsChange,
            results,
            onChangeResults,
            explain,
            onChangeExplain,
            query,
            databases,
            savedqueries,
            onDatabasesChange,
            onOperatorChange,
            addGroup,
            addTerm,
            removeTerm,
            removeGroup,
            onTermBooleanChange,
            onTermChange,
            onTermDateChange,
            onTermValueTypeChange,
            onGroupBooleanChange,
            addTermValue,
            onTermChangeColumnsToDisplay,
            handleQueryNameChange,
            onValuesChange,
            onImageChoiceGroupChange,
            onCreateEntry,
            onUpdateEntry,
            onDeleteQuery,
            getSavedQueries,
            onSelectedQuery,
            onChangeViewFolderName,
            onShowPanel,
            onHidePanel
          }) => (
            <ComposedComponent
              {...this.props}
              selectedDatabase={selectedDatabase}
              onChangeFilePath={onChangeFilePath}
              auth={auth}
              onShareDialog={onShareDialog}
              formdata={formdata}
              formaction={formaction}
              onReadersChange={onReadersChange}
              onAuthorsChange={onAuthorsChange}
              results={results}
              onChangeResults={onChangeResults}
              explain={explain}
              onChangeExplain={onChangeExplain}
              query={query}
              onOperatorChange={onOperatorChange}
              addGroup={addGroup}
              addTerm={addTerm}
              removeTerm={removeTerm}
              removeGroup={removeGroup}
              onTermBooleanChange={onTermBooleanChange}
              onTermChange={onTermChange}
              onTermDateChange={onTermDateChange}
              onTermValueTypeChange={onTermValueTypeChange}
              onGroupBooleanChange={onGroupBooleanChange}
              addTermValue={addTermValue}
              onTermChangeColumnsToDisplay={onTermChangeColumnsToDisplay}
              handleQueryNameChange={handleQueryNameChange}
              onValuesChange={onValuesChange}
              databases={databases}
              savedqueries={savedqueries}
              onDatabasesChange={onDatabasesChange}
              onImageChoiceGroupChange={onImageChoiceGroupChange}
              onCreateEntry={onCreateEntry}
              onUpdateEntry={onUpdateEntry}
              onDeleteQuery={onDeleteQuery}
              getSavedQueries={getSavedQueries}
              onSelectedQuery={onSelectedQuery}
              onChangeViewFolderName={onChangeViewFolderName}
              onShowPanel={onShowPanel}
              onHidePanel={onHidePanel}
            />
          )}
        </AuthCtx.Consumer>
      );
    }
  };
}

export default withApp;

/**
 * @file React HOC for comuming the application state as supported by the Context API
 * @author Dimitri Prosper (IBM) <dimitri_prosper@us.ibm.com>
 * @author Dimitri Prosper (Personal) <dimitri.prosper@gmail.com>
 * @contributor Scott Good (IBM) <scott.good@us.ibm.com>
 * @todo see inline TODO comments
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

/**
 * @author Dimitri Prosper <dimitri_prosper@us.ibm.com>, <dimitri.prosper@gmail.com>, https://dprosper.github.io
 * @author Scott Good <scott.good@us.ibm.com>, https://scott-good.github.io/
 * @todo see inline TODO comments
 */

import React from "react";
import axios from "axios";
import { PrimaryButton, ActionButton } from "office-ui-fabric-react/lib/Button";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { PivotItem, Pivot } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from "office-ui-fabric-react";
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import Group from "./Group";
import { queryToString, columnsToString } from "../../lib/utils";
import withApp from '../../withApp';
import CodeBlock from './CodeBlock';
import AdvancedOptions from './AdvancedOptions';
import ShareDialog from './ShareDialog';
import ActivityPanel from './ActivityPanel';

function compare(a,b) {
  if (a.text < b.text)
    return -1;
  if (a.text > b.text)
    return 1;
  return 0;
}

const _dismissWarning = (text) => () => console.log(text);

class QueryBuilderApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showAdvancedOptions: false,
      queryRunning: false
    };
  }

  _onAdvancedOptionsClick = (event, checked) => {
    this.setState({
      showAdvancedOptions: checked
    });
  };

  go2Results = () => {
    this.props.handlePivotClick('results')
  };

  runDQLQuery = () => {
    const { selectedDatabase: { filepath, formviewfolder, fvfName }, query } = this.props;

    let dqlquery = queryToString(query, 0, formviewfolder, fvfName);
    let fields = columnsToString(query.selectedColumns);

    this.setState({
      queryRunning: true
    });

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios
      .get(
        `${context}runDQLQuery?openagent&query=${escape(
          dqlquery
        )}&fields=${fields}&database=${filepath}`,
        {},
        {
          // auth: {
          //   username: username,
          //   password: password
          // }
        }
      )
      .then(response => {
        this.setState({
          queryRunning: false
        });
          this.props.onChangeResults(response.data);
      });
  };

  runDQLExplain = () => {
    const { query, selectedDatabase: { filepath, formviewfolder, fvfName } } = this.props;

    let dqlquery = queryToString(query, 0, formviewfolder, fvfName );
    let fields = columnsToString(query.selectedColumns);

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios
      .get(
        `${context}runDQLExplain2?openagent&query=${escape(
          dqlquery
        )}&fields=${fields}&database=${filepath}`,
        {},
        {
          // auth: {
          //   username: username,
          //   password: password
          // }
        }
      )
      .then(response => {
        this.props.onChangeExplain(response.data);
      });
  };

  createEntry = () => {
    const { query, selectedDatabase: { databaseName, filepath, formviewfolder, fvfName  }, formdata: { queryname, authors, readers } } = this.props;

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios.post(`${context}api/data/documents?form=collection&computewithform=true`, {
      collectionName: queryname,
      databaseName: databaseName,
      databasePath: filepath,
      collection_authors: (authors && authors.length > 0) ? authors.map((author) => author.tertiaryText) : '', //authors[0].tertiaryText : '',
      collection_readers: (readers && readers.length > 0) ? readers.map((reader) => reader.tertiaryText) : '', //readers[0].tertiaryText : '',
      query: JSON.stringify(query),
      formviewfolder: formviewfolder,
      fvfName: fvfName,
      Action: 'created query'
    }, {
      // auth: {
      //   username: username,
      //   password: password
      // },
      headers: {
        'content-type': 'application/json',
      }
    })
    .then((response) => {
      const { location, date } = response.headers;
      const unid = location.substr(location.lastIndexOf('/') + 1);
      this.props.onCreateEntry(unid, date);
    })
  }

  updateEntry = () => {
    const { query, selectedDatabase: { databaseName, filepath, formviewfolder, fvfName }, formdata: { queryname, unid, authors, readers } } = this.props;

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios.post(`${context}api/data/documents/unid/${unid}?form=collection&computewithform=true`, {
      collectionName: queryname,
      databaseName: databaseName,
      databasePath: filepath,
      collection_authors: (authors && authors.length > 0) ? authors.map((author) => author.tertiaryText) : '', //authors[0].tertiaryText : '',
      collection_readers: (readers && readers.length > 0) ? readers.map((reader) => reader.tertiaryText) : '', //readers[0].tertiaryText : '',
      query: JSON.stringify(query),
      formviewfolder: formviewfolder,
      fvfName: fvfName,
      Action: 'modified query'
    }, {
      // auth: {
      //   username: username,
      //   password: password
      // },
      headers: {
        'X-HTTP-Method-Override':'PATCH'
      }
    })
    .then((response)=>{
      const { date } = response.headers;
      this.props.onUpdateEntry(unid, date);

    })
  }

  deleteEntry = () => {
    const { onDeleteQuery, formdata: { unid } } = this.props;

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios.delete(`${context}api/data/documents/unid/${unid}`, {}, {
      // auth: {
      //   username: username,
      //   password: password
      // },
      headers: {
        'X-HTTP-Method-Override':'PATCH'
      }
    })
    .then((response)=>{
      onDeleteQuery();
    })
  }

  render() {
    const {
      results,
      explain,
      query, 
      formaction: { queryValid, runquery, errormessage, explainerrormessage },
      onTermChangeColumnsToDisplay,
      handleQueryNameChange,
      formdata: { queryname, unid, saved, displaysaved, date, queryAuthor, queryReader },
      selectedDatabase: { databaseName, filepath, formviewfolder, fvfName },
      databases,
      onShareDialog,
      onChangeViewFolderName,
      onShowPanel
    } = this.props;

    // let queryAuthor = false;

    // authors.map((author) => {
    //   for(var prop in author) {
    //     console.log(prop)
    //     if(prop === 'text') {
    //       console.log(author[prop])
    //       if(author[prop] === displayName) {
    //         queryAuthor = true;
    //         return queryAuthor;
    //       }
    //     }
    //   }
    //   return null
    // })
 

    const { showAdvancedOptions, queryRunning } = this.state;

    let selectedDatabase = databases.find(database => database.filepath === `${filepath}`);
    let selectedObject = undefined; 
    let options = [];

    if (formviewfolder === 'forms' && selectedDatabase.forms) {
      selectedObject = selectedDatabase.forms.find(form => form.name === fvfName);

      if (selectedObject) {
        selectedObject.fields.map((field) => {
          options.push({
            key: field.name,
            text: field.displayName
          })
          return options;
        })
      }

    }

    if (((formviewfolder === 'views') || (formviewfolder === 'folders')) && selectedDatabase.viewsfolders) {
      selectedObject = selectedDatabase.viewsfolders.find(viewfolder => viewfolder.alias !== '' ? viewfolder.alias === fvfName : viewfolder.name === fvfName);

      if (selectedObject) {
        selectedObject.columns.map((column) => {
          if (column.displayName !== '') {
            options.push({
              key: column.name,
              text: column.displayName
            })
          }
          return options;
        })
      }
    }


    const type = query.id.split("~")[0];
    const index = query.id.split("~")[1];
    let queryString =  queryToString(query, 0, formviewfolder, fvfName);
    // if (formviewfolder === 'forms') {
    //   queryString = `Form = '${fvfName}' and ${queryString}`
    // }
    // if (formviewfolder === 'forms' && queryString !== '') {
    //   queryString = `Form = '${fvfName}' and ${queryString}`
    // } else {
    //   queryString = `Form = '${fvfName}'`
    // }

    let nodejs = `
/**
 * @author Domino Admin <domino.admin@example.com>
 * Sample code only
 */
const { useServer } = require('@domino/domino-db');
const serverConfig = require('./server-config.js');
const databaseConfig = require('./database-config.js');

useServer(serverConfig).then(async server => {
  const database = await server.useDatabase(databaseConfig);
  const documents = await database.bulkReadDocuments({
    query: "${queryString}",
  });
  // documents is an array of documents -- one for each
  // document that matches the query
});
    `;

    let java = `
/**
* @author Domino Admin <domino.admin@example.com>
* Sample code only
*/
DominoQuery dq = db.createDominoQuery();
DocumentCollection doccol = dq.execute("${queryString}");
View ordfold db.EnableFolder("Orders_2018");
doccol.putAllInFolder("Orders_2018");
    `;

    let lotusscript = `
/**
* @author Domino Admin <domino.admin@example.com>
* Sample code only
*/
Sub Initialize
    Dim session As New NotesSession
    Dim Query As String
    Dim targetDb As NotesDatabase
    Dim thisDb As NotesDatabase
    Dim TheQuery As NotesDominoQuery
    Dim doccol As NotesDocumentCollection
    Set thisDb = session.CurrentDatabase
    Set targetDb = session.GetDatabase(thisDb.Server, "${filepath}")
    Set TheQuery = targetDb.CreateDominoQuery()
    Query = "${queryString}"
    Set doccol = TheQuery.Execute(Query)
End Sub
    `;

    let bash = `load domquery -f ${filepath} -q "${queryString}"`

    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

    return (
      <React.Fragment>
        <div className='filePath'>
          {queryname ? <div className='queryTitle'>{queryname} <span className='dbName'>From <strong>{databaseName}</strong> database</span></div> : <div className='queryTitle'>New {databaseName} db query</div>}
          {date ? <div className='saved-time'>Last saved <strong>{`${new Date(date).toLocaleString(undefined, dateOptions)}`}</strong></div> : ''}
          <div className='show-activity' onClick={onShowPanel}>show recent activity</div>
        </div>

        <ActivityPanel />

        { unid !== "0" && saved && displaysaved &&
          <MessageBar className="query-saved-success" messageBarType={MessageBarType.success} isMultiline={false} dismissButtonAriaLabel="Close">
            {`Query saved.`}
          </MessageBar>
        }

        { !saved &&
          <MessageBar className="query-saved-warning" messageBarType={MessageBarType.severeWarning} onDismiss={_dismissWarning()} isMultiline={false} dismissButtonAriaLabel="Close">
            {`You have unsaved updates.`}
          </MessageBar>
        }

        { queryAuthor && 
          <div className='action-buttons'>
            <ActionButton 
              className='save' iconProps={{ iconName: 'save' }} 
              allowDisabledFocus={true} disabled={!queryValid && !queryname && queryname === ''} 
              onClick={unid === '0' ? this.createEntry : this.updateEntry} >
              Save
            </ActionButton>
            <ActionButton 
              className='delete' iconProps={{ iconName: 'trash-alt' }} 
              allowDisabledFocus={true} disabled={unid === '0'} 
              onClick={this.deleteEntry} >
              Delete
            </ActionButton>
            <ActionButton 
              className='share' iconProps={{ iconName: 'share-square' }} 
              allowDisabledFocus={true} disabled={!queryValid && !queryname && queryname === ''} 
              onClick={() => onShareDialog(false)} >
              Share
            </ActionButton>
          </div>
        }

        <ShareDialog />
        <TextField
          errorMessage={true ? null : "Error message"}
          required={true}
          placeholder="Name"
          ariaLabel="Please enter text here"
          label="Query name"
          name="queryname"
          value={queryname}
          onChange={handleQueryNameChange}
          disabled={queryReader}
        />
        <AdvancedOptions 
          onChangeViewFolderName={onChangeViewFolderName} 
        />
        <Label>Query Builder</Label>

        {type === "group" && (
          <Group
            query={query}
            index={index}
          />
        )}

        <div className="resultsColPicker">
          <Dropdown
            placeholder="Select from list"
            label="Columns/fields to display in results"
            selectedKeys={query.selectedColumns}
            onChange={onTermChangeColumnsToDisplay}
            multiSelect
            options={options.sort(compare)}
            required={true}
          />
        </div>

        <PrimaryButton
          className='runQueryButton'
          onClick={this.runDQLQuery}
          disabled={(queryString === "" || queryRunning) ? true : false}
        >
          Run Query
        </PrimaryButton>
        
        { queryRunning && 
          <Spinner size={SpinnerSize.medium} label="Getting your data..." ariaLive="assertive" labelPosition="right" />
        }

        {queryString !== "" && runquery && queryValid && !queryRunning &&
          <React.Fragment>
            <div className="resultsCount">
              {
                results && results.length > 1 
                ? `(${results.length} matching documents found)` 
                : results && results.length === 1 
                ? `(${results.length} matching document found)`
                : !results || results.length === 0
                ? `(${results.length} matching documents found)`
                : ''
              }
              <PrimaryButton
                className={(results.length===0) ? "hiddenButton" : "viewResultsButton"}
                onClick={this.go2Results}
                disabled={(queryString === "" || queryRunning) ? true : false}
              >
                view results
              </PrimaryButton>
            </div>
            <p className="errorMessage">
              {errormessage}
            </p>
          </React.Fragment>
        }
        {
        }
        <Toggle
          className="adv-options"
          defaultChecked={false}
          label="Developer Options"
          inlineLabel={true}
          onChange={this._onAdvancedOptionsClick}
        />

        {showAdvancedOptions &&  
          <Pivot className="advanced-options">
            <PivotItem linkText="DQL" >
              <div className="codeDisplayArea">
                <CodeBlock refValue="dql" classValue="sql">
                  {queryString}
                </CodeBlock>
              </div>
            </PivotItem>
            <PivotItem linkText="Java" >
              <div className="codeDisplayArea">
                <CodeBlock refValue="java" classValue="java">
                  {java}
                </CodeBlock>
              </div>
            </PivotItem>
            <PivotItem linkText="Node.JS">
              <div className="codeDisplayArea">
                <CodeBlock refValue="javascript" classValue="javascript">
                  {nodejs}
                </CodeBlock>
              </div>
            </PivotItem>
            <PivotItem linkText="LotusScript">
              <div className="codeDisplayArea">
                <CodeBlock refValue="lotusscript" classValue="vbnet">                  
                  {lotusscript}
                </CodeBlock>
              </div>
            </PivotItem>
            <PivotItem linkText="Domino Console">
              <div className="codeDisplayArea">
                <CodeBlock refValue="bash" classValue="bash">                  
                  {bash}
                </CodeBlock>
              </div>
            </PivotItem>
            <PivotItem linkText="Explain">
              <div className="codeDisplayArea">
                <Label>Run and view results of explain</Label>
                <PrimaryButton
                  className='runExplainButton'
                  onClick={this.runDQLExplain}
                  disabled={queryString === "" ? true : false}
                >
                  Run Explain
                </PrimaryButton>
                <CodeBlock refValue="explain" classValue="html">
                  {explain}
                </CodeBlock>
                <CodeBlock refValue="explain" classValue="html">
                  {explainerrormessage}
                </CodeBlock>
              </div>
            </PivotItem>
          </Pivot>
        }
      </React.Fragment>
    );
  }
}

export default withApp(QueryBuilderApp);
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

import React, { Component } from 'react';
import update from "immutability-helper";
import uuidv4 from "uuid/v4";
import axios from "axios";

import './App.css';
import Main from './components/Main';
import MainHeader from './components/MainHeader';

import { registerIcons } from '@uifabric/styling';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faSave, faTrashAlt, 
  faShareSquare, faDatabase, 
  faFolder, faTasks, 
  faGripHorizontal, faGlobe,
  faUsers, faFile, 
  faChevronDown, faChevronUp, faChevronRight, faChevronLeft, 
  faArrowDown, faArrowUp, faBold, faHashtag, faCheck, faArrowLeft, 
  faCalendar, faArrowRight, faTag, faTable, faTimes,
  faDownload, faSortAlphaDown, faSortAlphaUp, faSortAmountDown, faUser, faPlusCircle
 } from '@fortawesome/free-solid-svg-icons';

import { people } from './components/querybuilder/PeoplePicker';

library.add(faSave, faUser, faPlusCircle, faCalendar, faCheck, faDownload, faSortAlphaDown, faSortAlphaUp, faSortAmountDown, faTimes, faHashtag, faBold, faTrashAlt, faShareSquare, faDatabase, faFolder, faTasks, faGripHorizontal, faGlobe, faUsers, faTable, faFile, faChevronDown, faChevronUp, faChevronRight, faChevronLeft, faArrowDown, faArrowUp, faArrowLeft, faArrowRight, faTag)

registerIcons({
  icons: {
    'save': <FontAwesomeIcon icon='save' />,
    'user': <FontAwesomeIcon icon='user' />,
    'CirclePlus': <FontAwesomeIcon icon='plus-circle' />,
    'trash-alt': <FontAwesomeIcon icon='trash-alt' />,
    'share-square': <FontAwesomeIcon icon='share-square' />,
    'database': <FontAwesomeIcon icon='database' />,
    'folder': <FontAwesomeIcon icon='folder' />,
    'folderhorizontal': <FontAwesomeIcon icon='folder' />,
    'showresults': <FontAwesomeIcon icon='folder' />,
    'previewlink': <FontAwesomeIcon icon='folder' />,
    'tasks': <FontAwesomeIcon icon='tasks' />,
    'grip': <FontAwesomeIcon icon='table' />,
    'globe': <FontAwesomeIcon icon='globe' />,
    'users': <FontAwesomeIcon icon='users' />,
    'file': <FontAwesomeIcon icon='file' />,
    'chevrondown': <FontAwesomeIcon icon='chevron-down' />,
    'chevron-up': <FontAwesomeIcon icon='chevron-up' />,
    'chevronrightmed': <FontAwesomeIcon icon='chevron-right' />,
    'chevron-left': <FontAwesomeIcon icon='chevron-left' />,
    'arrow-down': <FontAwesomeIcon icon='arrow-down' />,
    'Down': <FontAwesomeIcon icon='arrow-down' />,
    'arrow-up': <FontAwesomeIcon icon='arrow-up' />,
    'Up': <FontAwesomeIcon icon='arrow-up' />,
    'arrow-right': <FontAwesomeIcon icon='arrow-right' />,
    'arrow-left': <FontAwesomeIcon icon='arrow-left' />,
    'tag': <FontAwesomeIcon icon='tag' />,
    'checkmark': <FontAwesomeIcon icon='check' />,
    'warning': <FontAwesomeIcon icon='tag' />,
    'clear': <FontAwesomeIcon icon='times' />,
    'cancel': <FontAwesomeIcon icon='times' />,
    'inserttextbox': <FontAwesomeIcon icon='bold' />,
    'calendar': <FontAwesomeIcon icon='calendar' />,
    'numbersymbol': <FontAwesomeIcon icon='hashtag' />,
    'download': <FontAwesomeIcon icon='download' />,
    'sortup': <FontAwesomeIcon icon='sort-alpha-down' />,
    'sortdown': <FontAwesomeIcon icon='sort-alpha-up' />,
    'groupeddescending': <FontAwesomeIcon icon='sort-amount-down' />,
  }
});

export const AuthCtx = React.createContext({
  auth: {},
  formdata: {},
  formaction: {},
  results: [],
  explain: '',
  query: {},
  databases: {},
  savedqueries: {},
  selectedDatabase: {},
  onChangeFilePath: () => {},
  onShareDialog: () => {},
  onReadersChange: () => {},
  onAuthorsChange: () => {},
  onChangeResults: () => {},
  onChangeExplain: () => {},
  onDatabasesChange: () => {},
  addTerm: () => {},
  addGroup: () => {},
  removeTerm: () => {},
  removeGroup: () => {},
  onTermBooleanChange: () => {},
  onTermChange: () => {},
  onTermDateChange: () => {},
  onTermValueTypeChange: () => {},
  onGroupBooleanChange: () => {},
  addTermValue: () => {},
  onTermChangeColumnsToDisplay: () => {},
  handleQueryNameChange: () => {},
  onValuesChange: () => {},
  onImageChoiceGroupChange: () => {},
  onCreateEntry: () => {},
  onUpdateEntry: () => {},
  onDeleteQuery: () => {},
  getSavedQueries: () => {},
  onSelectedQuery: () => {},
  onChangeViewFolderName: () => {},
  onHidePanel: () => {},
  onShowPanel: () => {}
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: {
        username: '',
        password: '',
        displayName: '',
        roles: []
      },
      formdata: {
        readers: [],
        authors: [],
        unid: '0',
        showPanel: false,
      },
      formaction: {
        hideShareDialog: true,
        runquery: false,
        queryValid: false,
      },
      results: [],
      explain: '',
      query: {
        id: `group~0000`,
        children: [],
        selectedColumns: [],
      },
      databases: {},
      savedqueries: {
        items: [],
        groups: []
      },
      selectedDatabase: {
        filepath: '',
        databaseName: '',
        fvfName: '',
        formviewfolder: 'forms',
      },
      onChangeFilePath: this.onChangeFilePath,
      onShareDialog: this.onShareDialog,
      onReadersChange: this.onReadersChange,
      onAuthorsChange: this.onAuthorsChange,
      onChangeResults: this.onChangeResults,
      onChangeExplain: this.onChangeExplain,
      onDatabasesChange: this.onDatabasesChange,
      addTerm: this.addTerm,
      addGroup: this.addGroup,
      removeTerm: this.removeTerm,
      removeGroup: this.removeGroup,
      onTermBooleanChange: this.onTermBooleanChange,
      onTermChange: this.onTermChange,
      onTermDateChange: this.onTermDateChange,
      onTermValueTypeChange: this.onTermValueTypeChange,
      onGroupBooleanChange: this.onGroupBooleanChange,
      addTermValue: this.addTermValue,
      onTermChangeColumnsToDisplay: this.onTermChangeColumnsToDisplay,
      handleQueryNameChange: this.handleQueryNameChange,
      onValuesChange: this.onValuesChange,
      onImageChoiceGroupChange: this.onImageChoiceGroupChange,
      onCreateEntry: this.onCreateEntry,
      onUpdateEntry: this.onUpdateEntry,
      onDeleteQuery: this.onDeleteQuery,
      getSavedQueries: this.getSavedQueries,
      onSelectedQuery: this.onSelectedQuery,
      onChangeViewFolderName: this.onChangeViewFolderName,
      onShowPanel: this.onShowPanel,
      onHidePanel: this.onHidePanel
    };
  }

  componentDidMount() {
    const promote = `%c 
--                                                                                                                                                                                                                          
--  DDDDDDDDDDDDD               QQQQQQQQQ        LLLLLLLLLLL                                  
--  D::::::::::::DDD          QQ:::::::::QQ      L:::::::::L                                  
--  D:::::::::::::::DD      QQ:::::::::::::QQ    L:::::::::L                                  
--  DDD:::::DDDDD:::::D    Q:::::::QQQ:::::::Q   LL:::::::LL                                  
--    D:::::D    D:::::D  Q:::::::O   Q:::::::Q    L:::::L         xxxxxxx      xxxxxxx
--    D:::::D     D:::::D Q::::::O     Q:::::::Q   L:::::L          x:::::x    x:::::x 
--    D:::::D     D:::::D Q::::::O     Q:::::::Q   L:::::L           x:::::x  x:::::x  
--    D:::::D     D:::::D Q::::::O     Q:::::::Q   L:::::L            x:::::xx:::::x   
--    D:::::D     D:::::D Q::::::O     Q:::::::Q   L:::::L             x::::::::::x    
--    D:::::D     D:::::D Q::::::O     Q:::::::Q   L:::::L              x::::::::x     
--    D:::::D     D:::::D Q::::::O  QQQQ:::::::Q   L:::::L              x::::::::x     
--    D:::::D    D:::::D  Q:::::::O Q::::::::::Q   L:::::L     LLLLLL  x::::::::::x    
--  DDD:::::DDDDD:::::D    Q::::::::QQ::::::::Q  LL:::::::LLLLL:::::L x:::::xx:::::x   
--  D:::::::::::::::DD      QQ::::::::::::::Q    L::::::::::::::::::Lx:::::x  x:::::x  
--  D::::::::::::DDD          QQ:::::::::::Q     L::::::::::::::::::x:::::x    x:::::x 
--  DDDDDDDDDDDDD               QQQQQQQQ::::QQ   LLLLLLLLLLLLLLLLLLxxxxxxx      xxxxxxx
--                                      Q:::::Q                                            
--                                       QQQQQQ                                            
DQLx (the DQL EXPLORER)

Built with React and IBM Domino by 
               
Dimitri Prosper https://dprosper.github.io and
              
Scott Good https://scott-good.github.io/
    `
    console.log(promote, 'color: green; font-weight: bold;');

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios.get(`${context}getUser?OpenPage`,
        {},
        {}
      )
      .then(response => {
        const { userName, displayName, roles} = response.data.user;

        this.setState(
          update(this.state, {
            auth: { 
              userName: { $set: userName },
              displayName: { $set: displayName },
              roles: { $set: roles } 
            },
          })
        );
      });
  }

  onShowPanel = () => {
    this.setState(
      update(this.state, {
        formdata: { showPanel: { $set: true } }
      })
    );
  };

  onHidePanel = () => {
    this.setState(
      update(this.state, {
        formdata: { showPanel: { $set: false } }
      })
    );
  };

  onShareDialog = (showValue) => {
    this.setState(
      update(this.state, {
        formaction: { hideShareDialog: { $set: showValue } }
      })
    );
  };

  onReadersChange = (items) => {
    this.setState(
      update(this.state, {
        formdata: { 
          readers: { $set: items },
          saved: { $set: false }
        },
        formaction: { queryValid: { $set: false } },
        explain: { $set: '' }
      })
    );
  };

  onAuthorsChange = (items) => {
    this.setState(
      update(this.state, {
        formdata: { 
          authors: { $set: items },
          saved: { $set: false }
        },
        formaction: { queryValid: { $set: false } },
        explain: { $set: '' }
      })
    );
  };

  onChangeFilePath = (selectedDatabase) => {
    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios
    .get(
      `${context}getFormNamesFromDatabase?OpenAgent&path=${selectedDatabase.path}`,
      {},
      {}
    )
    .then(response => {
      let forms = response.data;
      let databases = this.state.databases;
      let entryToUpdate = this._getObject(databases, selectedDatabase.path);

      entryToUpdate.forms = forms;
   
      this.setState(
        update(this.state, {
          databases: { $set: databases },
        })
      );
    });

    this._initialize(selectedDatabase);
  };

  onDeleteQuery = () => {
    this._initialize();
    this.getSavedQueries();
  };

  onDatabasesChange = (databases) => {
    this.setState({
      databases: databases,
    });
  };

  getSavedQueries = () => {
    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios.get(`${context}api/data/collections/name/collections`, {	
      // auth: this.props.auth,	
      params: {	
        ps: 100	
      }	
    })	
    .then((response)=>{	
      this._transformResponseDAS(response.data)	
    })
  }

  onSelectedQuery = (unid) => {
    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    this._initialize();

    axios.get(`${context}api/data/documents/unid/${unid}`, {
      // auth: this.props.auth,	
      params: {	
        ps: 100	
      }	
    })	
    .then((response)=>{	
      const date = new Date(response.data['@modified']).toUTCString();
      const { 
        query, databaseName, 
        databasePath, collectionName, 
        collection_readers, collection_authors, 
        formviewfolder, fvfName, 
        documentHistoryAction, documentHistoryName, documentHistoryTimestamp,
        AuthorNames, CreatedBy
      } = response.data;
      let readers;
      let authors;
      if (collection_readers) {
        readers = [];
        if (Array.isArray(collection_readers)) { 
          collection_readers.map((reader) => {
            let obj = this._getObject(people, reader);
            readers.push(obj);
            return null;
          })

        } else {
          let reader = this._getObject(people, collection_readers);
          readers.push(reader);
        }
      }

      if (collection_authors) {
        authors = [];
        if (Array.isArray(collection_authors)) { 
          collection_authors.map((author) => {
            let obj = this._getObject(people, author);
            authors.push(obj);
            return null;
          })

        } else {
          let author = this._getObject(people, collection_authors);
          authors.push(author);
        }
      }

      let queryAuthor = false;
      let queryReader = true;

      if (CreatedBy === this.state.auth.userName) {
        queryAuthor = true;
        queryReader = false;
      }

      if (!queryAuthor) {
        if (AuthorNames.indexOf(this.state.auth.userName) > -1) {
          queryAuthor = true;
          queryReader = false;
        }
      }
      if (!queryAuthor) {
        AuthorNames.map((author) => {
          if (author.charAt(0) === '[' && this.state.auth.roles.indexOf(author.slice(1,-1)) > -1) {
            queryAuthor = true;
            queryReader = false;
          }
          return null
        })
      }

      const q = JSON.parse(query);

      const { databases } = this.state;

      let url1;
      let url2;
  
      if (formviewfolder === 'forms') {
        url1 = `${context}getFormNamesFromDatabase?OpenAgent&path=${databasePath}`
        url2 = `${context}getFieldNamesFromForm?OpenAgent&path=${databasePath}&form=${fvfName}`
      }
      if (formviewfolder === 'views') {
        url1 = `${context}getViewFolderNamesFromDatabase?OpenAgent&path=${databasePath}`
        url2 = `${context}getViewFolderDetailsFromDatabase?OpenAgent&path=${databasePath}&view=${fvfName}`
      }
      if (formviewfolder === 'folders') {
        url1 = `${context}getViewFolderNamesFromDatabase?OpenAgent&path=${databasePath}`
        url2 = `${context}getViewFolderDetailsFromDatabase?OpenAgent&path=${databasePath}&view=${fvfName}`
      }

      const getUrl1 = () => {
        return axios.get(url1);
      }
      
      const getUrl2 = () => {
        return axios.get(url2);
      }

      axios.all([getUrl1(), getUrl2()])
      .then(axios.spread((response1, response2) => {
        let data1 = response1.data;
        let entryToUpdate = this._getObject(databases, databasePath);

        if (formviewfolder === 'forms') {
          entryToUpdate.forms = data1;
        }
     
        if (formviewfolder === 'views') {
          entryToUpdate.viewsfolders = data1;
        }
  
        if (formviewfolder === 'folders') {
          entryToUpdate.viewsfolders = data1;
        }

        let data2 = response2.data;
        let databaseToUpdate = this._getObject(databases, databasePath);
        if (formviewfolder === 'forms') {
          let entryToUpdate = this._getObject(databaseToUpdate.forms, fvfName);
          entryToUpdate.fields = data2;
        }
        if (formviewfolder === 'views') {
          let entryToUpdate = this._getObject(databaseToUpdate.viewsfolders, fvfName);
          entryToUpdate.columns = data2;
        }
        if (formviewfolder === 'folders') {
          let entryToUpdate = this._getObject(databaseToUpdate.viewsfolders, fvfName);
          entryToUpdate.columns = data2;
        }

        this.setState(
          update(this.state, {
            query: { $set: q },
            databases: { $set: databases },
            selectedDatabase: {
              filepath: { $set: databasePath },
              databaseName: { $set: databaseName },
              formviewfolder: { $set: formviewfolder },
              fvfName: { $set: fvfName },
            },
            formdata: { 
              queryname: { $set: collectionName },
              unid: { $set: response.data['@unid'] },
              date: { $set: date },
              saved: { $set: true },
              readers: { $set: readers},
              authors: { $set: authors},
              actionHistory: { $set: documentHistoryAction},
              nameHistory: { $set: documentHistoryName},
              timestampHistory: { $set: documentHistoryTimestamp},
              queryAuthor: { $set: queryAuthor},
              queryReader: { $set: queryReader},
            },
            formaction: {
              queryValid: { $set: false },
            },
            results: { $set: [] },
            explain: { $set: '' },
          })
        );

      }));

    })
  }
  
  onChangeResults = (items) => {

    this.setState(
      update(this.state, {
        results: { $set: items.data },
        formaction: { 
          runquery: { $set: true },
          queryValid: { $set: true },
          errormessage: { $set: items.error.number ? items.error.message : '' }
        },
        explain: { $set: '' },
      })
    );

  };

  onChangeExplain = (explain) => {
    this.setState(
      update(this.state, {
        explain: { $set: explain.data.join('\n') },
        formaction: { 
          explainerrormessage: { $set: explain.error.number ? explain.error.message.join('\n') : '' }
        },
      })
    );

  };

  addTerm = index => {
    let children = this.state.query.children;

    const term = {
      id: `term~${uuidv4()}`,
      identifier: "",
      operator: "=",
      value: "",
      selectedKey: undefined,
      selectedItems: [],
      options: [],
      valueType: "text",
      parentId: index
    };

    if (index === "0000") {
      term.boolean = "and";
      children.push(term);
    } else {
      let group = children.find(child => child.id === `group~${index}`);
      let subchildren = group.children;
      term.boolean = "and";
      subchildren.push(term);
    }

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );

  };

  addGroup = index => {
    let children = this.state.query.children;
    const group = {
      id: `group~${uuidv4()}`,
      boolean: "and",
      children: [],
      parentId: index
    };

    if (index === "0000") {
      children.push(group);
    } else {
      let group = this._getObject(children, `group~${index}`);

      let subchildren = group.children;
      subchildren.push(group);
    }

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  filteredArray = (arr, elem) => {
    return arr.filter((item) => item !== elem)
  }

  removeTerm = index => {
    let children = this.state.query.children;
    let ruleToDelete = this._getObject(children, `term~${index}`);

    if (ruleToDelete.parentId === "0000") {
    children = this.filteredArray(children, ruleToDelete)
    } else {
    let parent = this._getObject(children, `group~${ruleToDelete.parentId}`);
    let parentToUpdate = children.map(query => query.id).indexOf(`group~${ruleToDelete.parentId}`);

    let parentchildren = this.filteredArray(parent.children, ruleToDelete);
    children[parentToUpdate].children = parentchildren;
    }

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  removeGroup = index => {
    let children = this.state.query.children;
    let groupToDelete = children.map(query => query.id).indexOf(`group~${index}`);

    children.splice(groupToDelete, 1);

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { 
          runquery: { $set: children.length > 0 },
          queryValid: { $set: false },
        },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  onTermBooleanChange = (index, event) => {
    let children = this.state.query.children;
    let term = this._getObject(children, `term~${index}`);

    term.boolean = event.target.value;

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  onTermChange = (index, attribute, data) => {
    const newValue = typeof data === "object" ? data.key : data;
    let children = this.state.query.children;
    let term = this._getObject(children, `term~${index}`);

    term[attribute] = newValue;

    if ((typeof data === "object") && (data.data) && (data.data.type === 'date')) {
      const date = new Date();
      const dateString = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);
      term.dateValue=date;
      term.value=dateString;
    }

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
    if (data.data && typeof data === "object") this.onTermValueTypeChange(index, data.data.type)
  };

  onTermValueTypeChange = (index, data) => {
    const newValue = data;
    let children = this.state.query.children;
    let entryToUpdate = this._getObject(children, `term~${index}`);

    entryToUpdate.valueType = newValue;

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },     
      })
    );

  };

  onTermDateChange = (id, attribute, data) => {
    if (data) {
      const newValue =data.getFullYear() + "-" + ('0' + (data.getMonth() + 1)).slice(-2) + "-" + ('0' + data.getDate()).slice(-2);
      let children = this.state.query.children;
      let entryToUpdate = this._getObject(children, id);

      entryToUpdate[attribute]=newValue;
      entryToUpdate.dateValue=data;

      console.log(entryToUpdate)
      this.setState(
        update(this.state, {
          query: { children: { $set: children } },
          formaction: { queryValid: { $set: false } },
          formdata: { saved: { $set: false }},
          explain: { $set: '' },     
        })
      );
    }
  };

  onGroupBooleanChange = (index, event) => {
    let children = this.state.query.children;
    let entryToUpdate = this._getObject(children, `group~${index}`);

    entryToUpdate.boolean = event.target.value;

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  addTermValue = id => {
    let children = this.state.query.children;
    let entryToUpdate = this._getObject(children, id);

    const newValue = entryToUpdate.value;

    let currentValues = entryToUpdate.options;
    currentValues.push({ key: newValue, text: newValue });

    let updatedSelectedItem = entryToUpdate.selectedItems ? this._copyArray(entryToUpdate.selectedItems) : [];

    updatedSelectedItem.push(newValue);

    entryToUpdate.options = currentValues;
    entryToUpdate.value = "";
    entryToUpdate.selectedItems = updatedSelectedItem;

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  onTermChangeColumnsToDisplay = (event, item) => {
    const updatedSelectedItem = this.state.query.selectedColumns
      ? this._copyArray(this.state.query.selectedColumns)
      : [];
    if (item.selected) {
      updatedSelectedItem.push(item.key);
    } else {
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }

    this.setState(
      update(this.state, {
        query: { selectedColumns: { $set: updatedSelectedItem } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' },
      })
    );
  };

  handleQueryNameChange = event => {
    this.setState(
      update(this.state, {
        formdata: { queryname: { $set: event.target.value } },
      })
    );
  };

  onCreateEntry = (unid, date) => {
    this.setState(
      update(this.state, {
        formdata: { 
          unid: { $set: unid },
          date: { $set: date },
          saved: { $set: true },
          displaysaved: { $set: true }
        },
      })
    );

    setTimeout(() => {
      this.setState(
        update(this.state, {
          formdata: { 
            displaysaved: { $set: false }
          },
        })
      );
    }, 2000);

    this.getSavedQueries();
  };

  onUpdateEntry = (unid, date) => {
    this.setState(
      update(this.state, {
        formdata: { 
          saved: { $set: true },
          date: { $set: date },
          displaysaved: { $set: true }
        },
      })
    );

    setTimeout(() => {
      this.setState(
        update(this.state, {
          formdata: { 
            displaysaved: { $set: false }
          },
        })
      );
    }, 2000);

    this.getSavedQueries();
  };

  onValuesChange = (id, event, item) => {
    let children = this.state.query.children;
    let entryToUpdate = this._getObject(children, id);

    let updatedSelectedItem = entryToUpdate.selectedItems ? this._copyArray(entryToUpdate.selectedItems) : [];
    if (item.selected) {
      updatedSelectedItem.push(item.key);
    } else {
      const currIndex = updatedSelectedItem.indexOf(item.key);
      if (currIndex > -1) {
        updatedSelectedItem.splice(currIndex, 1);
      }
    }

    entryToUpdate.selectedItems = updatedSelectedItem;

    this.setState(
      update(this.state, {
        query: { children: { $set: children } },
        formaction: { queryValid: { $set: false } },
        formdata: { saved: { $set: false }},
        explain: { $set: '' }
      })
    );
  };

  onImageChoiceGroupChange = (event, option) => {

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;
    const { selectedDatabase: { filepath } } = this.state;

    let url;
    if (option.key === 'forms') {
      url = `${context}getFormNamesFromDatabase?OpenAgent&path=${filepath}`
    }
    if (option.key === 'views') {
      url = `${context}getViewFolderNamesFromDatabase?OpenAgent&path=${filepath}`
    }
    if (option.key === 'folders') {
      url = `${context}getViewFolderNamesFromDatabase?OpenAgent&path=${filepath}`
    }

    axios
    .get(
      url,
      {},
      {}
    )
    .then(response => {
      let data = response.data;
      let databases = this.state.databases;

      let entryToUpdate = this._getObject(databases, filepath);

      if (option.key === 'forms') {
        entryToUpdate.forms = data;
      }
   
      if (option.key === 'views') {
        entryToUpdate.viewsfolders = data;
      }

      if (option.key === 'folders') {
        entryToUpdate.viewsfolders = data;
      }

      this.setState(
        update(this.state, {
          explain: { $set: '' },
          query: { 
            id: { $set: `group~0000`},
            children: { $set: []},
            selectedColumns: { $set: []},
          },
          selectedDatabase: { 
            formviewfolder: { $set: option.key },
            fvfName: { $set: '' },
          },
          databases: { $set: databases },
        })
      );
    });
  }

  onChangeViewFolderName = (event, option) => {

    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    const { selectedDatabase: { filepath, formviewfolder } } = this.state;
    let url;
    if (formviewfolder === 'forms') {
      url = `${context}getFieldNamesFromForm?OpenAgent&path=${filepath}&form=${option.key}`
    }
    if (formviewfolder === 'views') {
      url = `${context}getViewFolderDetailsFromDatabase?OpenAgent&path=${filepath}&view=${option.key}`
    }
    if (formviewfolder === 'folders') {
      url = `${context}getViewFolderDetailsFromDatabase?OpenAgent&path=${filepath}&view=${option.key}`
    }

    axios
    .get(
      url,
      {},
      {}
    )
    .then(response => {
      let data = response.data;
      let databases = this.state.databases;
      let databaseToUpdate = this._getObject(databases, filepath);
      let entryToUpdate;
      if (formviewfolder === 'forms') {
        entryToUpdate = this._getObject(databaseToUpdate.forms, option.key);
        entryToUpdate.fields = data;
      }
   
      if (formviewfolder === 'views') {
        entryToUpdate = this._getObject(databaseToUpdate.viewsfolders, option.key);
        entryToUpdate.columns = data;
      }

      if (formviewfolder === 'folders') {
        entryToUpdate = this._getObject(databaseToUpdate.viewsfolders, option.key);
        entryToUpdate.columns = data;
      }

      this.setState(
        update(this.state, {
          databases: { $set: databases },
          selectedDatabase: { 
            fvfName: { $set: option.key },
          },
          formaction: { queryValid: { $set: false } },
          formdata: { saved: { $set: false }},
          explain: { $set: '' },
          query: { selectedColumns: { $set: [] } },
        })
      );
    });

  }

  render() {
    return (
      <AuthCtx.Provider value={this.state}>
        <div className="App">
          <MainHeader />
          <Main />
        </div>
      </AuthCtx.Provider>
    );
  }

  _getObject = (theObject, value) => {
    var result = null;
    if(theObject instanceof Array) {
      for(var i = 0; i < theObject.length; i++) {
        result = this._getObject(theObject[i], value);
        if (result) {
            break;
        }   
      }
    }
    else
    {
      for(var prop in theObject) {
        if((prop === 'id') || (prop === 'tertiaryText') || (prop === 'filepath') || (prop === 'name') || (prop === 'alias')) {
          if(theObject[prop] === value) {
            return theObject;
          }
        }
        if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
          result = this._getObject(theObject[prop], value);
          if (result) {
            break;
          }
        } 
      }
    }
    return result;
  }

  _copyArray = array => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray[i] = array[i];
    }
    return newArray;
  };

  _initialize = (selectedDatabase) => {

    if (selectedDatabase) {
      
      this.setState(
        update(this.state, {
          selectedDatabase: {
            filepath: { $set: selectedDatabase.path },
            databaseName: { $set: selectedDatabase.name },
            fvfName: { $set: '' },
            formviewfolder: { $set: 'forms' }
          },
          formaction: { 
            queryValid: { $set: false }
          },
          explain: { $set: '' },
          query: { 
            id: { $set: `group~0000`},
            children: { $set: []},
            selectedColumns: { $set: []},
          },
          formdata: {
            readers: { $set: []},
            authors: { $set: []},
            unid: { $set: `0`},
            queryname: { $set: ''},
            saved: { $set: true },
            date: { $set: '' },
            queryAuthor: { $set: true},
            queryReader: { $set: false},
          },
          results: { $set: [] },
        })
      );
    } else {
      this.setState(
        update(this.state, {
          selectedDatabase: {
            filepath: { $set: '' },
            databaseName: { $set: '' },
            fvfName: { $set: '' },
            formviewfolder: { $set: 'forms' }
          },
          formaction: {
            queryValid: { $set: false }
          },
          explain: { $set: '' },
          query: { 
            id: { $set: `group~0000`},
            children: { $set: []},
            selectedColumns: { $set: []},
          },
          formdata: {
            readers: { $set: []},
            authors: { $set: []},
            unid: { $set: `0`},
            queryname: { $set: ''},
            saved: { $set: true },
            date: { $set: '' },
          },
          results: { $set: []},
        })
      );
    }
  }

  _transformResponseDAS = (collections) => {
    
    function compare(a,b) {	
      if (a.databaseName < b.databaseName)	
        return 1;	
      if (a.databaseName > b.databaseName)	
        return 1;	
      return 0;	
    }	
    	
    collections.sort(compare);	
	
    let items =[];	
    let groups = [];	
    let itemCount = 0;	
    let itemIndex = 0;	
    let groupKey = '';	
    let groupName = '';	
	
    let lastItem = collections.length - 1;	
    collections.map((entry, index) => {	
        if (entry['@category']) {	
          if (groupKey === '') {	
            groupKey = entry['@entryid'];	
            groupName = entry.databaseName;	
          }	
  
          if (itemCount === 0)  {	
            groupKey = entry['@entryid'];	
            groupName = entry.databaseName;	
          }

          if (itemCount > 0)  {	
            groups.push({	
              key: groupKey,	
              name: groupName,	
              startIndex: itemIndex,	
              count: itemCount,	
              isCollapsed: true
            })	
            	
            itemIndex = itemIndex + itemCount;	
            itemCount = 0;	
            groupKey = entry['@entryid'];	
            groupName = entry.databaseName;	
            	
          }	
	
        } else {	
          itemCount = itemCount + 1;	
          items.push({	
            key: entry['@unid'],	
            name: entry.collectionName	
          })	
	
          if (index === lastItem) {	
            groups.push({	
              key: groupKey,	
              name: groupName,	
              startIndex: itemIndex,	
              count: itemCount,
              isCollapsed: true
            })	
          }	
        }	
  	
        return null;	
      }	
    )	

    this.setState(
      update(this.state, {
        savedqueries: { 
          items: { $set: items },
          groups: { $set: groups }
       }
      })
    );
  }
}

export default App;

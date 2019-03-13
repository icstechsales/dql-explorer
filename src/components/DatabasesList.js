/**
 * Copyright (c) International Business Machines
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode
} from "office-ui-fabric-react/lib/DetailsList";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import { mergeStyleSets } from "office-ui-fabric-react/lib/Styling";
import {
  ScrollablePane,
  ScrollbarVisibility
} from "office-ui-fabric-react/lib/ScrollablePane";
import { Sticky, StickyPositionType } from "office-ui-fabric-react/lib/Sticky";
import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import axios from "axios";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import withApp from "../withApp";

const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: "16px"
  },
  fileIconCell: {
    textAlign: "center",
    selectors: {
      "&:before": {
        content: ".",
        display: "inline-block",
        verticalAlign: "middle",
        height: "100%",
        width: "0px",
        visibility: "hidden"
      }
    }
  }
});

const _items = [];

class DatabaseList extends React.Component {
  _selection;

  constructor(props) {
    super(props);

    const columns = [
      {
        key: "column1",
        name: "File Type",
        className: classNames.fileIconCell,
        iconClassName: classNames.fileIconHeaderIcon,
        ariaLabel:
          "Column operations for File type, Press to sort on File type",
        iconName: "file",
        isIconOnly: true,
        fieldName: "name",
        minWidth: 16,
        maxWidth: 16,
        // onColumnClick: this._onColumnClick,
        onRender: () => ( <FontAwesomeIcon icon='database' />)
      },
      {
        key: "column2",
        name: "Title",
        fieldName: "name",
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        // onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true
      },
      {
        key: "column3",
        name: "Path",
        fieldName: "path",
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: false,
        isSortedDescending: false,
        sortAscendingAriaLabel: "Sorted A to Z",
        sortDescendingAriaLabel: "Sorted Z to A",
        // onColumnClick: this._onColumnClick,
        data: "string",
        isPadded: true
      }
    ];

    this._selection = new Selection({
      
      onSelectionChanged: () => {
        this.setState({
          selectedDatabase: this._getSelectedDatabase().path
        });
        this.props.onChangeFilePath(this._getSelectedDatabase());
        this.props.handlePivotClick('query');
      }
    });

    this.state = {
      items: _items,
      columns: columns,
      selectedDatabase: this.props.selectedDatabase.filepath,
      isModalSelection: false,
      isCompactMode: false
    };
  }

  componentDidMount() {
    const context = process.env.NODE_ENV === 'development' ? `/dqlexplorer.nsf/` : ``;

    axios
      .get(
        `${context}getdatabasesfromserver?OpenAgent`,
        {},
        {}
      )
      .then(response => {
        let databases = response.data.databases;
        this.props.onDatabasesChange(databases);

        // _items.length = 0;

        // databases.map(database => {
        //   _items.push({
        //     name: database.title,
        //     value: database.filename,
        //     path: database.filepath,
        //     type: "file"
        //   });
        //   return _items;
        // });

        // console.log(_items);
        // this.setState({
        //   items: _items
        // });
      });
  }

  componentDidUpdate(previousProps, previousState) {
    if (
      previousState.isModalSelection !== this.state.isModalSelection &&
      !this.state.isModalSelection
    ) {
      this._selection.setAllSelected(false);
    }
  }

  updateColumns = (action) => {
    const { columns } = this.state;

    if (action === "remove") columns.pop();
    
    if (action === "add") columns.push({
      key: "column3",
      name: "Path",
      fieldName: "path",
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: false,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      onColumnClick: this._onColumnClick,
      data: "string",
      isPadded: true
    });

    this.setState({
      columns: columns
    });
  }

  render() {
    const { columns, isCompactMode, isModalSelection } = this.state;
    const { databases } = this.props;

    let items = [];
    if (databases.length>0) {
      databases.map(database => {
        items.push({
          name: database.title,
          value: database.filename,
          path: database.filepath,
          type: "file"
        });
        items.sort(this._compare);
        return items;
      });
    }

    return (
      <React.Fragment>
        <div className='filePath'>Select Database</div>

        {/* <Sticky stickyPosition={StickyPositionType.Header}>
          <TextField
            label="Filter"
            onChange={this._onChangeText}
          />
          <Label>Databases</Label>
        </Sticky> */}
        { databases.length > 0 && 
          <div
            style={{
              height: "50vh",
              position: "relative"
            }}
          >
            <ScrollablePane
              componentRef={this._scrollablePane}
              scrollbarVisibility={ScrollbarVisibility.auto}
            >
              <MarqueeSelection selection={this._selection}>
                <DetailsList
                  className={classNames.list}
                  items={items}
                  compact={isCompactMode}
                  columns={columns}
                  selectionMode={
                    isModalSelection ? SelectionMode.multiple : SelectionMode.none
                  }
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                  selection={this._selection}
                  selectionPreservedOnEmptyClick={true}
                  enterModalSelectionOnTouch={true}
                  ariaLabelForSelectionColumn="Toggle selection"
                  ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                  onRenderDetailsHeader={onRenderDetailsHeader}
                />
              </MarqueeSelection>
            </ScrollablePane>
          </div>
        }
        
        { !databases.length && 
          <Spinner size={SpinnerSize.large} label="Loading databases..." ariaLive="assertive" labelPosition="right" />
        }

      </React.Fragment>
    );
  }

  _onChangeText = (ev, text) => {
    this.setState({
      items: text
        ? _items.filter(i => i.name.toLowerCase().indexOf(text) > -1)
        : _items
    });
  };

  _getSelectedDatabase = () => {
    const selectionCount = this._selection.getSelectedCount();

    if (selectionCount === 1) {
      return this._selection.getSelection()[0];
    }
  };

  _onColumnClick = (ev, column) => {
    const { columns, items } = this.state;
    const newColumns = columns.slice();
    const currColumn = newColumns.filter(
      currCol => column.key === currCol.key
    )[0];
    newColumns.forEach(newCol => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(
      items,
      currColumn.fieldName,
      currColumn.isSortedDescending
    );
    this.setState({
      columns: newColumns,
      items: newItems
    });
  };

  _compare = (a,b) => {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }
}

function onRenderDetailsHeader(props, defaultRender) {
  return (
    <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
      {defaultRender({
        ...props,
        onRenderColumnHeaderTooltip: tooltipHostProps => (
          <TooltipHost {...tooltipHostProps} />
        )
      })}
    </Sticky>
  );
}
function _copyAndSort(items, columnKey, isSortedDescending) {
  const key = columnKey;
  return items
    .slice(0)
    .sort((a, b) =>
      (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
    );
}

export default withApp(DatabaseList);

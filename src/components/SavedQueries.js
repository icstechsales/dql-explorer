/**
 * @file Component to read and display the saved queries on the server
 * @author Dimitri Prosper (IBM) <dimitri_prosper@us.ibm.com>
 * @author Dimitri Prosper (Personal) <dimitri.prosper@gmail.com>
 * @contributor Scott Good (IBM) <scott.good@us.ibm.com>
 * @todo see inline TODO comments
 */

import React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import {
  DetailsList,
  Selection,
  SelectionMode
} from "office-ui-fabric-react/lib/DetailsList";
import withApp from '../withApp';

class SavedQueries extends BaseComponent {
  _root = React.createRef();
  _selection;

  constructor(props) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        const unid = this._getSelectionDetails();
        if (unid) {
          this.props.onSelectedQuery(this._getSelectionDetails());
          this.props.handlePivotClick('query');
        }
      }
    });
    
    this.state = {
      columns: [
        {
          key: 'name',
          name: 'Saved Queries by Source',
          fieldName: 'name',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true
        }
      ],
      showItemIndexInView: false,
      isCompactMode: true
    };
  }

  componentDidMount = () => {
    this.props.getSavedQueries();
  }
  
  render() {
    const { columns, isCompactMode } = this.state;
    const { savedqueries } = this.props;

    return (
      <React.Fragment>
        <DetailsList
          componentRef={this._root}
          items={savedqueries.items}
          groups={savedqueries.groups}
          columns={columns}
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          ariaLabelForSelectionColumn="Toggle selection"
          groupProps={{
            showEmptyGroups: true,
            isAllGroupsCollapsed: true
          }}
          onRenderItemColumn={this._onRenderColumn}
          compact={isCompactMode}
          selectionMode={SelectionMode.none}
          selection={this._selection}
        />
      </React.Fragment>
    );
  }

  _onRenderColumn(item, index, column) {
    const value = item && column && column.fieldName ? item[column.fieldName] || '' : '';

    return <div data-is-focusable={true}>{value}</div>;
  }

  _getSelectionDetails() {
    const selectionCount = this._selection.getSelectedCount();
    switch (selectionCount) {
      case 1:
        return (this._selection.getSelection()[0]).key;
      default:
        return undefined;
    }
  }
}

export default withApp(SavedQueries)
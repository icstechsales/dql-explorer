/**
 * @file Component to display the query results
 * @author Dimitri Prosper (IBM) <dimitri_prosper@us.ibm.com>
 * @author Dimitri Prosper (Personal) <dimitri.prosper@gmail.com>
 * @contributor Scott Good (IBM) <scott.good@us.ibm.com>
 * @todo see inline TODO comments
 */

import React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { DirectionalHint, ContextualMenu } from 'office-ui-fabric-react/lib/ContextualMenu';
import {
  CheckboxVisibility,
  ColumnActionsMode,
  ConstrainMode,
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  buildColumns
} from 'office-ui-fabric-react/lib/DetailsList';
// import { createListItems, isGroupable } from 'office-ui-fabric-react/lib/utilities/exampleData';
import { memoizeFunction } from 'office-ui-fabric-react/lib/Utilities';
import { getTheme, mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';

import { columnsToString } from '../lib/utils';

import withApp from '../withApp';

const theme = getTheme();
const classNames = mergeStyleSets({
  headerDivider: {
    display: 'inline-block',
    height: '100%'
  },
  headerDividerBar: {
    display: 'none',
    background: theme.palette.themePrimary,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '1px',
    zIndex: 5
  },
  linkField: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  }
});
const rootClass = mergeStyles({
  selectors: {
    [`.${classNames.headerDivider}:hover + .${classNames.headerDividerBar}`]: {
      display: 'inline'
    }
  }
});

const DEFAULT_ITEM_LIMIT = 5;
const PAGING_SIZE = 10;
const PAGING_DELAY = 2000;
const ITEMS_COUNT = 5;

let _items = [
  {order_no : "146750", sales_person: "Chad Keighley", date_origin : "10/02/2018"},
]

class Results extends React.Component {
  _isFetchingItems;
  _selection;

  constructor(props) {
    super(props);

    this._getCommandItems = memoizeFunction(this._getCommandItems);

    this._selection = new Selection({
      onSelectionChanged: this._onItemsSelectionChanged
    });
    this._selection.setItems(_items, false);

    this.state = {
      items: _items,
      selectionCount: 0,
      groups: undefined,
      groupItemLimit: DEFAULT_ITEM_LIMIT,
      layoutMode: DetailsListLayoutMode.justified,
      constrainMode: ConstrainMode.horizontalConstrained,
      selectionMode: SelectionMode.none,
      canResizeColumns: true,
      checkboxVisibility: CheckboxVisibility.onHover,
      columns: this._buildColumns(_items, true, this._onColumnClick, '', undefined, undefined, this._onColumnContextMenu),
      contextualMenuProps: undefined,
      sortedColumnKey: 'name',
      isSortedDescending: false,
      isLazyLoaded: false,
      isHeaderVisible: true
    };
  }

  componentDidMount = () => {
    const { results } = this.props;
    _items = results;
    this.setState({
      items: _items,
      columns: this._buildColumns(_items, true, this._onColumnClick, '', undefined, undefined, this._onColumnContextMenu),
    });
  }
  
  render() {
    const {
      canResizeColumns,
      checkboxVisibility,
      columns,
      constrainMode,
      contextualMenuProps,
      groupItemLimit,
      groups,
      isHeaderVisible,
      isLazyLoaded,
      items,
      layoutMode,
      selectionMode
    } = this.state;

    // const isGrouped = groups && groups.length > 0;
    const groupProps = {
      getGroupItemLimit: (group) => {
        if (group) {
          return group.isShowingAll ? group.count : Math.min(group.count, groupItemLimit);
        } else {
          return items.length;
        }
      },
      footerProps: {
        showAllLinkText: 'Show all'
      }
    };

    return (
      <div className={rootClass}>
        <CommandBar
          styles={{ root: { marginBottom: '40px' } }}
          items={this._getCommandItems(
            canResizeColumns,
            checkboxVisibility,
            constrainMode,
            isHeaderVisible,
            isLazyLoaded,
            layoutMode,
            selectionMode
          )}
        />

        <DetailsList
          setKey="items"
          items={items}
          selection={this._selection}
          groups={groups}
          columns={columns}
          checkboxVisibility={checkboxVisibility}
          layoutMode={layoutMode}
          isHeaderVisible={isHeaderVisible}
          selectionMode={selectionMode}
          constrainMode={constrainMode}
          groupProps={groupProps}
          enterModalSelectionOnTouch={true}
          onItemInvoked={this._onItemInvoked}
          onItemContextMenu={this._onItemContextMenu}
          selectionZoneProps={{
            selection: this._selection,
            disableAutoSelectOnInputElements: true,
            selectionMode: selectionMode
          }}
          ariaLabelForListHeader="Column headers. Click to sort."
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          ariaLabelForSelectionColumn="Toggle selection"
          onRenderMissingItem={this._onRenderMissingItem}
        />

        {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
      </div>
    );
  }

  _onChangeText = (ev, text) => {
    this.setState({
      items: text
        ? _items.filter(i => i.sales_person.toLowerCase().indexOf(text) > -1)
        : _items
    });
  };

  _onRenderDivider = (
    columnProps,
    defaultRenderer
  ) => {
    const { columnIndex } = columnProps;
    return (
      <React.Fragment key={`divider-wrapper-${columnIndex}`}>
        <span className={classNames.headerDivider}>{defaultRenderer(columnProps)}</span>
        <span className={classNames.headerDividerBar} />
      </React.Fragment>
    );
  };

  _onDataMiss(index) {
    index = Math.floor(index / PAGING_SIZE) * PAGING_SIZE;

    if (!this._isFetchingItems) {
      this._isFetchingItems = true;

      setTimeout(() => {
        this._isFetchingItems = false;
        const itemsCopy = [...this.state.items];

        itemsCopy.splice(index, PAGING_SIZE).concat(_items.slice(index, index + PAGING_SIZE));

        this.setState({
          items: itemsCopy
        });
      }, PAGING_DELAY);
    }
  }

  _onRenderMissingItem = (index) => {
    this._onDataMiss(index);
    return null;
  };

  _onToggleLazyLoad = () => {
    let { isLazyLoaded } = this.state;

    isLazyLoaded = !isLazyLoaded;

    this.setState({
      isLazyLoaded: isLazyLoaded,
      items: isLazyLoaded ? _items.slice(0, PAGING_SIZE).concat(new Array(ITEMS_COUNT - PAGING_SIZE)) : _items
    });
  };

  _onToggleHeaderVisible = () => {
    this.setState({ isHeaderVisible: !this.state.isHeaderVisible });
  };

  _onToggleResizing = () => {
    const { items, sortedColumnKey, isSortedDescending } = this.state;
    let { canResizeColumns } = this.state;

    canResizeColumns = !canResizeColumns;

    this.setState({
      canResizeColumns: canResizeColumns,
      columns: this._buildColumns(items, canResizeColumns, this._onColumnClick, sortedColumnKey, isSortedDescending)
    });
  };

 _onCheckboxVisibilityChanged = (ev, menuItem) => {
    this.setState({ checkboxVisibility: menuItem.data });
  };

 _onLayoutChanged = (ev, menuItem) => {
    this.setState({ layoutMode: menuItem.data });
  };

 _onConstrainModeChanged = (ev, menuItem) => {
    this.setState({ constrainMode: menuItem.data });
  };

 _onSelectionChanged = (ev, menuItem) => {
    this.setState({ selectionMode: menuItem.data });
  };

 _onItemLimitChanged = (ev, value) => {
    let newValue = parseInt(value, 10);
    if (isNaN(newValue)) {
      newValue = DEFAULT_ITEM_LIMIT;
    }
    this.setState({ groupItemLimit: newValue });
  };

  _getCommandItems = (
    canResizeColumns,
    checkboxVisibility,
    constrainMode,
    isHeaderVisible,
    isLazyLoaded,
    layoutMode,
    selectionMode
  ) => {
    return [
      {
        key: 'downloadCSV',
        text: 'Download in CSV',
        iconProps: { iconName: 'Download' },
        onClick: this._onDownloadCSV
      },
      {
        key: 'downloadJSON',
        text: 'Download in JSON',
        iconProps: { iconName: 'Download' },
        onClick: this._onDownloadJSON
      },
    ];
  };

  _getContextualMenuProps(ev, column) {
    const items = [
      {
        key: 'aToZ',
        name: 'A to Z',
        iconProps: { iconName: 'SortUp' },
        canCheck: true,
        checked: column.isSorted && !column.isSortedDescending,
        onClick: () => this._onSortColumn(column.key, false)
      },
      {
        key: 'zToA',
        name: 'Z to A',
        iconProps: { iconName: 'SortDown' },
        canCheck: true,
        checked: column.isSorted && column.isSortedDescending,
        onClick: () => this._onSortColumn(column.key, true)
      }
    ];

    if (isGroupable(column.key)) {
      items.push({
        key: 'groupBy',
        name: 'Group by ' + column.name,
        iconProps: { iconName: 'GroupedDescending' },
        canCheck: true,
        checked: column.isGrouped,
        onClick: () => this._onGroupByColumn(column)
      });
    }

    return {
      items: items,
      target: ev.currentTarget,
      directionalHint: DirectionalHint.bottomLeftEdge,
      gapSpace: 10,
      isBeakVisible: true,
      onDismiss: this._onContextualMenuDismissed
    };
  }

  _onItemInvoked = (item, index) => {
    console.log('Item invoked', item, index);
  };

  _onItemContextMenu = (item, index, ev) => {
    const contextualMenuProps = {
      target: ev.target,
      items: [
        {
          key: 'text',
          name: `${this._selection.getSelectedCount()} selected`
        }
      ],
      onDismiss: () => {
        this.setState({
          contextualMenuProps: undefined
        });
      }
    };

    if (index > -1) {
      this.setState({
        contextualMenuProps: contextualMenuProps
      });
    }

    return false;
  };

  _onColumnClick = (ev, column) => {
    if (column.columnActionsMode !== ColumnActionsMode.disabled) {
      this.setState({
        contextualMenuProps: this._getContextualMenuProps(ev, column)
      });
    }
  };

  _onColumnContextMenu = (column, ev) => {
    if (column.columnActionsMode !== ColumnActionsMode.disabled) {
      this.setState({
        contextualMenuProps: this._getContextualMenuProps(ev, column)
      });
    }
  };

  _onContextualMenuDismissed = () => {
    this.setState({
      contextualMenuProps: undefined
    });
  };

  _onSortColumn = (columnKey, isSortedDescending) => {
    const sortedItems = _copyAndSort(_items, columnKey, isSortedDescending);

    this.setState({
      items: sortedItems,
      groups: undefined,
      columns: this._buildColumns(
        sortedItems,
        true,
        this._onColumnClick,
        columnKey,
        isSortedDescending,
        undefined,
        this._onColumnContextMenu
      ),
      isSortedDescending: isSortedDescending,
      sortedColumnKey: columnKey
    });
  };

  _onGroupByColumn = (column) => {
    const { key, isGrouped } = column;
    const { sortedColumnKey, isSortedDescending, groups, items, columns } = this.state;

    if (isGrouped) {
      // ungroup
      this._onSortColumn(sortedColumnKey, !!isSortedDescending);
    } else {
      let groupedItems = [];
      let newGroups;
      if (groups) {
        newGroups = [...groups];
        groupedItems = this._groupByKey(newGroups, items, key);
      } else {
        groupedItems = _copyAndSort(items, key);
        newGroups = this._getGroups(groupedItems, key);
      }

      for (const c of columns) {
        if (c.key === key) {
          c.isGrouped = true;
          break;
        }
      }
      this.setState({
        items: groupedItems,
        columns: [...columns],
        groups: newGroups
      });
    }
  };

  _groupByKey(groups, items, key) {
    let groupedItems = [];
    if (groups) {
      for (const group of groups) {
        if (group.children && group.children.length > 0) {
          const childGroupedItems = this._groupByKey(group.children, items, key);
          groupedItems = groupedItems.concat(childGroupedItems);
        } else {
          const itemsInGroup = items.slice(group.startIndex, group.startIndex + group.count);
          const nextLevelGroupedItems = _copyAndSort(itemsInGroup, key);
          groupedItems = groupedItems.concat(nextLevelGroupedItems);
          group.children = this._getGroups(nextLevelGroupedItems, key, group);
        }
      }
    }
    return groupedItems;
  }

  _getGroups(groupedItems, key, parentGroup) {
    const separator = '-';
    const groups = groupedItems.reduce(
      (current, item, index) => {
        const currentGroup = current[current.length - 1];
        const itemColumnValue = item[key];

        if (!currentGroup || this._getLeafGroupKey(currentGroup.key, separator) !== itemColumnValue) {
          current.push({
            key: (parentGroup ? parentGroup.key + separator : '') + itemColumnValue,
            name: key + ': ' + itemColumnValue,
            startIndex: parentGroup ? parentGroup.startIndex + index : index,
            count: 1,
            level: parentGroup ? parentGroup.level + 1 : 0
          });
        } else {
          currentGroup.count++;
        }
        return current;
      },
      []
    );

    return groups;
  }

  _getLeafGroupKey(key, separator) {
    let leafKey = key;
    if (key.indexOf(separator) !== -1) {
      const arrKeys = key.split(separator);
      leafKey = arrKeys[arrKeys.length - 1];
    }
    return leafKey;
  }

  _onDownloadCSV = () => {
    const { items } = this.state;
    var keyNames = Object.keys(items[0]);
    let csv=`${columnsToString(keyNames)}\n`;
  
    items.forEach((n, index) => {
      keyNames.forEach(key => {
        csv += `${n[key]},`
      });
      csv += `\n`
    })
  
    const url = window.URL.createObjectURL(new Blob([csv]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dqlresults.csv');
    document.body.appendChild(link);
    link.click();
  }

  _onDownloadJSON = () => {
    const { items } = this.state;
    
    const json = JSON.stringify(items);
  
    const url = window.URL.createObjectURL(new Blob([json]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dqlresults.json');
    document.body.appendChild(link);
    link.click();
  }

  _onItemsSelectionChanged = () => {
    this.setState({
      selectionCount: this._selection.getSelectedCount()
    });
  };

  _buildColumns(
    items,
    canResizeColumns,
    onColumnClick,
    sortedColumnKey,
    isSortedDescending,
    groupedColumnKey,
    onColumnContextMenu
  ) {
    const columns = buildColumns(items, canResizeColumns, onColumnClick, sortedColumnKey, isSortedDescending, groupedColumnKey);

    columns.forEach(column => {
      column.onRenderDivider = this._onRenderDivider;
      column.onColumnContextMenu = onColumnContextMenu;
      column.ariaLabel = `Operations for ${column.name}`;
      if (column.key === 'thumbnail') {
        column.iconName = 'Picture';
        column.isIconOnly = true;
      } else if (column.key === 'description') {
        column.isMultiline = true;
        column.minWidth = 200;
      } else if (column.key === 'name') {
        column.onRender = (item) => <Link data-selection-invoke={true}>{item.name}</Link>;
      } 
    });

    return columns;
  }
}

function _copyAndSort(items, columnKey, isSortedDescending) {
  const key = columnKey ;
  return items.slice(0).sort((a, b) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

//@todo add more columns that are groupable
function isGroupable(key) {
  return key === 'sales_person' || key === 'partno' || key === 'Grapes' || key === 'Region' || key === 'Producer';
}

export default withApp(Results);
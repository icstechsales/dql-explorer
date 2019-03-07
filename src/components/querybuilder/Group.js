import React from "react";

import withApp from '../../withApp';
import Term from "./Term";

var booleans = [
  { value: "and", display: "and", className: "and" },
  { value: "or", display: "or", className: "or" },
  { value: "and not", display: "and not", className: "andnot" },
  { value: "or not", display: "or not", className: "ornot" }
];

var booleanOptions = booleans.map( (boolean, index) => {
  var classString = "operator " + boolean.className;
  return (
    <option className={classString} value={boolean.value} key={index}>
      {boolean.display}
    </option>
  );
});

const Group = ({ indexValue, query, addTerm, addGroup, onGroupBooleanChange, removeGroup, childQuery }) => {

    let tmpQuery = {};
    let index = '';

    if (childQuery) {
      // type = groupQuery.id.split('~')[0];
      index = childQuery.id.split('~')[1];
      tmpQuery = childQuery;
    } else {
      // type = query.id.split('~')[0];
      index = query.id.split('~')[1];
      tmpQuery = query;
    }

    var childrenViews = tmpQuery.children.map( (q, index) => {
      let qType = q.id.split('~')[0];
      let qIndex = q.id.split('~')[1];

      if (qType === "group" && qIndex !== "0000") {
        return (
          <Group
            key={qIndex}
            index={qIndex}
            indexValue={index}
            childQuery={q}
            addTerm={addTerm}
            addGroup={addGroup}
            removeGroup={removeGroup}
            onGroupBooleanChange={onGroupBooleanChange}
          />
        );
      } else {
        return (
          <Term
            key={qIndex}
            index={qIndex}
            indexValue={index}
            childQuery={q}
          />
        );
      }
    });

    return (
      <div className={ 'queryArea' }>
        <div className='queryContainer'>
          <div className="query conditionGroup">
          { index !== '0000' && indexValue !== 0 && 
            <select
              className="operators group"
              value={tmpQuery.boolean}
              onChange={(event) => onGroupBooleanChange(index, event)}
            >
              {booleanOptions}
            </select>
          }
            <button
              className="conditionGroupButton addCondition"
              onClick={() => addTerm(index)}
            >
              + Add Condition
            </button>
            { index === '0000' &&
              <button
                className="conditionGroupButton addGroup"
                onClick={() => addGroup(index)}
              >
                + Add Group
              </button>
            }
            { index !== '0000' && <button
              className="conditionGroupButton removeGroup"
              onClick={() => removeGroup(index)}
            >
              - Remove Group
            </button>
            }
            <div className="childrenConditions queryItem">{childrenViews}</div>
          </div>
        </div>
      </div>
    );
  }

export default withApp(Group);

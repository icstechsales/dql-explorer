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

const _selectedToString = (selectedItems) => {
  let result='';
  
  selectedItems.map((item, index) => (
    result += index===0 ? `'${item}'` : `,'${item}'`
  ));

  return result;
}

const _queryToString = (query, pos, formviewfolder, fvfName) => {
  let result='';

  let type = query.id.split("~")[0];

  if (pos && pos !== 0 && query.boolean) {
    result += ` ${query.boolean} `;
  }

  if (type === "group") {
    let i;
    let length;

    if (query.parentId === '0000' && query.children.length > 1) result += '('; // query.boolean && pos && 

    for (i = 0, length = query.children.length; i < length; ++i) {
      result += _queryToString(query.children[i], i, formviewfolder, fvfName);
    }

    if (query.parentId === '0000' && query.children.length > 1) result += ')'; // pos !== 0 && pos && query.boolean && 

  } else {
    // type == condition
    if (query.options && query.options.length > 0) {
      result += `${query.identifier} ${query.operator} (${_selectedToString(query.selectedItems)})`;
    } else {
      if (query.valueType === 'text') {
        result += formviewfolder === 'views' ? `'${fvfName}'.${query.identifier} ${query.operator} '${query.value}'` : formviewfolder === 'folders' ? `'${fvfName}'.${query.identifier} ${query.operator} '${query.value}'` : `${query.identifier} ${query.operator} '${query.value}'`;
      }

      if (query.valueType === 'number') {
        result += formviewfolder === 'views' ? `'${fvfName}'.${query.identifier} ${query.operator} ${query.value}` : formviewfolder === 'folders' ? `'${fvfName}'.${query.identifier} ${query.operator} ${query.value}` : `${query.identifier} ${query.operator} ${query.value}`;
      }

      if (query.valueType === 'date') {
        result += formviewfolder === 'views' ? `'${fvfName}'.${query.identifier} ${query.operator} @dt('${query.value}')` : formviewfolder === 'folders' ? `'${fvfName}'.${query.identifier} ${query.operator} @dt('${query.value}')` : `${query.identifier} ${query.operator} @dt('${query.value}')`;
      }
    }
  }

  return result;
};

export function queryToString(query, pos, formviewfolder, fvfName) {

  let tempStr = _queryToString(query, pos, formviewfolder, fvfName);

  if (formviewfolder === 'forms' && tempStr !== '') {
    // tempStr = `Form = '${fvfName}' and ${tempStr}`;
    tempStr = `${tempStr}`;
  } else if (formviewfolder === 'forms' && tempStr === '') {
    tempStr = `Form = '${fvfName}'`
  }

  return tempStr
}

export function columnsToString(fields) {
  let result='';

  fields.map((field, index) => {
    if (index === 0) 
      result += field;
    else 
      result += `,${field}`

    return null;
  })
  return result;
};

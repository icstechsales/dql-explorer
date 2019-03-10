import React from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import withApp from '../../withApp';

function compare(a,b) {
  if (a.text < b.text)
    return -1;
  if (a.text > b.text)
    return 1;
  return 0;
}

const AdvancedOptions = ({ 
  selectedDatabase: { filepath, formviewfolder, fvfName }, 
  onChangeViewFolderName, onImageChoiceGroupChange, databases,
  formdata: { queryReader }
}) => {
    const isDisabled = filepath ? false : true;

    let selectedDatabase = databases.find(database => database.filepath === `${filepath}`);
    let options = [];

    if (formviewfolder === 'forms' && selectedDatabase.forms) {
      selectedDatabase.forms.map((form) => {
        options.push({
          key: form.alias !== '' ? form.alias : form.name,
          text: form.displayName
        })
        return options;
      })
    } else if (formviewfolder === 'views' && selectedDatabase.viewsfolders) {
      selectedDatabase.viewsfolders.map((view, index) => {
        if (view.isfolder === "False" && view.name !== '') {
          options.push({
            key: view.alias !== '' ? view.alias : view.name, //`${view.name}${index}`, //@todo: for some reason some views.name are the same and causing a conflict
            text: view.displayName
          })
        }
        return options;
      })
    } else if (formviewfolder === 'folders' && selectedDatabase.viewsfolders) {
      selectedDatabase.viewsfolders.map((folder, index) => {
        if (folder.isfolder === 'True') {
          options.push({
            key: folder.alias !== '' ? folder.alias : folder.name, //`${folder.name}${index}` , //@todo: for some reason some views.name are the same and causing a conflict
            text: folder.displayName
          })
        }
        return options;
      })
    }

    return (
      <div className="advancedOptionsOuter">
        <Dropdown
          placeholder="Select an Option"
          label="Are you querying Forms, Views, or Folders?:"
          ariaLabel="Form/View/Folder"
          className="fvfPicker"
          options={[
            { key: 'forms', text: 'Forms' },
            { key: 'views', text: 'Views' },
            { key: 'folders', text: 'Folders'}
          ]}
          onChange={onImageChoiceGroupChange}
          selectedKey={formviewfolder}
          disabled={queryReader}
        />
        <Dropdown
          placeholder={formviewfolder === 'views' ? "Select view to query" : formviewfolder === 'forms' ? "Select form to query" : "Select folder to query"}
          label={formviewfolder === 'views' ? "View name" : formviewfolder === 'forms' ? "Form name" : "Folder name"}
          onChange={onChangeViewFolderName}
          disabled={isDisabled || queryReader}
          options={options.sort(compare)}
          selectedKey={fvfName}
        />
      </div>
    );
  }

export default withApp(AdvancedOptions);
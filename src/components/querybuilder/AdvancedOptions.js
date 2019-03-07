import React from 'react';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

import withApp from '../../withApp';

const AdvancedOptions = ({ 
  selectedDatabase: { filepath, formviewfolder, fvfName }, 
  onChangeViewFolderName, onImageChoiceGroupChange, databases,
  formdata: { queryReader }
}) => {
    const isDisabled = filepath ? false : true;

    let selectedDatabase = databases.find(database => database.filepath === `${filepath}`);
    let options = [];

    if (formviewfolder === 'forms') {
      selectedDatabase.forms.map((form) => {
        options.push({
          key: form.name,
          text: form.displayName
        })
        return options;
      })
    } else if (formviewfolder === 'views') {
      selectedDatabase.viewsfolders.map((view, index) => {
        if (!view.isFolder && view.name !== '') {
          options.push({
            key: view.name, //`${view.name}${index}`, //@todo: for some reason some views.name are the same and causing a conflict
            text: view.displayName
          })
        }
        return options;
      })
    } else if (formviewfolder === 'folders') {
      selectedDatabase.viewsfolders.map((folder, index) => {
        if (folder.isFolder) {
          options.push({
            key: folder.name, //`${folder.name}${index}` , //@todo: for some reason some views.name are the same and causing a conflict
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
          options={options}
          selectedKey={fvfName}
        />
      </div>
    );
  }

export default withApp(AdvancedOptions);
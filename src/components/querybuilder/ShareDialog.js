import React from 'react';
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';

import PeoplePicker from './PeoplePicker';
import withApp from '../../withApp';

class ShareDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionSelected: 'group'
    };
  }

  render() {
    const { optionSelected } = this.state;
    const { formaction: { hideShareDialog } } = this.props;

    return (
      <div>
        <Dialog
          hidden={hideShareDialog}
          onDismiss={this._closeDialog}
          modalProps={{
            isBlocking: true,
            topOffsetFixed: true
          }}
        >
          <ChoiceGroup
            label="Share with"
            options={[
              {
                key: 'group',
                iconProps: { iconName: 'users' },
                text: 'Individuals',
                checked: optionSelected === 'group'
              },
              {
                key: 'public',
                iconProps: { iconName: 'globe' },
                text: 'Public',
                checked: optionSelected === 'public',
                disabled: true
              }
            ]}
            onChange={this._onChange}
            required={true}
          />
          {optionSelected === 'group' && (
            <div>
              <h1>Description</h1>
              <div>
                {' '}
                Used to share with individual team members.{' '}
              </div>
              <PeoplePicker />
            </div>
          )}
          {optionSelected === 'public' && (
            <div>
              <h1>Description</h1>
              <div>
                {' '}
                Used to open to all users in your organization.{' '}
              </div>
            </div>
          )}
          <DialogFooter>
            <PrimaryButton onClick={this._closeDialog} text="Save" />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _onChange = (ev, option) => {
    this.setState({ optionSelected: option.key });
  };

  _showDialog = () => {
    this.props.onShareDialog(false);
  };

 _closeDialog = () => {
    this.props.onShareDialog(true)
  };

  _cancelDialog = () => {
    this.props.onShareDialog(true)
  };
}

export default withApp(ShareDialog);

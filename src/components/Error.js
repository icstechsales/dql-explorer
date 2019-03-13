/**
 * Copyright (c) International Business Machines
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";

const ErrorMessage = ({errorMsg, errorNum}) => {
    return (
      <div className='errorContainer'>
          <h1>Uh oh...</h1>
          <div class='errorContent'>
            Something went wrong and we can't continue with this query. Here's what we know...
            <div className="errorDisplay">
              <strong>{(errorNum) ? 'Error ' + errorNum + ': ' : ''}</strong>{errorMsg}
            </div>
          </div>
      </div>
    );
  }

export default ErrorMessage;

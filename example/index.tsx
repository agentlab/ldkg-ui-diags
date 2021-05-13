import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { DataRenderer } from '../.';
import { rootModelState } from '../src/store/data';

const App = () => {
  return (
    <div>
      <DataRenderer
        viewKinds={rootModelState.colls['rm:ViewKinds_Coll'].dataIntrnl}
        viewDescriptions={rootModelState.colls['rm:Views_Coll'].dataIntrnl}
        data={rootModelState.colls}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

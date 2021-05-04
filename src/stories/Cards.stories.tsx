import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { asReduxStore, connectReduxDevtools } from 'mst-middlewares';

import { GraphEditor } from '../components/GraphEditor';
import { createRootStoreFromState, rootModelInitialState3 } from '../stores/RootStore';
import { RootContextProvider } from '../stores/RootContext';
import { viewDescrCollConstr } from '../stores/view';
import '../index.css';
import '../App.css';

const rootStore = createRootStoreFromState(rootModelInitialState3);
const store: any = asReduxStore(rootStore);
connectReduxDevtools(require('remotedev'), rootStore);

export default {
  title: 'GraphEditor/Cards',
  component: GraphEditor,
  //component: Button,
} as Meta;

/*const Template: Story<any> = (args: any) => (
  <RootContextProvider>
    <Button></Button>
  </RootContextProvider>
);*/

const Template: Story<any> = (args: any) => (
  <Provider store={store}>
    <RootContextProvider>
      <GraphEditor {...args} />
    </RootContextProvider>
  </Provider>
);

export const Add = Template.bind({});
Add.args = {
  viewDescrId: viewDescrCollConstr['@id'],
};

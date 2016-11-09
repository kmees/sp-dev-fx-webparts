import * as React from 'react';
import { connect } from 'react-redux';

import { IState } from '../store';
import { Greeter, ReactiveInfo } from '../components';

const mapStateToProps = (state: IState) => ({
  name: state.webpart.properties.name,
  reactive: !state.webpart.properties.disableReactive,
  async: state.async
});

const DefaultContainer = ({ name, reactive, async }) => (
  <div>
    <Greeter name={name} />
    <ReactiveInfo reactive={reactive} />
    <pre>{ JSON.stringify(async, null, 2) }</pre>
  </div>
);

export default connect(mapStateToProps)(DefaultContainer);

import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Index} from 'web/index';
// import {ClientContext} from 'web/store/context'

ReactDom.hydrate(
    <BrowserRouter>
      <Index />
    </BrowserRouter>,
  document.getElementById('app')
)

if (module.hot) {
  module.hot.accept();
}
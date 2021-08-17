import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import * as serviceWorker from './serviceWorker';
import { loadableReady } from '@loadable/component';

const dehydratedState = window.__REACT_QUERY_STATE__
const queryClient = new QueryClient()

const Root = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Hydrate>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  )
}

const root = document.getElementById('root')

if (process.env.NODE_ENV === "production") {
  loadableReady(() => {
    ReactDOM.hydrate(<Root />, root)
  })
} else {
  ReactDOM.render(<Root />, root)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

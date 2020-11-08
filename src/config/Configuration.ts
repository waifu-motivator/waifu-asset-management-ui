import {applyMiddleware, compose, createStore} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import {routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();

// eslint-disable-next-line
const fetchMiddleware = (sagaMiddleware: any) => {
  const commonMiddleware = [thunk, sagaMiddleware, routerMiddleware(history)];
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const reactoTron = require('./ReactotronConfiguration').default;
    return compose(
      applyMiddleware(...commonMiddleware),
      reactoTron.createEnhancer(),
    );
  }
  return applyMiddleware(...commonMiddleware);
};

// eslint-disable-next-line
export const fetchApplicationConfiguration = () => {
  const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['security', 'user'],
  };

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    persistReducer(persistConfig, rootReducer(history)),
    fetchMiddleware(sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
};

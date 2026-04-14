import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';

import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '@interface/presenters/store/reducers/auth.reducer';
import usersReducer from '@interface/presenters/store/reducers/users.reducer';
import accountsReducer from '@interface/presenters/store/reducers/accounts.reducer';
import transactionsReducer from '@interface/presenters/store/reducers/transactions.reducer';
import dashboardReducer from '@interface/presenters/store/reducers/dashboard.reducer';
import reportReducer from '@interface/presenters/store/reducers/report.reducer';
import logsReducer from '@interface/presenters/store/reducers/logs.reducer';
import categoriesReducer from '@interface/presenters/store/reducers/categories.reducer';
import tagsReducer from '@interface/presenters/store/reducers/tags.reducer';
import storesReducer from '@interface/presenters/store/reducers/stores.reducer';
import placesReducer from '@interface/presenters/store/reducers/places.reducer';

const reducer = combineReducers({
  authState: authReducer,
  userState: usersReducer,
  accountState: accountsReducer,
  transactionState: transactionsReducer,
  dashboardState: dashboardReducer,
  reportState: reportReducer,
  logsState: logsReducer,
  categoryState: categoriesReducer,
  tagState: tagsReducer,
  storesState: storesReducer,
  placesState: placesReducer
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [],
}
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type AppDispatch = typeof store.dispatch;
export type AppUseStoreType = typeof store
export type RootState = ReturnType<typeof reducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

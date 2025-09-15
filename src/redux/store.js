// store.js

import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import menuReducer from "./reducers/menuReducer";
import graphReducer from "./reducers/graphReducer";
import authReducer from "./reducers/authReducer"; // Import the authReducer
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
  menu: menuReducer,
  graph: graphReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

// src/redux/reducers/graphReducer.js
import { SET_GRAPH_DATA } from "../types";

const initialState = {
  graphData: [],
};

const graphReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GRAPH_DATA:
      return {
        ...state,
        graphData: action.payload,
      };
    default:
      return state;
  }
};

export default graphReducer;

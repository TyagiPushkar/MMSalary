// src/redux/reducers/menuReducer.js
import { FETCH_MENU_SUCCESS, FETCH_MENU_FAILURE } from "../types";

const initialState = {
  menuData: [],
  isLoading: true,
  error: null,
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MENU_SUCCESS:
      return {
        ...state,
        menuData: action.payload,
        isLoading: false,
        error: null,
      };
    case FETCH_MENU_FAILURE:
      return {
        ...state,
        menuData: [],
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default menuReducer;

// src/redux/actions/menuActions.js
import { FETCH_MENU_SUCCESS, FETCH_MENU_FAILURE } from "../types";
import { baseURL } from "../../config";

export const fetchMenuSuccess = (data) => ({
  type: FETCH_MENU_SUCCESS,
  payload: data,
});

export const fetchMenuFailure = (error) => ({
  type: FETCH_MENU_FAILURE,
  payload: error,
});

export const fetchMenuData = () => {
  return async (dispatch) => {
    const storedUserData = JSON.parse(sessionStorage.getItem("user-info"));

    try {
      const inputobj = {
        loginEmpId: storedUserData[0].empId,
        loginEmpRoleId: storedUserData[0].empRoleId,
        tenentId: storedUserData[0].tenentId,
      };

      const response = await fetch(
        `${baseURL}/getMenuByEmpRole.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputobj),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu data");
      }

      const data = await response.json();
      // console.log(data);
      const submenuPromises = data.wrappedList.map(async (item) => {
        const submenuInput = {
          loginEmpRole: "4",
          categoryName: item.menuName,
        };

        const submenuResponse = await fetch(
          "http://www.trinityapplab.co.in/UniversalApp/getCategorySubcategoryByRole.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submenuInput),
          }
        );

        if (!submenuResponse.ok) {
          throw new Error("Failed to fetch submenu data");
        }

        const submenuData = await submenuResponse.json();

        return {
          ...item,
          submenu: submenuData.wrappedList,
        };
      });

      const completeMenuData = await Promise.all(submenuPromises);
      // sessionStorage.setItem("menu-info", JSON.stringify(completeMenuData));
      // console.log(completeMenuData);
      // Dispatch the success action with the fetched menu data
      dispatch(fetchMenuSuccess(completeMenuData));
      // } else {
      //   console.error("User data not found in session storage.");
      // }
    } catch (error) {

      // Dispatch the failure action with the error message
      dispatch(fetchMenuFailure(error));
    } //finally {
    //   setIsLoading(false);
    // }
  };
};

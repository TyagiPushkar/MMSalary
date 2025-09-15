import { SET_GRAPH_DATA } from "../types";
import { baseURL } from "../../config";

// Define an action to set the graph data
const setGraphData = (data) => {
  return {
    type: SET_GRAPH_DATA,
    payload: data,
  };
};

// Define an async action to fetch graph data from the API
export const fetchGraphData = () => {
  return async (dispatch) => {
    try {
        const user = JSON.parse(sessionStorage.getItem("user-info"));

      const inputobj = {
        loginEmpId: user[0].empId,
        loginEmpRoleId: user[0].empRoleId,
        graphType: "2",
        // loginEmpId: user[0].empId,
        // loginEmpRoleId: user[0].empRoleId,
        // graphType: "2",
      };

      const response = await fetch(
        `${baseURL}/generateGraph.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputobj),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const transformedData = data.count.map((entry) => [
        entry.menuName,
        entry.doneCount,
        entry.color,
      ]);

      dispatch(setGraphData(transformedData));
    } catch (error) {
      console.error("Error fetching graph data:", error);
      // Handle errors or dispatch an error action if needed
    }
  };
};

import { createContext, useContext, useEffect, useReducer } from "react";
import GridLayout from "react-grid-layout";
import useLocalStorage from "./useLocalStorage";

type ADD_GRID_ACTION = {
  type: "ADD_GRID";
};
type UPDATE_GRID_ACTION = {
  type: "UPDATE_GRID";
  payload: GridLayout.Layout[];
};
type REMOVE_GRID_ACTION = {
  type: "REMOVE_GRID";
  payload: {
    gridKey: String;
  };
};

type GridState = {
  layouts: GridLayout.Layout[];
  gridIndex: number;
  gridCols: number;
};
type GridAction = ADD_GRID_ACTION | UPDATE_GRID_ACTION | REMOVE_GRID_ACTION;
type GridDispatch = React.Dispatch<GridAction>;

const BASE_GRID: Omit<GridLayout.Layout, "i"> = {
  w: 4,
  h: 4,
  x: 0,
  y: 0,
  // static: true,
  resizeHandles: ["e", "n", "s", "w"],
};

type GridReducer = React.Reducer<GridState, GridAction>;
const gridReducer: GridReducer = (prevState, action) => {
  switch (action.type) {
    case "ADD_GRID":
      const layout: GridLayout.Layout = {
        ...BASE_GRID,
        i: `grid_${prevState.gridIndex}`,
        x: (prevState.layouts.length * 4) % prevState.gridCols,
      };
      return {
        ...prevState,
        layouts: [...prevState.layouts, layout],
        gridIndex: prevState.gridIndex + 1,
      };
    case "UPDATE_GRID":
      return { ...prevState, layouts: action.payload };
    case "REMOVE_GRID":
      // Remove the grid with the given key
      const newLayouts = prevState.layouts.filter(
        (l) => l.i !== action.payload.gridKey
      );
      return { ...prevState, layouts: newLayouts };
    default:
      return { ...prevState };
  }
};

const GridStateContext = createContext<GridState | undefined>(undefined);
const GridDispatchContext = createContext<GridDispatch | undefined>(undefined);

const useGridState = () => {
  const state = useContext(GridStateContext);
  if (!state) {
    throw Error("Grid State Context should be used as a child to GridProvider");
  }
  return state;
};

const useGridDispatch = () => {
  const dispatch = useContext(GridDispatchContext);
  if (!dispatch) {
    throw Error(
      "Grid Dispatch Context should be used as a child to GridProvider"
    );
  }
  return dispatch;
};

const useGrid = (): [GridState, GridDispatch] => [
  useGridState(),
  useGridDispatch(),
];

const INITIAL_GRID_STATE: GridState = {
  layouts: [],
  gridIndex: 0,
  gridCols: 12,
};
const GridProvider = ({ children }: { children?: React.ReactNode }) => {
  const [storedLayout, setStoredLayout] = useLocalStorage<GridState>({
    key: "grid_layout",
    initialValue: INITIAL_GRID_STATE,
  });
  const [state, dispatch] = useReducer<GridReducer, GridState>(
    gridReducer,
    storedLayout || INITIAL_GRID_STATE,
    (args) => ({ ...args })
  );

  useEffect(() => {
    setStoredLayout(state);
  }, [setStoredLayout, state]);

  return (
    <GridStateContext.Provider value={state}>
      <GridDispatchContext.Provider value={dispatch}>
        {children}
      </GridDispatchContext.Provider>
    </GridStateContext.Provider>
  );
};

export { GridProvider, useGrid };

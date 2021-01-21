import { Button, Icon } from "@blueprintjs/core";
import { useRef, useState } from "react";
import GridLayout from "react-grid-layout";
import "./App.css";
import { useGrid } from "./GridContext";
import useCurrentWindowDimensions from "./useWindowWidth";

type GridItemProps = {};
const GridItem: React.FC<GridItemProps> = ({ children }) => {
  return <>{children}</>;
};

function App() {
  const layoutRef = useRef(null);
  const [gridState, gridDispatch] = useGrid();
  const [windowWidth, windowHeight] = useCurrentWindowDimensions(layoutRef);

  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => setIsEditable((s) => !s);
  const handleAddGrid = () => gridDispatch({ type: "ADD_GRID" });
  const handleLayoutChange = (layout: GridLayout.Layout[]) => {
    gridDispatch({ type: "UPDATE_GRID", payload: layout });
  };
  const handleRemoveGrid = (gridKey: string) => {
    gridDispatch({
      type: "REMOVE_GRID",
      payload: { gridKey },
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none bg-red-300 w-full p-4 flex justify-between items-center">
        <div>Add Layout Section</div>
        {windowWidth}
        <div className="space-x-4">
          <Button onClick={handleEdit}>Edit Layout</Button>
          <Button onClick={handleAddGrid}>Add new item</Button>
        </div>
      </div>
      <div className="flex" ref={layoutRef}>
        <GridLayout
          layout={gridState.layouts}
          compactType={"vertical"}
          // preventCollision={true}
          onLayoutChange={handleLayoutChange}
          width={windowWidth}
          rowHeight={125}
          cols={gridState.gridCols}
          isDraggable={isEditable}
          isResizable={isEditable}
        >
          {gridState.layouts.map((layout, ind) => (
            <div
              className="bg-gray-300 flex justify-center items-center font-semibold font-mono text-2xl relative"
              key={layout.i}
            >
              {isEditable && (
                <Icon
                  className="absolute right-0 top-0 cursor-pointer p-1"
                  icon="cross"
                  onClick={() => handleRemoveGrid(layout.i)}
                />
              )}
              <GridItem>
                <div>{layout.i}</div>
              </GridItem>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}

export default App;

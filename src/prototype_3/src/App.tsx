import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Map from './Prototype_3'; // Import your map component

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Map />
    </DndProvider>
  );
}

export default App;

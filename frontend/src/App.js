import { Toolbar }        from './components/Toolbar';
import { PipelineCanvas } from './components/PipelineCanvas';
import { SubmitButton }   from './components/SubmitButton';

function App() {
  return (
    <div className="app">
      <Toolbar />
      <div className="canvas-wrapper">
        <PipelineCanvas />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;

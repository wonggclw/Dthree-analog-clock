import CircleClock from "./CircleClock";
import DigitalClock from "./DigitalClock";
function App() {
  return (
    <div>
      <CircleClock 
        color = "purple"
        screenWidth = {window.innerWidth}
        screenHeight= {window.innerHeight}
      />
    </div>
  );
}

export default App;
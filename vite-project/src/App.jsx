import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Router from "./routers/routerBefore";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IconCreator from "./pages/IconCreator";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/icon" element={<IconCreator />} />
        <Route
          path="/anime"
          element={
            <div className="p-8">Vista de Tarjeta Anime (En construcción)</div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

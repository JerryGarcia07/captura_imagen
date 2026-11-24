import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IconCreator from "./pages/IconCreator";
import AnimeCard from "./pages/AnimeCard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/icon" element={<IconCreator />} />
        <Route path="/anime" element={<AnimeCard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

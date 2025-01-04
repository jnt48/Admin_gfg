import AdminPanel from "./Pages/AdminPanel";
import Round1 from "./Pages/Round1";
import Round2 from "./Pages/Round2";
import Round3 from "./Pages/Round3";
import Round4 from "./Pages/Round4";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/round/1" element={ <Round1 />} />
          <Route path="/round/2" element={ <Round2 />} />
          <Route path="/round/3" element={ <Round3 />} />
          <Route path="/round/4" element={ <Round4 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

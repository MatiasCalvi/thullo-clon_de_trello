import "./App.css";
import { Routes, Route } from "react-router-dom";
import Main from "./layouts/Main";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <Main>
        <Routes>
          <Route path="" element={<Home></Home>} />
        </Routes>
      </Main>
    </>
  );
}

export default App;

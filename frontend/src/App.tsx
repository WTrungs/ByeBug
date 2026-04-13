import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";

function App(){
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
    </Routes>
    </BrowserRouter>
  );
}
export default App
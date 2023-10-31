import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Community from "./pages/Community";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      {/* Authorization */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* Protected */}
      <Route path="community/*" element={<Community />} />
    </Routes>
  );
}

export default App;

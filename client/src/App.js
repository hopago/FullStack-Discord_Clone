import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Community from "./pages/Community";

import RequireAuth from "./features/authentication/RequireAuth";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/*" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      {/* Protected */}
      <Route element={<RequireAuth />}>
        <Route path="community/*" element={<Community />} />
      </Route>
    </Routes>
  );
}

export default App;

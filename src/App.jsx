import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { CourseView } from "./views/CourseView";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<h1>Not Found</h1>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course" element={<CourseView />} />
        </Routes>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;

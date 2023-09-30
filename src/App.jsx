import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { CourseView } from "./views/CourseView";
import { CourseProvider } from "./context/CourseContext";
import { EditCourse } from "./views/EditCourse";
import { EditUnit } from "./views/EditUnit";

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
          Rot
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/course" element={<CourseView />} />
          <Route path="/course/:courseId" element={<EditCourse />} />
          <Route
            path="/course/:courseId/units/:unitId/edit"
            element={<EditUnit />} // Reemplaza 'EditUnit' con el nombre de tu componente de edición de unidades
          />
        </Routes>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;

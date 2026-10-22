import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StorePage from "./pages/StorePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/entrar" element={<Auth mode="login" />} />
      <Route path="/criar-loja" element={<Auth mode="register" />} />
      <Route path="/painel" element={<Dashboard />} />
      <Route path="/:slug" element={<StorePage />} />
    </Routes>
  );
}

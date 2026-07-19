import { useState } from "react";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("cmcp_admin_token"));

  const handleLogout = () => {
    localStorage.removeItem("cmcp_admin_token");
    setAuthed(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {authed ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onSuccess={() => setAuthed(true)} />
      )}
    </div>
  );
}

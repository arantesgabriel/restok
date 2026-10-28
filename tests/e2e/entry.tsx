import { createRoot } from "react-dom/client";
import RestokApp from "../../components/restok-app";
import LandingPage from "../../app/page";
import LoginPage from "../../app/login/page";
import ResetPasswordPage from "../../app/reset-password/page";
import "../../app/globals.css";
import "../../app/ui.css";

const surface = window.location.pathname;
const content = surface === "/" ? <LandingPage /> : surface === "/login" ? <LoginPage /> : surface === "/reset-password" ? <ResetPasswordPage /> : <RestokApp />;
createRoot(document.getElementById("root")!).render(<><aside role="note" style={{ position: "fixed", top: 0, right: 0, zIndex: 9999, background: "white", color: "black", fontSize: 10 }}>E2E-FIXTURE · sem backend</aside>{content}</>);

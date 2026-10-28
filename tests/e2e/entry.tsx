import { createRoot } from "react-dom/client";
import { useState } from "react";
import { releaseEvidenceLoad } from "./data-fixture";
import BeforePr06 from "./before-pr06";
import RestokApp from "../../components/restok-app";
import LandingPage from "../../app/page";
import LoginPage from "../../app/login/page";
import ResetPasswordPage from "../../app/reset-password/page";
import "../../app/globals.css";
import "../../app/ui.css";

const surface = window.location.pathname;
const content = surface === "/" ? <LandingPage /> : surface === "/login" ? <LoginPage /> : surface === "/reset-password" ? <ResetPasswordPage /> : surface === "/before-pr06" ? <BeforePr06 /> : <RestokApp />;
function Harness() {
  const [pending,setPending] = useState(new URLSearchParams(window.location.search).get("scenario") === "loading");
  return <><aside role="note" style={{ position: "fixed", top: 0, right: 0, zIndex: 9999, background: "white", color: "black", fontSize: 10 }}>E2E-FIXTURE · sem backend{pending?<button style={{display:"block",minHeight:44}} onClick={()=>{setPending(false);releaseEvidenceLoad();}}>Liberar resposta da fixture</button>:null}</aside>{content}</>;
}
createRoot(document.getElementById("root")!).render(<Harness/>);

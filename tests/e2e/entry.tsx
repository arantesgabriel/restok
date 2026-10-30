import { createRoot } from "react-dom/client";
import { useState } from "react";
import { releaseEvidenceLoad, releaseEvidenceWrite } from "./data-fixture";
import BeforePr08 from "./before-pr08";
import BeforePr07 from "./before-pr07";
import BeforePr06 from "./before-pr06";
import RestokApp from "../../components/restok-app";
import LandingPage from "../../app/page";
import LoginPage from "../../app/login/page";
import ResetPasswordPage from "../../app/reset-password/page";
import "../../app/globals.css";

const surface = window.location.pathname;
document.documentElement.classList.add("restok-theme");
if(surface.startsWith("/before-")) {
  await import("./legacy/globals.css");
  await import("./legacy/ui.css");
}
const content = surface === "/" ? <LandingPage /> : surface === "/login" ? <LoginPage /> : surface === "/reset-password" ? <ResetPasswordPage /> : surface === "/before-pr08" ? <BeforePr08 /> : surface === "/before-pr07" ? <BeforePr07 /> : surface === "/before-pr06" ? <BeforePr06 /> : <RestokApp />;
function Harness() {
  const [pending,setPending] = useState(new URLSearchParams(window.location.search).get("scenario") === "loading");
  return <><aside role="note" style={{ position: "fixed", top: 0, right: 0, zIndex: 9999, background: "white", color: "black", fontSize: 10 }}>E2E-FIXTURE · sem backend{pending?<button style={{display:"block",minHeight:44}} onClick={()=>{setPending(false);releaseEvidenceLoad();}}>Liberar resposta da fixture</button>:null}{new URLSearchParams(window.location.search).get("scenario")==="retry"?<button style={{display:"block",minHeight:44}} onClick={releaseEvidenceWrite}>Confirmar gravação simulada</button>:null}</aside>{content}</>;
}
createRoot(document.getElementById("root")!).render(<Harness/>);

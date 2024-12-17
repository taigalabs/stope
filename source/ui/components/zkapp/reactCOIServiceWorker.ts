export {};

function loadCOIServiceWorker() {
  if (
    typeof window !== "undefined" &&
    window.location.hostname != "localhost"
  ) {
    const coi = window.document.createElement("script");

    console.log("adding script into header");

    // update if your repo name changes for 'npm run deploy' to work correctly
    coi.setAttribute("src", "/04-zkapp-browser-ui/coi-serviceworker.min.js");
    window.document.head.appendChild(coi);
  }
}

loadCOIServiceWorker();

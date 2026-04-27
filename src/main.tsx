import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

import { AuthProvider } from "@/ContextProvider/AuthContext/AuthProvider";
import { ClosingTimeProvider } from "@/ContextProvider/ClosingTimeContext/ClosingTimeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider>
				<AuthProvider>
					<ClosingTimeProvider>
						<main className="text-foreground bg-background">
							<App />
						</main>
					</ClosingTimeProvider>
				</AuthProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
);

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				console.log("SW registered: ", registration);
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	});
}

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

import { AuthProvider } from "@/ContextProvider/AuthContext/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider>
				<AuthProvider>
					<main className="text-foreground bg-background">
						<App />
					</main>
				</AuthProvider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>,
);

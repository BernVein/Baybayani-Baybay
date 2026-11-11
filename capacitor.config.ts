import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.baybayani.app",
	appName: "Baybayani",
	webDir: "dist",
	plugins: {
		// Keep the webview out from under the status bar and the navigation bar.
		SystemBars: {
			insetsHandling: "native",
			initialViewportFitValueHint: "contain",
		},
		PushNotifications: {
			presentationOptions: [],
		},
		SplashScreen: {
			launchShowDuration: 2000,
			backgroundColor: "#ffffffff",
			showSpinner: false,
			androidSpinnerStyle: "large",
			iosSpinnerStyle: "small",
			splashFullScreen: true,
			splashImmersive: true,
		},
	},
};

export default config;

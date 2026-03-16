import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.baybayani.app",
	appName: "Baybayani",
	webDir: "dist",
	plugins: {
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

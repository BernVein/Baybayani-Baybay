// appFocus.ts
import { App } from "@capacitor/app";

let _isAppFocused = true;

// Listen once when this module is imported
App.addListener("appStateChange", (state) => {
	_isAppFocused = state.isActive;
});

/**
 * Returns true if the app is currently in the foreground, false otherwise.
 */
export function isAppFocused(): boolean {
	return _isAppFocused;
}

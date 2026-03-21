import { useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export function useLogin() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);

	const toggleVisibility = () => setIsVisible(!isVisible);

	const isValid = () => {
		return email.trim() !== "" && password.trim() !== "";
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setIsSubmitted(false);
		setIsVisible(false);
		setLoading(false);
	};

	const handleLogin = async (onSuccess?: () => void) => {
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email: email + "@gmail.com",
			password,
		});

		// If "Remember Me" is unchecked, remove the persisted session from
		// localStorage so the session only lasts until the browser tab is closed.
		if (!error && !rememberMe) {
			const storageKey = Object.keys(localStorage).find(
				(k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
			);
			if (storageKey) localStorage.removeItem(storageKey);
		}

		if (error) {
			addToast({
				title: "Login Failed",
				description: error.message,
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			setLoading(false);
			return;
		}

		// Fetch user profile directly to get the role right away
		const {
			data: { user },
		} = await supabase.auth.getUser();
		let userRole: string | null = null;
		if (user) {
			const { data: profile } = await supabase
				.from("User")
				.select("user_role")
				.eq("user_id", user.id)
				.single();
			userRole = profile?.user_role ?? null;
		}

		addToast({
			title: "Success",
			description: "Logged in successfully",
			color: "success",
			shouldShowTimeoutProgress: true,
			timeout: 5000,
		});

		if (userRole === "Admin") {
			sessionStorage.setItem("silentAuthRedirect", "true");
			navigate("/admin/dashboard");
		} else {
			sessionStorage.setItem("silentAuthRedirect", "true");
			navigate("/shop");
		}

		setLoading(false);
		onSuccess?.();
	};

	const submitLogin = (onSuccess?: () => void) => {
		setIsSubmitted(true);

		if (isValid()) {
			handleLogin(onSuccess);
		} else {
			addToast({
				title: "Error",
				description: "Please enter valid login details",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		}
	};

	return {
		email,
		setEmail,
		password,
		setPassword,
		loading,
		isVisible,
		isSubmitted,
		rememberMe,
		setRememberMe,
		toggleVisibility,
		resetForm,
		submitLogin,
	};
}

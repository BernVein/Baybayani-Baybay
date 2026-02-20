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
			email: email + "@baybayani.baybay",
			password,
		});

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
		console.log("Fetched userRole:", userRole, "| user:", user?.id);
		addToast({
			title: "Success",
			description: "Logged in successfully",
			color: "success",
			shouldShowTimeoutProgress: true,
			timeout: 5000,
		});

		if (userRole === "Admin") {
			navigate("/admin/dashboard");
		} else {
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
		toggleVisibility,
		resetForm,
		submitLogin,
	};
}

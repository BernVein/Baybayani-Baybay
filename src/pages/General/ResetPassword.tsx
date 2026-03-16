import {
	Card,
	CardBody,
	Input,
	CardHeader,
	Button,
	addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";
import { useNavigate } from "react-router-dom";
import {
	BaybayaniLogo,
	EyeFilledIcon,
	EyeSlashFilledIcon,
} from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isConfirmVisible, setIsConfirmVisible] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const toggleVisibility = () => setIsVisible(!isVisible);
	const toggleConfirmVisibility = () =>
		setIsConfirmVisible(!isConfirmVisible);

	// Check if we have a session (Supabase handles the Hash from the email link)
	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			console.log("Reset session check:", session);
			if (!session) {
				addToast({
					title: "Access Denied",
					description: "The reset link is invalid or has expired.",
					color: "danger",
				});
				navigate("/shop");
			}
		};
		checkSession();
	}, [navigate]);

	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitted(true);

		if (password.length < 6) {
			addToast({
				title: "Validation Error",
				description: "Password must be at least 6 characters",
				color: "warning",
			});
			return;
		}

		if (password !== confirmPassword) {
			addToast({
				title: "Selection Error",
				description: "Passwords do not match",
				color: "danger",
			});
			return;
		}

		setLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({
				password: password,
			});

			if (error) throw error;

			addToast({
				title: "Success",
				description: "Password has been reset successfully.",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});

			navigate("/shop");
		} catch (error: any) {
			addToast({
				title: "Error",
				description: error.message || "Failed to reset password",
				color: "danger",
				timeout: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center bg-default-50 p-5">
			{/* Top-left heading */}
			<div className="absolute top-10 left-10 flex flex-row items-center gap-2">
				<BaybayaniLogo className="w-10" />
				<h1 className="text-2xl font-bold leading-tight flex items-center">
					<span className="text-[#36975f]">BAYBAY</span>
					<span className="text-[#F9C424]">ANI</span>
				</h1>
			</div>

			<Card className="p-5 w-full max-w-md shadow-2xl">
				<CardHeader className="flex flex-col gap-2 items-start">
					<div className="flex w-full justify-between items-center">
						<h2 className="text-2xl font-bold">Reset Password</h2>
						<ThemeSwitcher isIconOnly />
					</div>
					<p className="text-sm text-default-500 italic">
						Please enter your new password below.
					</p>
				</CardHeader>
				<CardBody>
					<form
						onSubmit={handleReset}
						className="flex flex-col gap-6"
					>
						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-default-600">
								New Password
							</p>
							<Input
								placeholder="At least 6 characters"
								type={isVisible ? "text" : "password"}
								value={password}
								onValueChange={setPassword}
								isInvalid={isSubmitted && password.length < 6}
								errorMessage="Password too short"
								endContent={
									<button
										type="button"
										className="focus:outline-none"
										onClick={toggleVisibility}
									>
										{isVisible ? (
											<EyeSlashFilledIcon className="text-2xl text-default-400" />
										) : (
											<EyeFilledIcon className="text-2xl text-default-400" />
										)}
									</button>
								}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<p className="text-sm font-medium text-default-600">
								Confirm Password
							</p>
							<Input
								placeholder="Repeat your new password"
								type={isConfirmVisible ? "text" : "password"}
								value={confirmPassword}
								onValueChange={setConfirmPassword}
								isInvalid={
									isSubmitted && password !== confirmPassword
								}
								errorMessage="Passwords do not match"
								endContent={
									<button
										type="button"
										className="focus:outline-none"
										onClick={toggleConfirmVisibility}
									>
										{isConfirmVisible ? (
											<EyeSlashFilledIcon className="text-2xl text-default-400" />
										) : (
											<EyeFilledIcon className="text-2xl text-default-400" />
										)}
									</button>
								}
							/>
						</div>

						<Button
							fullWidth
							color="success"
							type="submit"
							isLoading={loading}
						>
							Update Password
						</Button>

						<Button
							fullWidth
							variant="light"
							onPress={() => navigate("/login")}
						>
							Back to Login
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}

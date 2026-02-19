import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Checkbox,
	Button,
	addToast,
} from "@heroui/react";
import { useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useLoginModal } from "@/context/LoginModalContext";

export default function LoginModal() {
	const { isLoginModalOpen, closeLoginModal } = useLoginModal();

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

	const handleLogin = async () => {
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

		addToast({
			title: "Success",
			description: "Logged in successfully",
			color: "success",
			shouldShowTimeoutProgress: true,
			timeout: 5000,
		});

		setLoading(false);
		resetForm();
		closeLoginModal();
	};

	return (
		<Modal
			isOpen={isLoginModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					resetForm();
					closeLoginModal();
				}
			}}
			placement="center"
			size="md"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							<span className="text-2xl font-bold">
								Welcome Back!
							</span>
							<span className="font-semibold text-default-500 text-sm">
								Please enter your details
							</span>
						</ModalHeader>
						<ModalBody>
							<p className="self-start text-sm text-default-500">
								Username
							</p>
							<Input
								value={email}
								onValueChange={setEmail}
								placeholder="Enter your username"
								isInvalid={isSubmitted && !email.trim()}
								errorMessage="Please enter your username"
							/>
							<p className="self-start text-sm text-default-500 mt-3">
								Password
							</p>
							<Input
								value={password}
								onValueChange={setPassword}
								type={isVisible ? "text" : "password"}
								placeholder="Enter your password"
								isInvalid={isSubmitted && !password.trim()}
								errorMessage="Please enter your password"
								endContent={
									<button
										aria-label="toggle password visibility"
										className="focus:outline-solid outline-transparent"
										onClick={toggleVisibility}
									>
										{isVisible ? (
											<EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
										) : (
											<EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
										)}
									</button>
								}
							/>
							<div className="flex justify-between items-center mt-3 w-full">
								<div className="flex items-center gap-2">
									<Checkbox
										defaultSelected
										color="success"
										size="sm"
									/>
									<span className="text-sm text-default-500">
										Remember me
									</span>
								</div>
								<p className="text-xs text-default-500 cursor-pointer hover:underline">
									Forgot Password?
								</p>
							</div>
						</ModalBody>
						<ModalFooter className="flex flex-col gap-3">
							<Button
								fullWidth
								color="success"
								onPress={() => {
									setIsSubmitted(true);

									if (isValid()) {
										handleLogin();
									} else {
										addToast({
											title: "Error",
											description:
												"Please enter valid login details",
											color: "danger",
											shouldShowTimeoutProgress: true,
											timeout: 5000,
										});
										return;
									}
								}}
								isLoading={loading}
							>
								Sign in
							</Button>
							<div className="flex flex-row gap-2 items-center justify-center">
								<p className="text-sm text-default-500">
									Dont have an account?
								</p>
								<p className="text-sm cursor-pointer hover:underline">
									Sign up
								</p>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

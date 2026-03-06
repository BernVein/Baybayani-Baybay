import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Checkbox,
	Button,
} from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useLoginModal } from "@/ContextProvider/LoginModalContext/LoginModalContext";
import { useLogin } from "@/data/supabase/General/AuthContext/useLogin";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { supabase } from "@/config/supabaseclient";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useTransition } from "react";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";

export default function LoginModal() {
	const navigate = useNavigate();
	const { isLoginModalOpen, closeLoginModal } = useLoginModal();
	const [, startTransition] = useTransition();
	const {
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
	} = useLogin();
	const auth = useAuth();
	const profile = auth?.profile;

	const handleLogOut = async () => {
		try {
			await unregisterPush();
			await supabase.auth.signOut();
			addToast({
				title: "Signed out",
				description: "You have been signed out successfully.",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 4000,
			});
		} catch {
			addToast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 4000,
			});
		}
	};

	return (
		<Modal
			disableAnimation
			isOpen={isLoginModalOpen}
			onOpenChange={(open) => {
				if (!open) {
					resetForm();
					closeLoginModal();
				}
			}}
			size="md"
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							{profile ? "Already signed in" : "Welcome Back!"}
						</ModalHeader>
						{profile ? (
							<>
								<ModalBody>
									<p className="text-default-600 text-sm">
										You are currently signed in as{" "}
										<span className="font-semibold text-foreground">
											{profile.user_name}
										</span>
										. Would you like to log out first?
									</p>
								</ModalBody>
								<ModalFooter>
									<Button
										variant="light"
										onPress={closeLoginModal}
									>
										Cancel
									</Button>
									<Button
										color="danger"
										onPress={handleLogOut}
									>
										Log out
									</Button>
								</ModalFooter>
							</>
						) : (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									submitLogin(() => {
										resetForm();
										closeLoginModal();
									});
								}}
							>
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
										isInvalid={
											isSubmitted && !password.trim()
										}
										errorMessage="Please enter your password"
										endContent={
											<button
												type="button"
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
										type="submit"
										isLoading={loading}
									>
										Sign in
									</Button>
									<div className="flex flex-row gap-2 items-center justify-center">
										<p className="text-sm text-default-500">
											Dont have an account?
										</p>
										<p
											onClick={() => {
												startTransition(() => {
													closeLoginModal();
													navigate("/signup");
												});
											}}
											className="text-sm cursor-pointer hover:underline text-success font-bold"
										>
											Sign up
										</p>
									</div>
								</ModalFooter>
							</form>
						)}
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

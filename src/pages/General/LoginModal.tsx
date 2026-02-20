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

export default function LoginModal() {
	const { isLoginModalOpen, closeLoginModal } = useLoginModal();
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
							<span className="text-2xl font-bold">
								Welcome Back!
							</span>
							<span className="font-semibold text-default-500 text-sm">
								Please enter your details
							</span>
						</ModalHeader>
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
									isInvalid={isSubmitted && !password.trim()}
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
									<p className="text-sm cursor-pointer hover:underline">
										Sign up
									</p>
								</div>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

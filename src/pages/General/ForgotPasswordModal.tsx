import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	addToast,
} from "@heroui/react";
import { useState } from "react";
import { supabase } from "@/config/supabaseclient";
import { KeyIcon } from "@/components/icons";

interface ForgotPasswordModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ForgotPasswordModal({
	isOpen,
	onOpenChange,
}: ForgotPasswordModalProps) {
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleResetPassword = async (onClose: () => void) => {
		if (!username.trim()) {
			addToast({
				title: "Error",
				description: "Please enter your username",
				color: "danger",
				timeout: 4000,
			});
			return;
		}

		setIsLoading(true);
		try {
			const email = `${username.trim()}@gmail.com`;
			const siteUrl =
				import.meta.env.VITE_SITE_URL || window.location.origin;
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${siteUrl}/reset-password`,
			});

			if (error) throw error;

			addToast({
				title: "Reset Link Sent",
				description: `If an account exists for ${email}, a password reset link has been sent. Please check your inbox.`,
				color: "success",
				timeout: 5000,
				shouldShowTimeoutProgress: true,
			});
			onClose();
		} catch (error: any) {
			addToast({
				title: "Error",
				description: error.message || "Failed to send reset link",
				color: "danger",
				timeout: 5000,
				shouldShowTimeoutProgress: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			backdrop="blur"
			disableAnimation
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Forgot Password
						</ModalHeader>
						<ModalBody className="gap-4">
							<p className="text-sm text-default-500">
								Enter your username below. We will send a reset
								link to your associated email:
								<span className="font-semibold text-foreground ml-1">
									{username.trim()
										? `${username.trim()}@gmail.com`
										: "[username]@gmail.com"}
								</span>
							</p>
							<div className="bg-default-100 p-3 rounded-lg border border-default-200">
								<p className="text-xs text-default-600 mb-2">
									<span className="font-bold text-success">
										Note:
									</span>{" "}
									Your account uses a virtual email based on
									your username.
								</p>
								<ul className="text-xs text-default-500 list-disc list-inside space-y-1">
									<li>
										If you already have this Gmail account,
										simply check your inbox.
									</li>
									<li>
										If you don't have it yet, you can create
										it at{" "}
										<a
											href="https://gmail.com"
											target="_blank"
											rel="noopener noreferrer"
											className="text-success hover:underline"
										>
											gmail.com
										</a>{" "}
										to receive the link.
									</li>
								</ul>
							</div>
							<Input
								label="Username"
								placeholder="Enter your username"
								labelPlacement="outside"
								value={username}
								onValueChange={setUsername}
								startContent={
									<KeyIcon className="w-4 text-default-400" />
								}
							/>
						</ModalBody>
						<ModalFooter>
							<Button
								variant="light"
								color="danger"
								onPress={onClose}
							>
								Cancel
							</Button>
							<Button
								color="success"
								isLoading={isLoading}
								onPress={() => handleResetPassword(onClose)}
							>
								I have an account / I'll create one
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

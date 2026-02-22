import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	addToast,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";

export default function RequireGuest({ children }: { children: ReactNode }) {
	const { profile, loading } = useAuth();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();

	// Open modal as soon as we know the user is logged in
	useEffect(() => {
		if (!loading && profile) {
			onOpen();
		}
	}, [loading, profile, onOpen]);

	if (loading) return null;

	if (!profile) return children;

	const handleLogOut = async () => {
		try {
			await supabase.auth.signOut();
			onClose();
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

	const handleGoBack = () => {
		onClose();
		navigate(-1);
	};

	return (
		<>
			{children}
			<Modal
				isOpen={isOpen}
				onClose={handleGoBack}
				isDismissable={false}
				hideCloseButton
				disableAnimation
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						Already signed in
					</ModalHeader>
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
						<Button variant="light" onPress={handleGoBack}>
							Go back
						</Button>
						<Button color="danger" onPress={handleLogOut}>
							Log out
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

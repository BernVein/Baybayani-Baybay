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
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { ReactNode, useEffect } from "react";
import { supabase } from "@/config/supabaseclient";
import { unregisterPush } from "@/utils/PushNotification/unregisterPush";

export default function RequireGuest({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const profile = auth?.profile;
	const loading = auth?.loading;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const navigate = useNavigate();
	const location = useLocation();

	// Open modal as soon as we know the user is logged in
	// and they are not a new registration waiting for approval
	useEffect(() => {
		// Only open the modal if the user is logged in
		// AND we are on the login or signup page
		const isAuthPage =
			location.pathname === "/login" || location.pathname === "/signup";

		if (!loading && profile && isAuthPage) {
			onOpen();
		} else {
			onClose();
		}
	}, [loading, profile, onOpen, onClose, location.pathname]);

	if (loading) return null;

	const handleLogOut = async () => {
		try {
			await unregisterPush();
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
				backdrop="blur"
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
								{profile?.user_name}
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

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Link,
} from "@heroui/react";
import {
	ShieldAlert,
	Facebook,
	Phone,
	MessageSquare,
	LogOut,
} from "lucide-react";

interface RestrictedAccessModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	status: "For Approval" | "Rejected" | "Suspended" | string;
	onSignOut: () => void;
}

export default function RestrictedAccessModal({
	isOpen,
	onOpenChange,
	status,
	onSignOut,
}: RestrictedAccessModalProps) {
	const getStatusContent = () => {
		switch (status) {
			case "For Approval":
				return {
					title: "Account Under Review",
					description:
						"Your account is currently being reviewed by our team. You will have full access once your registration is approved.",
					color: "primary",
				};
			case "Rejected":
				return {
					title: "Application Rejected",
					description:
						"We regret to inform you that your account application has been rejected. Please contact us if you believe this is an error.",
					color: "danger",
				};
			case "Suspended":
				return {
					title: "Account Suspended",
					description:
						"Your account has been suspended due to a violation of our terms or pending verification. Access to restricted features is temporarily disabled.",
					color: "warning",
				};
			default:
				return {
					title: "Access Restricted",
					description:
						"Your current account status does not allow access to this page.",
					color: "default",
				};
		}
	};

	const content = getStatusContent();

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			isDismissable={false}
			disableAnimation
			hideCloseButton
			backdrop="blur"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 items-center pt-8">
							<div
								className={`p-3 rounded-full bg-${content.color}/10 mb-2`}
							>
								<ShieldAlert
									className={`text-${content.color} w-8 h-8`}
								/>
							</div>
							<h2 className="text-xl font-bold">
								{content.title}
							</h2>
						</ModalHeader>
						<ModalBody className="text-center px-8">
							<p className="text-default-500 mb-6">
								{content.description}
							</p>

							<div className="space-y-4 text-left bg-default-50 p-4 rounded-xl border border-default-200">
								<p className="text-sm font-semibold text-default-700">
									How to get help:
								</p>
								<div className="space-y-3">
									<Link
										isExternal
										href="https://www.facebook.com/BaybayAniAgriventures"
										className="flex items-center gap-3 text-sm text-default-600 hover:text-primary transition-colors"
									>
										<Facebook className="w-4 h-4" />
										<span>BaybayAni Agriventures</span>
									</Link>
									<div className="flex items-center gap-3 text-sm text-default-600">
										<Phone className="w-4 h-4" />
										<span>09202531127</span>
									</div>
									<div className="flex items-center gap-3 text-sm text-default-600">
										<MessageSquare className="w-4 h-4" />
										<span>Use the in-app chat</span>
									</div>
								</div>
							</div>
						</ModalBody>
						<ModalFooter className="flex flex-col gap-2 pb-8 px-8">
							<Button
								color="success"
								variant="solid"
								className="w-full"
								onPress={() => (window.location.href = "/shop")}
							>
								Back to Shop
							</Button>
							<Button
								color="danger"
								variant="light"
								className="w-full"
								startContent={<LogOut className="w-4 h-4" />}
								onPress={() => {
									onClose();
									onSignOut();
								}}
							>
								Sign Out
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Avatar,
	Chip,
	Divider,
	Image,
	useDisclosure,
} from "@heroui/react";
import { useState } from "react";

import { formatCreatedAt } from "@/utils/formatCreatedAt";
import { formatPHNumber } from "@/utils/formatPHNumber";
import { UserProfile } from "@/model/userProfile";
import { fetchUserValidID } from "@/data/supabase/Admin/Users/fetchUserValidID";
import { PreviewImage } from "@/pages/Admin/UsersComponent/ShowUserDetailModalComponent/PreviewImage";

export function ShowUserDetailModal({
	isOpen,
	onOpenChange,
	selectedUserProfile,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	selectedUserProfile: UserProfile | null;
}) {
	const { userValidIDLink, loading } = fetchUserValidID(
		selectedUserProfile?.user_id || "",
	);
	const {
		isOpen: isPreviewOpen,
		onOpen: onPreviewOpen,
		onOpenChange: onPreviewOpenChange,
	} = useDisclosure();
	const [selectedImage, setSelectedImage] = useState<string>("");

	const handleImageClick = (url: string) => {
		setSelectedImage(url);
		onPreviewOpen();
	};
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			disableAnimation
			size="xl"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							View User Details
						</ModalHeader>
						<ModalBody>
							<div className="flex flex-row gap-2 items-center w-full justify-between">
								<div className="flex sm:flex-row flex-col gap-2 items-center">
									<Avatar
										className="w-20 h-20 text-large shrink-0 self-start sm:self-center"
										src={
											selectedUserProfile?.user_profile_img_url
										}
									/>
									<div className="flex flex-col items-start">
										<span className="text-base font-bold">
											{selectedUserProfile?.user_name}
										</span>
										<span className="text-sm text-default-500">
											Username:{" "}
											<span className="text-default-900">
												{
													selectedUserProfile?.login_user_name
												}
											</span>
										</span>
										<span className="text-sm text-default-500">
											Role:{" "}
											<span className="text-default-900">
												{selectedUserProfile?.user_role}
											</span>
										</span>
										<span className="text-sm text-default-500">
											Phone Number :{" "}
											<span className="text-default-900">
												{formatPHNumber(
													selectedUserProfile?.user_phone_number!,
												)}
											</span>
										</span>
									</div>
								</div>
								<Chip
									color={
										selectedUserProfile?.user_status ===
										"Approved"
											? "success"
											: selectedUserProfile?.user_status ===
												  "For Approval"
												? "warning"
												: selectedUserProfile?.user_status ===
													  "Rejected"
													? "danger"
													: "default"
									}
									variant="flat"
									className="self-start"
								>
									{selectedUserProfile?.user_status}
								</Chip>
							</div>
							<Divider />
							<p className="text-default-500">
								Registered on:{" "}
								{formatCreatedAt(
									selectedUserProfile?.created_at,
								) && (
									<>
										<span className="text-default-900">
											{
												formatCreatedAt(
													selectedUserProfile?.created_at,
												)?.formattedDate
											}{" "}
										</span>

										<span className="text-default-900 italic">
											(
											{
												formatCreatedAt(
													selectedUserProfile?.created_at,
												)?.relativeText
											}
											)
										</span>
									</>
								)}
							</p>
							<p>{selectedUserProfile?.user_name}'s Valid IDs:</p>
							<div className="flex flex-row gap-1 w-full">
								{Array.from({ length: 2 }).map((_, index) => {
									const url = userValidIDLink?.[index];

									return (
										<div
											key={index}
											className="w-1/2 relative cursor-zoom-in h-48"
											onClick={() =>
												url && handleImageClick(url)
											}
										>
											{loading ? (
												<div className="w-full h-48 rounded-lg animate-pulse bg-default-200" />
											) : url ? (
												<Image
													src={url}
													alt={`Valid ID ${index + 1}`}
													className="w-full h-48 object-cover rounded-lg hover:opacity-80 transition-opacity"
												/>
											) : null}
										</div>
									);
								})}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button
								color="danger"
								variant="light"
								onPress={onClose}
							>
								Close
							</Button>
							<Button color="success" onPress={onClose}>
								Approve
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
			<PreviewImage
				isPreviewOpen={isPreviewOpen}
				onPreviewOpenChange={onPreviewOpenChange}
				selectedImage={selectedImage}
			/>
		</Modal>
	);
}

import { useState, useRef, useCallback } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Spinner,
	addToast,
} from "@heroui/react";
import { Camera, Upload, X } from "lucide-react";
import { uploadProfileImage } from "@/data/supabase/General/User/uploadProfileImage";
import { updateUserProfile } from "@/data/supabase/General/User/updateUserProfile";

interface ImageUploadModalProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	userId: string;
	onSuccess: (publicUrl: string) => void;
}

// Canvas 1×1 crop to File
function cropToSquareFile(img: HTMLImageElement): Promise<File> {
	return new Promise((resolve) => {
		const size = Math.min(img.naturalWidth, img.naturalHeight);
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d")!;
		const ox = (img.naturalWidth - size) / 2;
		const oy = (img.naturalHeight - size) / 2;
		ctx.drawImage(img, ox, oy, size, size, 0, 0, size, size);
		canvas.toBlob(
			(blob) => {
				const file = new File([blob!], "avatar.webp", {
					type: "image/webp",
				});
				resolve(file);
			},
			"image/webp",
			0.75,
		);
	});
}

export function ImageUploadModal({
	isOpen,
	onOpenChange,
	onClose,
	userId,
	onSuccess,
}: ImageUploadModalProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [previewFile, setPreviewFile] = useState<File | null>(null);
	const [uploadingImage, setUploadingImage] = useState(false);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = (ev) => {
				const img = new Image();
				img.onload = async () => {
					const croppedFile = await cropToSquareFile(img);
					const objectUrl = URL.createObjectURL(croppedFile);
					setPreviewSrc(objectUrl);
					setPreviewFile(croppedFile);
				};
				img.src = ev.target?.result as string;
			};
			reader.readAsDataURL(file);
		},
		[],
	);

	const handleClearPreview = () => {
		setPreviewSrc(null);
		setPreviewFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleConfirmUpload = async () => {
		if (!previewFile || !userId) return;
		setUploadingImage(true);

		const { success, publicUrl, error } = await uploadProfileImage(
			userId,
			previewFile,
		);

		if (!success || !publicUrl) {
			addToast({
				title: "Upload Failed",
				description:
					error ?? "Something went wrong uploading your photo.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			setUploadingImage(false);
			return;
		}

		const { success: dbSuccess, error: dbError } = await updateUserProfile(
			userId,
			{ user_profile_img_url: publicUrl },
		);

		if (!dbSuccess) {
			addToast({
				title: "Save Failed",
				description: dbError ?? "Could not update profile photo URL.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			setUploadingImage(false);
			return;
		}

		addToast({
			title: "Photo Updated",
			description: "Your profile picture has been updated.",
			color: "success",
			shouldShowTimeoutProgress: true,
			timeout: 4000,
		});
		setUploadingImage(false);
		onSuccess(publicUrl);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			backdrop="blur"
			disableAnimation
			size="md"
		>
			<ModalContent>
				{() => (
					<>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileSelect}
						/>

						<ModalHeader className="flex items-center gap-2">
							<Camera size={18} />
							<span>Update Profile Photo</span>
						</ModalHeader>

						<ModalBody className="flex flex-col items-center gap-4 pb-2">
							{previewSrc ? (
								<div className="relative">
									<img
										src={previewSrc}
										alt="Preview"
										className="w-48 h-48 rounded-full object-cover ring-4 ring-success/30"
									/>
									<button
										onClick={handleClearPreview}
										className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 shadow-md hover:bg-danger-400 transition"
										aria-label="Remove photo"
									>
										<X size={15} />
									</button>
								</div>
							) : (
								<div
									onClick={() =>
										fileInputRef.current?.click()
									}
									className="w-48 h-48 rounded-full border-2 border-dashed border-default-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-success hover:bg-success/5 transition-colors"
								>
									<Upload
										size={28}
										className="text-default-400"
									/>
									<span className="text-sm text-default-400 text-center px-2">
										Click to select image
									</span>
								</div>
							)}

							{!previewSrc && (
								<Button
									variant="flat"
									color="success"
									startContent={<Upload size={15} />}
									onPress={() =>
										fileInputRef.current?.click()
									}
								>
									Browse Image
								</Button>
							)}

							<p className="text-sm text-default-400 text-center">
								Image will be automatically cropped to a square.
							</p>
						</ModalBody>

						<ModalFooter>
							<Button
								variant="flat"
								color="default"
								onPress={onClose}
								isDisabled={uploadingImage}
							>
								Cancel
							</Button>
							<Button
								color="success"
								onPress={handleConfirmUpload}
								isDisabled={!previewFile || uploadingImage}
								startContent={
									uploadingImage ? (
										<Spinner size="sm" color="white" />
									) : (
										<Upload size={16} />
									)
								}
							>
								{uploadingImage ? "Uploading…" : "Upload Photo"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}

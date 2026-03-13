import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Textarea,
	addToast,
	Image as HeroImage,
	useDisclosure,
	CardFooter,
} from "@heroui/react";
import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
	MegaphoneIcon,
	PhotoIcon,
	TrashIcon,
	HistoryIcon,
} from "@/components/icons";
import { addAnnouncement } from "@/data/supabase/Admin/Announcements/addAnnouncement";
import { AnnouncementHistoryModal } from "./AnnouncementsComponent/AnnouncementHistoryModal";

export default function AdminAnnouncements() {
	const { profile } = useOutletContext<any>();
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [images, setImages] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setImages((prev) => [...prev, ...newFiles]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async () => {
		if (!title || !body) {
			addToast({
				title: "Error",
				description: "Please provide a title and body.",
				color: "danger",
			});
			return;
		}

		setLoading(true);
		const result = await addAnnouncement(title, body, images);
		setLoading(false);

		if (result.success) {
			addToast({
				title: "Success",
				description: "Announcement posted successfully!",
				color: "success",
			});
			setTitle("");
			setBody("");
			setImages([]);
		} else {
			addToast({
				title: "Error",
				description: result.error || "Failed to post announcement.",
				color: "danger",
			});
		}
	};

	return (
		<div className="flex flex-col gap-8 p-4 h-full overflow-y-auto">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
				<div className="flex flex-row items-center gap-2">
					<MegaphoneIcon size={20} />
					<div className="text-3xl font-semibold">Announcements</div>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex flex-row gap-1 items-center text-muted-foreground">
						<div className="text-base text-default-500">
							Logged in as{" "}
						</div>
						<div className="text-lg font-semibold">
							{profile?.user_name ?? "Admin"}
						</div>
					</div>
				</div>
			</div>
			<Button
				color="success"
				startContent={<HistoryIcon size={20} />}
				onPress={onOpen}
				className="font-semibold w-fit mx-auto"
			>
				View Announcement History
			</Button>
			<Card className="max-w-3xl w-full mx-auto">
				<CardHeader className="flex flex-col gap-1 items-start px-6 pt-6">
					<p className="text-lg font-bold">Post Announcement</p>
					<p className="text-xs text-default-400">
						This will send a notification to all registered users.
					</p>
				</CardHeader>
				<CardBody className="flex flex-col gap-6 px-6 pb-6">
					<Input
						label="Title"
						placeholder="e.g. Products Price Changes"
						value={title}
						onValueChange={setTitle}
						isRequired
						variant="bordered"
					/>
					<Textarea
						label="Body"
						placeholder="Explain what's happening..."
						value={body}
						onValueChange={setBody}
						isRequired
						variant="bordered"
						minRows={4}
					/>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<span className="font-medium">Images</span>
							<Button
								color="success"
								variant="flat"
								startContent={<PhotoIcon className="size-5" />}
								onPress={() => fileInputRef.current?.click()}
							>
								Add Images
							</Button>
						</div>

						<input
							type="file"
							multiple
							accept="image/*"
							className="hidden"
							ref={fileInputRef}
							onChange={handleImageChange}
						/>

						{images.length > 0 ? (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								{images.map((file, index) => (
									<div
										key={index}
										className="relative group aspect-square rounded-xl overflow-hidden border border-divider"
									>
										<HeroImage
											src={URL.createObjectURL(file)}
											alt={`Preview ${index}`}
											className="w-full h-full object-cover"
										/>
										<Button
											isIconOnly
											size="sm"
											color="danger"
											className="absolute top-1 right-1 z-10"
											onPress={() => removeImage(index)}
										>
											<TrashIcon className="size-4" />
										</Button>
									</div>
								))}
							</div>
						) : (
							<div className="border-2 border-dashed border-divider rounded-xl py-12 flex flex-col items-center justify-center text-default-400">
								<PhotoIcon className="size-12 mb-2 opacity-20" />
								<p className="text-xs">No images selected</p>
							</div>
						)}
					</div>
				</CardBody>
				<CardFooter>
					<Button
						color="success"
						fullWidth
						onPress={handleSubmit}
						isLoading={loading}
						className="font-semibold mt-4"
					>
						Post Announcement
					</Button>
				</CardFooter>
			</Card>

			<AnnouncementHistoryModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
		</div>
	);
}

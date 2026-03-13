import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Textarea,
	addToast,
	Image as HeroImage,
} from "@heroui/react";
import { useState, useRef } from "react";
import { MegaphoneIcon, PhotoIcon, TrashIcon } from "@/components/icons";
import { addAnnouncement } from "@/data/supabase/Admin/Announcements/addAnnouncement";

export default function AdminAnnouncements() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [images, setImages] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

		if (images.length === 0) {
			addToast({
				title: "Error",
				description: "Please upload at least one image.",
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
		<div className="p-5 md:p-8 flex flex-col gap-8">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<MegaphoneIcon className="size-8 text-success" />
					Announcements
				</h1>
				<p className="text-default-500">
					Post news, updates, or price changes to all users.
				</p>
			</div>

			<Card className="max-w-2xl">
				<CardHeader className="flex flex-col gap-1 items-start px-6 pt-6">
					<p className="text-lg font-bold">New Announcement</p>
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
							<span className="text-sm font-medium">Images</span>
							<Button
								size="sm"
								color="success"
								variant="flat"
								startContent={<PhotoIcon className="size-4" />}
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
											className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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

					<Button
						color="success"
						fullWidth
						size="lg"
						onPress={handleSubmit}
						isLoading={loading}
						className="font-bold mt-4"
					>
						Post Announcement
					</Button>
				</CardBody>
			</Card>
		</div>
	);
}

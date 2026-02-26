const MAX_IMAGES = 2;
import { TrashIcon } from "@/components/icons";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRef } from "react";
export function Step3({
	idImages,
	setIdImages,
	tried,
}: {
	idImages: File[];
	setIdImages: React.Dispatch<React.SetStateAction<File[]>>;
	tried: boolean;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		setIdImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
		e.target.value = "";
	};

	const removeImage = (i: number) =>
		setIdImages((prev) => prev.filter((_, idx) => idx !== i));
	return (
		<div className="flex flex-col gap-3 w-full">
			<div className="flex items-center justify-between">
				<span className="text-sm text-default-500">
					Upload Valid ID{" "}
					<span className="text-default-400">
						(up to {MAX_IMAGES})
					</span>
				</span>
				<span className="text-xs text-default-400">
					{idImages.length}/{MAX_IMAGES}
				</span>
			</div>

			{/* Upload zone */}
			{idImages.length < MAX_IMAGES && (
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="flex flex-col items-center justify-center gap-1.5 w-full rounded-2xl border-2 border-dashed border-default-300 hover:border-[#36975f] hover:bg-[#36975f]/5 transition-all py-7 cursor-pointer"
				>
					<Icon
						icon="solar:cloud-upload-bold-duotone"
						className="text-4xl text-default-400"
					/>
					<span className="text-sm text-default-500 font-medium">
						Click to upload
					</span>
					<span className="text-xs text-default-400">
						PNG, JPG, WEBP
					</span>
				</button>
			)}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				className="hidden"
				onChange={handleImageChange}
			/>

			{/* Previews */}
			{idImages.length > 0 && (
				<div className="grid grid-cols-2 gap-2">
					{idImages.map((file, i) => (
						<div
							key={i}
							className="relative rounded-xl overflow-hidden border border-default-200 aspect-video"
						>
							<img
								src={URL.createObjectURL(file)}
								alt={`ID ${i + 1}`}
								className="w-full h-full object-cover"
							/>
							<Button
								onPress={() => removeImage(i)}
								className="absolute top-1 right-1 p-0.5"
								color="danger"
								startContent={<TrashIcon className="w-5" />}
								isIconOnly
							/>
						</div>
					))}
				</div>
			)}

			{tried && idImages.length === 0 && (
				<p className="text-xs text-danger">
					Please upload at least one valid ID
				</p>
			)}
		</div>
	);
}

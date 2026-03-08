import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Listbox,
	ListboxItem,
	ListboxSection,
	useDisclosure,
	Skeleton,
	addToast,
} from "@heroui/react";
import { useState } from "react";

import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { EditCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditCatModal";
import { DeleteCatModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteCatModal";
import { EditTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/EditTagModal";
import { DeleteTagModal } from "@/pages/Admin/ProductsComponent/ManageCatTagModalComponent/DeleteTagModal";
import {
	useFetchCategories,
	Category,
} from "@/data/supabase/useFetchCategories";
import { useFetchTags, Tag } from "@/data/supabase/useFetchTags";
import { addTag } from "@/data/supabase/Admin/Products/addTag";
import { addCategory } from "@/data/supabase/Admin/Products/addCat";

export function ManageCatTagModal({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: () => void;
}) {
	const {
		isOpen: isOpenEditCat,
		onOpen: onOpenEditCat,
		onOpenChange: onOpenChangeEditCat,
	} = useDisclosure();
	const {
		isOpen: isOpenDeleteCat,
		onOpen: onOpenDeleteCat,
		onOpenChange: onOpenChangeDeleteCat,
	} = useDisclosure();
	const {
		isOpen: isOpenEditTag,
		onOpen: onOpenEditTag,
		onOpenChange: onOpenChangeEditTag,
	} = useDisclosure();
	const {
		isOpen: isOpenDeleteTag,
		onOpen: onOpenDeleteTag,
		onOpenChange: onOpenChangeDeleteTag,
	} = useDisclosure();

	const {
		categories,
		setCategories,
		loading: catLoading,
		refetch: refetchCategories,
	} = useFetchCategories();
	const {
		tags,
		setTags,
		loading: tagLoading,
		refetch: refetchTags,
	} = useFetchTags();
	const [isLoadingTagAdd, setIsLoadingTagAdd] = useState(false);
	const [isLoadingCatAdd, setIsLoadingCatAdd] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
	const [tagName, setTagName] = useState<string>("");
	const [categoryName, setCategoryName] = useState<string>("");
	const [isCatSubmitted, setIsCatSubmitted] = useState(false);
	const [isTagSubmitted, setIsTagSubmitted] = useState(false);

	const handleAddCategory = async () => {
		setIsCatSubmitted(true);
		if (!categoryName.trim()) return;

		const nameToAdd = categoryName.trim();
		setIsLoadingCatAdd(true);

		// Optimistic Update
		const tempId = `temp-cat-${Date.now()}`;
		const newCategory = { category_id: tempId, category_name: nameToAdd };
		const previousCategories = [...categories];

		setCategories([newCategory, ...categories]);
		setCategoryName("");
		setIsCatSubmitted(false);

		const result = await addCategory(nameToAdd);

		if (!result?.success) {
			setCategories(previousCategories); // Rollback
			addToast({
				title: "Error Adding Category",
				description: result?.error ?? "Something went wrong",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		} else {
			addToast({
				title: "Success",
				description: `Added ${nameToAdd} successfully.`,
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			refetchCategories(); // Refetch to get real ID
		}
		setIsLoadingCatAdd(false);
	};

	const handleAddTag = async () => {
		setIsTagSubmitted(true);
		if (!tagName.trim()) return;

		const nameToAdd = tagName.trim();
		setIsLoadingTagAdd(true);

		// Optimistic Update
		const tempId = `temp-tag-${Date.now()}`;
		const newTag = { tag_id: tempId, tag_name: nameToAdd };
		const previousTags = [...tags];

		setTags([newTag, ...tags]);
		setTagName("");
		setIsTagSubmitted(false);

		const result = await addTag(nameToAdd);

		if (!result?.success) {
			setTags(previousTags); // Rollback
			addToast({
				title: "Error Adding Tag",
				description: result?.error ?? "Something went wrong",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		} else {
			addToast({
				title: "Success",
				description: `Added ${nameToAdd} successfully.`,
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			refetchTags(); // Refetch to get real ID
		}
		setIsLoadingTagAdd(false);
	};

	const ListSkeleton = () => (
		<div className="flex justify-between items-center w-full py-1">
			<Skeleton className="h-4 w-24 rounded-lg" />
			<div className="flex gap-2">
				<Skeleton className="h-6 w-6 rounded-md" />
				<Skeleton className="h-6 w-6 rounded-md" />
			</div>
		</div>
	);

	return (
		<>
			<Modal
				backdrop="blur"
				disableAnimation
				isOpen={isOpen}
				scrollBehavior="inside"
				size="lg"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Manage Options
							</ModalHeader>
							<ModalBody className="flex flex-row gap-2 items-start">
								<div className="flex flex-col gap-2 items-center flex-1">
									<div className="flex flex-row gap-2 w-full">
										<Input
											placeholder="Add a Category"
											value={categoryName}
											onValueChange={(val) => {
												setCategoryName(val);
												setIsCatSubmitted(false);
											}}
											isInvalid={
												isCatSubmitted &&
												!categoryName.trim()
											}
											description="Name for new Category"
											errorMessage="Name can't be empty"
											isDisabled={isLoadingCatAdd}
										/>
										<Button
											isIconOnly
											color="success"
											startContent={
												!isLoadingCatAdd && (
													<PlusIcon className="w-5" />
												)
											}
											variant="light"
											onPress={handleAddCategory}
											isLoading={isLoadingCatAdd}
										/>
									</div>
									<Listbox aria-label="Categories">
										<ListboxSection title="Categories">
											{catLoading &&
											categories.length === 0 ? (
												<>
													<ListboxItem key="sk1">
														<ListSkeleton />
													</ListboxItem>
													<ListboxItem key="sk2">
														<ListSkeleton />
													</ListboxItem>
													<ListboxItem key="sk3">
														<ListSkeleton />
													</ListboxItem>
												</>
											) : (
												categories.map((cat) => (
													<ListboxItem
														key={cat.category_id}
														className="hover:bg-transparent data-[hover=true]:bg-transparent"
													>
														<div className="flex justify-between items-center w-full">
															<span>
																{
																	cat.category_name
																}
															</span>
															<div className="flex flex-row items-center">
																<Button
																	isIconOnly
																	size="sm"
																	variant="light"
																	onPress={() => {
																		setSelectedCategory(
																			cat,
																		);
																		onOpenEditCat();
																	}}
																	startContent={
																		<PencilIcon className="w-5" />
																	}
																/>

																<Button
																	isIconOnly
																	color="danger"
																	size="sm"
																	variant="light"
																	onPress={() => {
																		setSelectedCategory(
																			cat,
																		);
																		onOpenDeleteCat();
																	}}
																	startContent={
																		<TrashIcon className="w-5" />
																	}
																/>
															</div>
														</div>
													</ListboxItem>
												))
											)}
										</ListboxSection>
									</Listbox>
								</div>

								<div className="flex flex-col gap-2 items-center flex-1">
									<div className="flex flex-row gap-2 w-full">
										<Input
											placeholder="Add a Tag"
											value={tagName}
											onValueChange={(val) => {
												setTagName(val);
												setIsTagSubmitted(false);
											}}
											isInvalid={
												isTagSubmitted &&
												!tagName.trim()
											}
											description="Name for new Tag"
											errorMessage="Name can't be empty"
											isDisabled={isLoadingTagAdd}
										/>
										<Button
											isIconOnly
											color="success"
											startContent={
												!isLoadingTagAdd && (
													<PlusIcon className="w-5" />
												)
											}
											variant="light"
											onPress={handleAddTag}
											isLoading={isLoadingTagAdd}
										/>
									</div>
									<Listbox aria-label="Tags">
										<ListboxSection title="Tags">
											{tagLoading && tags.length === 0 ? (
												<>
													<ListboxItem key="tsk1">
														<ListSkeleton />
													</ListboxItem>
													<ListboxItem key="tsk2">
														<ListSkeleton />
													</ListboxItem>
												</>
											) : (
												tags.map((tag) => (
													<ListboxItem
														key={tag.tag_id}
														className="hover:bg-transparent data-[hover=true]:bg-transparent"
													>
														<div className="flex justify-between items-center w-full">
															<span>
																{tag.tag_name}
															</span>
															<div className="flex flex-row items-center">
																<Button
																	isIconOnly
																	size="sm"
																	variant="light"
																	onPress={() => {
																		setSelectedTag(
																			tag,
																		);
																		onOpenEditTag();
																	}}
																	startContent={
																		<PencilIcon className="w-5" />
																	}
																/>

																<Button
																	isIconOnly
																	color="danger"
																	size="sm"
																	variant="light"
																	onPress={() => {
																		setSelectedTag(
																			tag,
																		);
																		onOpenDeleteTag();
																	}}
																	startContent={
																		<TrashIcon className="w-5" />
																	}
																/>
															</div>
														</div>
													</ListboxItem>
												))
											)}
										</ListboxSection>
									</Listbox>
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
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<EditCatModal
				isOpenEditCat={isOpenEditCat}
				refetch={refetchCategories}
				selectedCategory={selectedCategory}
				onOpenChangeEditCat={onOpenChangeEditCat}
			/>
			<DeleteCatModal
				isOpenDeleteCat={isOpenDeleteCat}
				refetch={refetchCategories}
				selectedCategory={selectedCategory}
				onOpenChangeDeleteCat={onOpenChangeDeleteCat}
				categories={categories}
				setCategories={setCategories}
			/>
			<EditTagModal
				isOpenEditTag={isOpenEditTag}
				refetch={refetchTags}
				selectedTag={selectedTag}
				onOpenChangeEditTag={onOpenChangeEditTag}
			/>
			<DeleteTagModal
				isOpenDeleteTag={isOpenDeleteTag}
				refetch={refetchTags}
				selectedTag={selectedTag}
				onOpenChangeDeleteTag={onOpenChangeDeleteTag}
				tags={tags}
				setTags={setTags}
			/>
		</>
	);
}

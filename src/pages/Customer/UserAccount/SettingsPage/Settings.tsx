import { useState } from "react";
import {
	Button,
	Input,
	Avatar,
	Chip,
	useDisclosure,
	addToast,
	Divider,
	Card,
	CardBody,
} from "@heroui/react";
import {
	User,
	Phone,
	Camera,
	Save,
	Shield,
	AtSign,
	CheckCircle2,
	Clock,
	XCircle,
	AlertTriangle,
	type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";
import { updateUserProfile } from "@/data/supabase/General/User/updateUserProfile";
import { ImageUploadModal } from "./ImageUploadModal";

const phoneRegex = /^(?:\+639|09)\d{9}$/;

function sanitizePhone(value: string): string {
	const filtered = value.replace(/[^0-9+]/g, "");
	return filtered.startsWith("+")
		? "+" + filtered.slice(1).replace(/\+/g, "")
		: filtered.replace(/\+/g, "");
}

function getPhoneError(phone: string): string | null {
	if (!phone) return null;
	if (!phoneRegex.test(phone.trim()))
		return "Enter a valid Philippine mobile number (+639 or 09)";
	return null;
}

type UserStatus = "For Approval" | "Approved" | "Rejected" | "Suspended";
type UserRole = "Individual" | "Cooperative" | "Admin";

const STATUS_CONFIG: Record<
	UserStatus,
	{ color: "warning" | "success" | "danger"; Icon: LucideIcon }
> = {
	"For Approval": { color: "warning", Icon: Clock },
	Approved: { color: "success", Icon: CheckCircle2 },
	Rejected: { color: "danger", Icon: XCircle },
	Suspended: { color: "danger", Icon: AlertTriangle },
};

const ROLE_COLOR: Record<UserRole, "default" | "primary" | "secondary"> = {
	Individual: "default",
	Cooperative: "primary",
	Admin: "secondary",
};

export default function Settings() {
	const auth = useAuth();
	const profile = auth?.profile ?? null;
	const user = auth?.user ?? null;

	// Editable: display name
	const [userName, setUserName] = useState(profile?.user_name ?? "");
	const [triedName, setTriedName] = useState(false);
	const [savingName, setSavingName] = useState(false);
	const userNameError =
		triedName && userName.trim() === "" ? "Display name is required" : null;

	const handleSaveName = async () => {
		setTriedName(true);
		if (userName.trim() === "" || !user?.id) return;
		setSavingName(true);
		const { success, error } = await updateUserProfile(user.id, {
			user_name: userName.trim(),
		});
		setSavingName(false);
		if (success) {
			addToast({
				title: "Name Updated",
				description: "Your display name has been saved.",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 4000,
			});
		} else {
			addToast({
				title: "Update Failed",
				description: error ?? "Something went wrong. Please try again.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		}
	};

	// Editable: phone
	const [phone, setPhone] = useState(profile?.user_phone_number ?? "");
	const [triedPhone, setTriedPhone] = useState(false);
	const [savingPhone, setSavingPhone] = useState(false);
	const phoneFormatError = getPhoneError(phone);
	const phoneFieldError =
		triedPhone && phone.trim() === ""
			? "Phone number is required"
			: (phoneFormatError ?? null);

	const handleSavePhone = async () => {
		setTriedPhone(true);
		if (phone.trim() === "" || phoneFormatError || !user?.id) return;
		setSavingPhone(true);
		const { success, error } = await updateUserProfile(user.id, {
			user_phone_number: phone.trim(),
		});
		setSavingPhone(false);
		if (success) {
			addToast({
				title: "Phone Updated",
				description: "Your phone number has been saved.",
				color: "success",
				shouldShowTimeoutProgress: true,
				timeout: 4000,
			});
		} else {
			addToast({
				title: "Update Failed",
				description: error ?? "Something went wrong. Please try again.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
		}
	};

	// Image upload modal
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

	const currentAvatarUrl = localAvatarUrl ?? profile?.user_profile_img_url;

	const handleOpenUpload = () => {
		onOpen();
	};

	// Derived values
	const statusConfig = profile?.user_status
		? STATUS_CONFIG[profile.user_status as UserStatus]
		: null;
	const roleColor = profile?.user_role
		? ROLE_COLOR[profile.user_role as UserRole]
		: "default";

	// Check for changes
	const isNameChanged = userName.trim() !== (profile?.user_name ?? "");
	const isPhoneChanged = phone.trim() !== (profile?.user_phone_number ?? "");

	return (
		<div className="min-h-screen bg-background px-4 py-10 flex flex-col items-center">
			<div className="w-full max-w-lg flex flex-col gap-6">
				{/* Page title */}
				<div className="flex flex-col gap-1">
					<h1 className="text-2xl font-bold">Account Settings</h1>
					<p className="text-sm text-default-500">
						Manage your personal information.
					</p>
				</div>

				{/* Avatar card */}
				<div className="bg-content1 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm border border-default-100">
					<div className="relative group">
						<Avatar
							src={currentAvatarUrl ?? undefined}
							name={profile?.user_name ?? "?"}
							className="w-32 h-32 text-3xl ring-5 ring-success/30 ring-offset-5 ring-offset-content1"
							isBordered
							color="success"
						/>
						<button
							onClick={handleOpenUpload}
							className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							aria-label="Change profile photo"
						>
							<Camera size={28} className="text-white" />
						</button>
					</div>

					<Button
						variant="flat"
						color="success"
						startContent={<Camera size={15} />}
						onPress={handleOpenUpload}
					>
						Change Photo
					</Button>

					<div className="flex flex-wrap gap-2 justify-center">
						{statusConfig && profile?.user_status && (
							<Chip color={statusConfig.color} variant="flat">
								{profile.user_status}
							</Chip>
						)}
						{profile?.user_role && (
							<Chip color={roleColor} variant="flat">
								{profile.user_role}
							</Chip>
						)}
					</div>
				</div>

				{/* Profile Information Card */}
				<Card className="border-none bg-content1 shadow-sm" radius="lg">
					<CardBody className="flex flex-col gap-8 p-6">
						{/* Display Name Section */}
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-0.5">
								<h2 className="font-semibold text-base">
									Display Name
								</h2>
								<p className="text-xs text-default-400">
									Shown across the platform as your name.
								</p>
							</div>
							<div className="flex flex-col items-end gap-2">
								<Input
									label="Name"
									labelPlacement="outside"
									placeholder="e.g. Juan dela Cruz"
									value={userName}
									onValueChange={setUserName}
									isInvalid={!!userNameError}
									errorMessage={userNameError ?? undefined}
									startContent={
										<User
											size={16}
											className="text-default-400"
										/>
									}
									className="flex-1"
								/>
								<Button
									color="success"
									fullWidth
									startContent={<Save size={16} />}
									onPress={handleSaveName}
									isLoading={savingName}
									isDisabled={
										!isNameChanged || !!userNameError
									}
								>
									Save
								</Button>
							</div>
						</div>

						{/* Phone Number Section */}
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-0.5">
								<h2 className="font-semibold text-base">
									Phone Number
								</h2>
								<p className="text-xs text-default-400">
									Must be a valid Philippine mobile number.
								</p>
							</div>
							<div className="flex flex-col items-end gap-2">
								<Input
									label="Phone"
									labelPlacement="outside"
									placeholder="+63 9XX XXX XXXX"
									type="tel"
									value={phone}
									onValueChange={(val) =>
										setPhone(sanitizePhone(val))
									}
									isInvalid={!!phoneFieldError}
									errorMessage={phoneFieldError ?? undefined}
									startContent={
										<Phone
											size={16}
											className="text-default-400"
										/>
									}
									className="flex-1"
								/>
								<Button
									color="success"
									fullWidth
									startContent={<Save size={16} />}
									onPress={handleSavePhone}
									isLoading={savingPhone}
									isDisabled={
										!isPhoneChanged || !!phoneFieldError
									}
								>
									Save
								</Button>
							</div>
						</div>
					</CardBody>
				</Card>

				{/* Read-only info card */}
				<div className="bg-content1 rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-default-100">
					<div className="flex flex-col gap-0.5">
						<h2 className="font-semibold text-base">
							Account Info
						</h2>
						<p className="text-xs text-default-400">
							These fields cannot be edited.
						</p>
					</div>

					<Divider />

					<ReadOnlyRow
						icon={<AtSign size={16} className="text-default-400" />}
						label="Login Username"
						value={profile?.login_user_name ?? "—"}
					/>
					<ReadOnlyRow
						icon={<Shield size={16} className="text-default-400" />}
						label="Role"
						value={profile?.user_role ?? "—"}
					/>
					<ReadOnlyRow
						icon={
							statusConfig ? (
								<statusConfig.Icon
									size={16}
									className="text-default-400"
								/>
							) : (
								<Shield
									size={16}
									className="text-default-400"
								/>
							)
						}
						label="Account Status"
						value={profile?.user_status ?? "—"}
						valueColor={
							profile?.user_status
								? {
										"For Approval": "text-warning",
										Approved: "text-success",
										Rejected: "text-danger",
										Suspended: "text-danger",
									}[profile.user_status as UserStatus]
								: undefined
						}
					/>
				</div>
			</div>

			{/* Image Upload Modal */}
			<ImageUploadModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={onClose}
				userId={user?.id ?? ""}
				onSuccess={(url: string) => setLocalAvatarUrl(url)}
			/>
		</div>
	);
}

// Helper sub-component
function ReadOnlyRow({
	icon,
	label,
	value,
	valueColor,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	valueColor?: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div className="p-2 rounded-lg bg-default-100 shrink-0">{icon}</div>
			<div className="flex flex-col min-w-0">
				<span className="text-xs text-default-400 leading-none mb-0.5">
					{label}
				</span>
				<span
					className={`text-sm font-medium truncate ${valueColor ?? "text-foreground"}`}
				>
					{value}
				</span>
			</div>
		</div>
	);
}

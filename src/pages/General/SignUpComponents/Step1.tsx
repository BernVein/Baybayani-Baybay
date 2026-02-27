import { Input } from "@heroui/react";
import {
	GroupUserIcon,
	KeyIcon,
	PhoneIcon,
	SoloUserIcon,
} from "@/components/icons";
import { Role } from "@/pages/General/SignUp";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseclient";

export function Step1({
	role,
	setRole,
	cooperativeName,
	setCooperativeName,
	fullName,
	setFullName,
	username,
	setUsername,
	phone,
	setPhone,
	tried,
	checkingUsername,
	setCheckingUsername,
}: {
	role: Role;
	setRole: (role: Role) => void;
	cooperativeName: string;
	setCooperativeName: (cooperativeName: string) => void;
	fullName: string;
	setFullName: (firstName: string) => void;
	username: string;
	setUsername: (username: string) => void;
	phone: string;
	setPhone: (phone: string) => void;
	tried: boolean;
	checkingUsername: boolean;
	setCheckingUsername: (checkingUsername: boolean) => void;
}) {
	const ROLES: Role[] = ["Individual", "Admin", "Cooperative"];
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [phoneError, setPhoneError] = useState<string | null>(null);

	const username_length = 5;
	const usernameRegex = /^[a-zA-Z0-9]+$/;
	const phoneRegex = /^(?:\+639|09)\d{9}$/;
	useEffect(() => {
		if (!phone) {
			setPhoneError(null);
			return;
		}

		const cleanPhone = phone.trim();

		if (!phoneRegex.test(cleanPhone)) {
			setPhoneError(
				"Enter a valid Philippine mobile number (+639 or 09)",
			);
		} else {
			setPhoneError(null);
		}
	}, [phone]);

	useEffect(() => {
		if (!username) {
			setUsernameError(null);
			return;
		}

		const cleanUsername = username.toLowerCase().trim();
		if (cleanUsername.length < username_length) {
			setUsernameError(
				`Username must be at least ${username_length} characters`,
			);
			return;
		}
		// Format validation first
		if (!usernameRegex.test(cleanUsername)) {
			setUsernameError(
				"Only letters and numbers allowed (no spaces or special characters)",
			);
			return;
		}

		setUsernameError(null);

		const timeout = setTimeout(async () => {
			setCheckingUsername(true);

			const { data, error } = await supabase
				.from("User")
				.select("login_user_name")
				.eq("login_user_name", cleanUsername)
				.maybeSingle();

			if (error) {
				setUsernameError("Error checking username");
			} else if (data) {
				setUsernameError("Username already taken");
			} else {
				setUsernameError(null);
			}

			setCheckingUsername(false);
		}, 500);

		return () => clearTimeout(timeout);
	}, [username]);

	const handlePhoneChange = (value: string) => {
		// Allow only digits and + sign
		const filtered = value.replace(/[^0-9+]/g, "");

		// Only allow + at the start
		const formatted = filtered.startsWith("+")
			? "+" + filtered.slice(1).replace(/\+/g, "") // remove any other +
			: filtered.replace(/\+/g, ""); // remove any + in middle

		setPhone(formatted);
	};
	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Role pills */}
			<div className="flex flex-col gap-1.5">
				<span className="text-sm text-default-500">Choose a Role</span>
				<div className="flex flex-wrap gap-2">
					{ROLES.map((r) => (
						<button
							key={r}
							type="button"
							onClick={() => setRole(r)}
							className={[
								"px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all",
								role === r
									? "border-[#36975f] bg-[#36975f]/10 text-[#36975f]"
									: "border-default-200 text-default-500 hover:border-default-400",
							].join(" ")}
						>
							{r}
						</button>
					))}
				</div>
			</div>

			{/* Name fields */}
			{role === "Cooperative" ? (
				<Input
					label="Cooperative Name"
					description="For name display"
					labelPlacement="outside"
					placeholder="e.g. Baybay Farmers Cooperative"
					value={cooperativeName}
					onValueChange={setCooperativeName}
					isInvalid={tried && cooperativeName.trim() === ""}
					errorMessage="Required"
					startContent={<GroupUserIcon className="w-5" />}
				/>
			) : (
				<div className="flex gap-3">
					<Input
						label="Full Name"
						description="For name display"
						labelPlacement="outside"
						placeholder="e.g. Juan dela Cruz"
						value={fullName}
						onValueChange={setFullName}
						isInvalid={tried && fullName.trim() === ""}
						errorMessage="Required"
						startContent={
							role === "Individual" ? (
								<SoloUserIcon className="w-5" />
							) : (
								<KeyIcon className="w-5" />
							)
						}
					/>
				</div>
			)}

			{/* Username */}
			<Input
				label="Username"
				labelPlacement="outside"
				placeholder="Choose a username"
				value={username}
				onValueChange={(val) => setUsername(val.toLowerCase())}
				isInvalid={!!usernameError || (tried && username.trim() === "")}
				errorMessage={
					username.trim() === ""
						? "Username is required"
						: (usernameError ?? undefined)
				}
				description={
					username.trim() === "" ? (
						"For login credential"
					) : checkingUsername ? (
						"Checking availability..."
					) : !usernameError ? (
						<div className="text-success">Username available</div>
					) : undefined
				}
			/>

			{/* Phone */}
			<Input
				label="Phone Number"
				labelPlacement="outside"
				placeholder="+63 9XX XXX XXXX"
				type="tel"
				value={phone}
				onValueChange={handlePhoneChange}
				isInvalid={!!phoneError || (tried && phone.trim() === "")}
				errorMessage={
					phone.trim() === ""
						? "Phone number is required"
						: (phoneError ?? undefined)
				}
				startContent={<PhoneIcon className="w-5" />}
			/>
		</div>
	);
}

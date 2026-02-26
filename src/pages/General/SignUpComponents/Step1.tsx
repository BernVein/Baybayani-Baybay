import { Input } from "@heroui/react";
import { GroupUserIcon, UserIcon, PhoneIcon } from "@/components/icons";
import { Role } from "@/pages/General/SignUp";

export function Step1({
	role,
	setRole,
	cooperativeName,
	setCooperativeName,
	firstName,
	setFirstName,
	lastName,
	setLastName,
	username,
	setUsername,
	phone,
	setPhone,
	tried,
}: {
	role: Role;
	setRole: (role: Role) => void;
	cooperativeName: string;
	setCooperativeName: (cooperativeName: string) => void;
	firstName: string;
	setFirstName: (firstName: string) => void;
	lastName: string;
	setLastName: (lastName: string) => void;
	username: string;
	setUsername: (username: string) => void;
	phone: string;
	setPhone: (phone: string) => void;
	tried: boolean;
}) {
	const ROLES: Role[] = ["Customer", "Admin", "Cooperative"];

	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Role pills */}
			<div className="flex flex-col gap-1.5">
				<span className="text-sm text-default-500">User Role</span>
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
						label="First Name"
						labelPlacement="outside"
						placeholder="Juan"
						value={firstName}
						onValueChange={setFirstName}
						isInvalid={tried && firstName.trim() === ""}
						errorMessage="Required"
					/>
					<Input
						label="Last Name"
						labelPlacement="outside"
						placeholder="dela Cruz"
						value={lastName}
						onValueChange={setLastName}
						isInvalid={tried && lastName.trim() === ""}
						errorMessage="Required"
					/>
				</div>
			)}

			{/* Username */}
			<Input
				label="Username"
				labelPlacement="outside"
				placeholder="Choose a username"
				value={username}
				onValueChange={setUsername}
				isInvalid={tried && username.trim() === ""}
				errorMessage="Username is required"
				startContent={<UserIcon className="w-5" />}
			/>

			{/* Phone */}
			<Input
				label="Phone Number"
				labelPlacement="outside"
				placeholder="+63 9XX XXX XXXX"
				type="tel"
				value={phone}
				onValueChange={setPhone}
				isInvalid={tried && phone.trim() === ""}
				errorMessage="Phone number is required"
				startContent={<PhoneIcon className="w-5" />}
			/>
		</div>
	);
}

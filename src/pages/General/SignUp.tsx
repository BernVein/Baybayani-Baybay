import { useState, useRef } from "react";
import { Image, Input, Button } from "@heroui/react";
import { BaybayaniLogo } from "@/components/icons";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { Icon } from "@iconify/react";

type Role = "Customer" | "Admin" | "Cooperative";
const ROLES: Role[] = ["Customer", "Admin", "Cooperative"];
const MAX_IMAGES = 4;
const TOTAL_STEPS = 3;
const STEP_LABELS = ["Account Info", "Password", "Valid ID"];

export default function SignUp() {
	// Step 1 Fields
	const [step, setStep] = useState(0);
	const [role, setRole] = useState<Role>("Customer");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [cooperativeName, setCooperativeName] = useState("");
	const [username, setUsername] = useState("");
	const [phone, setPhone] = useState("");

	// Step 2 Fields
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	// Step 3 Fields
	const [idImages, setIdImages] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Validation triggered
	const [tried, setTried] = useState(false);

	const isCooperative = role === "Cooperative";

	const step1Valid =
		(isCooperative
			? cooperativeName.trim() !== ""
			: firstName.trim() !== "" && lastName.trim() !== "") &&
		username.trim() !== "" &&
		phone.trim() !== "";

	const step2Valid = password.length >= 8 && confirmPassword === password;

	const step3Valid = idImages.length > 0;

	const handleNext = () => {
		setTried(true);
		const valid = [step1Valid, step2Valid, step3Valid][step];
		if (!valid) return;
		setTried(false);
		setStep((s) => s + 1);
	};

	const handleBack = () => {
		setTried(false);
		setStep((s) => s - 1);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTried(true);
		if (!step3Valid) return;
		// TODO: hook up to database
		alert("Sign up submitted!");
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		setIdImages((prev) => [...prev, ...files].slice(0, MAX_IMAGES));
		e.target.value = "";
	};

	const removeImage = (i: number) =>
		setIdImages((prev) => prev.filter((_, idx) => idx !== i));

	const Step1 = (
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
			{isCooperative ? (
				<Input
					label="Cooperative Name"
					labelPlacement="outside"
					placeholder="e.g. Baybay Farmers Cooperative"
					value={cooperativeName}
					onValueChange={setCooperativeName}
					isInvalid={tried && cooperativeName.trim() === ""}
					errorMessage="Required"
					startContent={
						<Icon
							icon="solar:buildings-2-bold-duotone"
							className="text-default-400 text-lg shrink-0"
						/>
					}
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
				startContent={
					<Icon
						icon="solar:user-bold-duotone"
						className="text-default-400 text-lg shrink-0"
					/>
				}
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
				startContent={
					<Icon
						icon="solar:phone-bold-duotone"
						className="text-default-400 text-lg shrink-0"
					/>
				}
			/>
		</div>
	);

	const Step2 = (
		<div className="flex flex-col gap-4 w-full">
			<Input
				label="Create Password"
				labelPlacement="outside"
				placeholder="At least 8 characters"
				type={showPass ? "text" : "password"}
				value={password}
				onValueChange={setPassword}
				isInvalid={tried && password.length < 8}
				errorMessage="Password must be at least 8 characters"
				startContent={
					<Icon
						icon="solar:lock-password-bold-duotone"
						className="text-default-400 text-lg shrink-0"
					/>
				}
				endContent={
					<button
						type="button"
						onClick={() => setShowPass((v) => !v)}
						className="focus:outline-none"
					>
						{showPass ? (
							<EyeSlashFilledIcon className="text-xl text-default-400" />
						) : (
							<EyeFilledIcon className="text-xl text-default-400" />
						)}
					</button>
				}
			/>
			<Input
				label="Confirm Password"
				labelPlacement="outside"
				placeholder="Re-enter your password"
				type={showConfirm ? "text" : "password"}
				value={confirmPassword}
				onValueChange={setConfirmPassword}
				isInvalid={tried && confirmPassword !== password}
				errorMessage="Passwords do not match"
				startContent={
					<Icon
						icon="solar:shield-check-bold-duotone"
						className="text-default-400 text-lg shrink-0"
					/>
				}
				endContent={
					<button
						type="button"
						onClick={() => setShowConfirm((v) => !v)}
						className="focus:outline-none"
					>
						{showConfirm ? (
							<EyeSlashFilledIcon className="text-xl text-default-400" />
						) : (
							<EyeFilledIcon className="text-xl text-default-400" />
						)}
					</button>
				}
			/>
			{/* Password strength hints */}
			<div className="flex flex-col gap-1 mt-1">
				{[
					{
						label: "At least 8 characters",
						ok: password.length >= 8,
					},
					{
						label: "Passwords match",
						ok: password.length > 0 && confirmPassword === password,
					},
				].map(({ label, ok }) => (
					<div
						key={label}
						className="flex items-center gap-2 text-xs"
					>
						<Icon
							icon={
								ok
									? "solar:check-circle-bold"
									: "solar:close-circle-bold"
							}
							className={
								ok ? "text-[#36975f]" : "text-default-300"
							}
						/>
						<span
							className={
								ok ? "text-[#36975f]" : "text-default-400"
							}
						>
							{label}
						</span>
					</div>
				))}
			</div>
		</div>
	);

	const Step3 = (
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
							<button
								type="button"
								onClick={() => removeImage(i)}
								className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-all"
							>
								<Icon
									icon="solar:close-circle-bold"
									className="text-base"
								/>
							</button>
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

	const STEPS = [Step1, Step2, Step3];

	return (
		<div className="relative min-h-screen flex">
			<h1 className="absolute top-10 left-10 flex-row text-4xl font-bold leading-tight z-20 items-center sm:flex hidden">
				<BaybayaniLogo className="md:w-15 w-10 mr-5" />
				<span className="mr-2">Welcome to </span>
				<span className="text-[#36975f]">BAYBAY</span>
				<span className="text-[#F9C424]">ANI</span>
			</h1>

			{/*Form Side */}
			<div className="flex w-full sm:w-1/2 items-center justify-center z-10 px-4 py-16">
				<div className="text-2xl font-bold w-full max-w-sm">
					{/* Mobile logo */}
					<div className="flex flex-col gap-2 items-center sm:hidden mb-6">
						<BaybayaniLogo className="w-15" />
						<div className="flex flex-row items-center justify-center">
							<span className="text-[#36975f]">BAYBAY</span>
							<span className="text-[#F9C424]">ANI</span>
						</div>
					</div>

					{/* Header row */}
					<div className="flex flex-row w-full justify-between items-start mb-5">
						<div className="flex flex-col">
							<span className="text-2xl font-bold">
								{
									[
										"Account Info",
										"Set Password",
										"Upload ID",
									][step]
								}
							</span>
							<span className="font-semibold text-default-500 text-sm mt-0.5">
								{
									[
										"Fill in your basic details",
										"Secure your account",
										"Verify your identity",
									][step]
								}
							</span>
						</div>
						<ThemeSwitcher isIconOnly />
					</div>

					{/* Stepper indicator */}
					<div className="flex items-center gap-0 mb-6">
						{STEP_LABELS.map((label, i) => (
							<div
								key={i}
								className="flex items-center flex-1 last:flex-none"
							>
								{/* Circle */}
								<div className="flex flex-col items-center gap-1">
									<div
										className={[
											"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
											i < step
												? "bg-[#36975f] border-[#36975f] text-white"
												: i === step
													? "border-[#36975f] text-[#36975f] bg-transparent"
													: "border-default-300 text-default-400 bg-transparent",
										].join(" ")}
									>
										{i < step ? (
											<Icon
												icon="solar:check-bold"
												className="text-sm"
											/>
										) : (
											i + 1
										)}
									</div>
									<span
										className={[
											"text-[10px] font-medium",
											i === step
												? "text-[#36975f]"
												: "text-default-400",
										].join(" ")}
									>
										{label}
									</span>
								</div>
								{/* Connector */}
								{i < TOTAL_STEPS - 1 && (
									<div
										className={[
											"flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all",
											i < step
												? "bg-[#36975f]"
												: "bg-default-200",
										].join(" ")}
									/>
								)}
							</div>
						))}
					</div>

					{/*Form*/}
					<form
						onSubmit={
							step < TOTAL_STEPS - 1
								? (e) => {
										e.preventDefault();
										handleNext();
									}
								: handleSubmit
						}
						className="flex flex-col gap-5 items-center w-full"
					>
						{/* Step panel */}
						<div className="w-full">{STEPS[step]}</div>

						{/* Navigation buttons */}
						<div
							className={`flex gap-3 w-full mt-1 ${step === 0 ? "justify-end" : "justify-between"}`}
						>
							{step > 0 && (
								<Button
									type="button"
									variant="flat"
									color="default"
									onPress={handleBack}
									className="font-semibold"
									startContent={
										<Icon icon="solar:arrow-left-bold" />
									}
								>
									Back
								</Button>
							)}
							{step < TOTAL_STEPS - 1 ? (
								<Button
									type="submit"
									color="success"
									className="font-semibold text-white"
									endContent={
										<Icon icon="solar:arrow-right-bold" />
									}
								>
									Next
								</Button>
							) : (
								<Button
									type="submit"
									color="success"
									fullWidth={step === 0}
									className="font-semibold text-white"
								>
									Create Account
								</Button>
							)}
						</div>

						{/* Sign in link */}
						<div className="flex flex-row gap-2 items-center">
							<p className="text-sm text-default-500">
								Already have an account?
							</p>
							<p className="text-sm cursor-pointer hover:underline text-[#36975f] font-medium">
								Sign in
							</p>
						</div>
					</form>
				</div>
			</div>

			{/* Image Side */}
			<div className="hidden sm:block sm:w-1/2 relative">
				<div
					className="w-full h-full"
					style={{
						maskImage:
							"linear-gradient(to right, transparent, black 70%)",
						WebkitMaskImage:
							"linear-gradient(to right, transparent, black 70%)",
					}}
				>
					<Image
						src="/login_image.jpg"
						alt="Sign Up Illustration"
						removeWrapper
						className="w-full h-full rounded-none object-cover"
					/>
				</div>
			</div>
		</div>
	);
}

import { useState } from "react";
import { Image, addToast, Button, useDisclosure } from "@heroui/react";
import {
	BaybayaniLogo,
	RightArrow,
	LeftArrow,
	CheckIcon,
} from "@/components/icons";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { Step1 } from "@/pages/General/SignUpComponents/Step1";
import { Step2 } from "@/pages/General/SignUpComponents/Step2";
import { Step3 } from "@/pages/General/SignUpComponents/Step3";
import { registerUser } from "@/data/supabase/General/registerUser";
import { UserProfile } from "@/model/userProfile";
import { SignUpSuccessModal } from "@/pages/General/SignUpSuccessModal";
import { useNavigate } from "react-router-dom";

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Account Info", "Password", "Valid ID"];
export type Role = "Individual" | "Cooperative" | "Admin";

export default function SignUp() {
	const navigate = useNavigate();
	const {
		isOpen: isOpenWarning,
		onOpen: onOpenWarning,
		onOpenChange: onOpenChangeWarning,
	} = useDisclosure();
	// Step 1 Fields
	const [step, setStep] = useState(0);
	const [role, setRole] = useState<Role>("Individual");
	const [fullName, setFullName] = useState("");
	const [cooperativeName, setCooperativeName] = useState("");
	const [username, setUsername] = useState("");
	const [checkingUsername, setCheckingUsername] = useState(false);
	const [phone, setPhone] = useState("");

	// Step 2 Fields
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Step 3 Fields
	const [idImages, setIdImages] = useState<File[]>([]);
	const [isRegistering, setIsRegistering] = useState(false);
	// Validation triggered
	const [tried, setTried] = useState(false);

	const isCooperative = role === "Cooperative";

	const step1Valid =
		(isCooperative
			? cooperativeName.trim() !== ""
			: fullName.trim() !== "" && fullName.trim() !== "") &&
		username.trim() !== "" &&
		phone.trim() !== "";

	const step2Valid = password.length >= 8 && confirmPassword === password;

	const step3Valid = (idImages?.length || 0) > 0;

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
		handleRegisterUser();
	};

	const handleRegisterUser = async () => {
		try {
			setIsRegistering(true);
			const nameToUse =
				role === "Cooperative" ? cooperativeName : fullName;
			const userProfile: UserProfile = {
				user_name: nameToUse,
				user_role: role,
				user_profile_img_url: `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${nameToUse}`,
				user_theme: "light",
				login_user_name: username,
				user_phone_number: phone,
				user_status: "For Approval",
			};
			await registerUser(userProfile, password, idImages);

			onOpenWarning();
		} catch (error: any) {
			addToast({
				title: "Account Creation Failed",
				description:
					error.message || "Something went wrong. Please try again.",
				color: "danger",
				shouldShowTimeoutProgress: true,
				timeout: 5000,
			});
			setIsRegistering(false);
		}
	};

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
											<CheckIcon className="w-5" />
										) : (
											i + 1
										)}
									</div>
									<span
										className={[
											"text-sm font-medium",
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
						className="flex flex-col gap-5 items-center w-full min-h-[440px] justify-between"
					>
						{/* Step panel */}
						<div className="w-full flex-1">
							{step === 0 && (
								<Step1
									role={role}
									setRole={setRole}
									cooperativeName={cooperativeName}
									setCooperativeName={setCooperativeName}
									fullName={fullName}
									setFullName={setFullName}
									username={username}
									setUsername={setUsername}
									phone={phone}
									setPhone={setPhone}
									tried={tried}
									checkingUsername={checkingUsername}
									setCheckingUsername={setCheckingUsername}
								/>
							)}
							{step === 1 && (
								<Step2
									password={password}
									setPassword={setPassword}
									confirmPassword={confirmPassword}
									setConfirmPassword={setConfirmPassword}
									tried={tried}
								/>
							)}
							{step === 2 && (
								<Step3
									idImages={idImages}
									setIdImages={setIdImages || (() => {})}
									tried={tried}
								/>
							)}
						</div>

						{/* Navigation buttons */}
						<div
							className={`flex gap-3 w-full mt-auto ${step === 0 ? "justify-end" : "justify-between"}`}
						>
							{step > 0 && (
								<Button
									type="button"
									variant="flat"
									color="default"
									onPress={handleBack}
									className="font-semibold"
									startContent={<LeftArrow className="w-4" />}
								>
									Back
								</Button>
							)}
							{step < TOTAL_STEPS - 1 ? (
								<Button
									type="submit"
									color="success"
									className="font-semibold text-white"
									endContent={<RightArrow className="w-4" />}
									isDisabled={checkingUsername}
								>
									Next
								</Button>
							) : (
								<Button
									type="submit"
									color="success"
									fullWidth={step === 0}
									className="font-semibold text-white"
									isLoading={isRegistering}
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
							<p
								onClick={() => navigate("/login")}
								className="text-sm cursor-pointer hover:underline text-success font-bold"
							>
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
			<SignUpSuccessModal
				isOpen={isOpenWarning}
				onOpenChange={onOpenChangeWarning}
			/>
		</div>
	);
}

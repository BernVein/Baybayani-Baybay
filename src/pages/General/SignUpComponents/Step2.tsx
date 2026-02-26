import { Input } from "@heroui/react";
import {
	EyeFilledIcon,
	EyeSlashFilledIcon,
	LockIcon,
	ShieldIcon,
	XIcon,
	CheckIcon,
} from "@/components/icons";
import { useState } from "react";

export function Step2({
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	tried,
}: {
	password: string;
	setPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (confirmPassword: string) => void;
	tried: boolean;
}) {
	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	return (
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
				startContent={<LockIcon className="w-5" />}
				endContent={
					// Use native button cause hero UI button shows subtle animation even if disabled
					<button
						type="button"
						className="focus:outline-solid outline-transparent"
						onClick={() => setShowPass((v) => !v)}
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
				startContent={<ShieldIcon className="w-5" />}
				endContent={
					<button
						type="button"
						className="focus:outline-solid outline-transparent"
						onClick={() => setShowConfirm((v) => !v)}
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
						className="flex items-center gap-2 text-sm"
					>
						{ok ? (
							<CheckIcon className="w-4 text-success" />
						) : (
							<XIcon className="w-4" />
						)}
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
}

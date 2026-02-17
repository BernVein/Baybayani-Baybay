import {
	Image,
	Card,
	CardBody,
	Input,
	CardHeader,
	Checkbox,
	Button,
} from "@heroui/react";
import ThemeSwitcher from "@/components/navbar/themeSwitcher";
import { BaybayaniLogo } from "@/components/icons";

export default function Login() {
	return (
		<div className="relative min-h-screen flex">
			{/* Top-left welcome heading */}
			<h1 className="absolute top-10 left-10 flex-row text-4xl font-bold leading-tight z-20 items-center sm:flex hidden">
				<BaybayaniLogo className="md:w-15 w-10 mr-5" />
				<span className="mr-2">Welcome to </span>
				<span className="text-[#36975f]">BAYBAY</span>
				<span className="text-[#F9C424]">ANI</span>
			</h1>

			{/* Login Side */}
			<div className="flex w-full sm:w-1/2 items-center justify-center z-10">
				<div className="text-2xl font-bold">
					<Card
						className="p-5 w-100 sm:w-120"
						classNames={{
							base: "bg-transparent shadow-none border-none",
						}}
					>
						<div className="flex flex-col gap-2 items-center sm:hidden">
							<BaybayaniLogo className="w-15 mr-2" />
							<div className="flex flex-row items-center justify-center ">
								<span className="text-[#36975f]">BAYBAY</span>
								<span className="text-[#F9C424]">ANI</span>
							</div>
						</div>
						<CardHeader>
							<div className="flex flex-row w-full justify-between">
								<div className="flex flex-col">
									Welcome Back!
									<span className="font-semibold text-default-500 text-sm">
										Please enter your details
									</span>
								</div>
							</div>
							<ThemeSwitcher isIconOnly />
						</CardHeader>
						<CardBody className="gap-2 p-5 items-center justify-center">
							<p className="self-start text-sm text-default-500">
								Username
							</p>
							<Input />
							<p className="self-start text-sm text-default-500 mt-5">
								Password
							</p>
							<Input />
							<div className="flex justify-between items-center mt-5 w-full">
								<div className="flex items-center gap-2">
									<Checkbox
										defaultSelected
										color="success"
										size="sm"
									/>
									<span className="text-sm text-default-500">
										Remember me
									</span>
								</div>
								<p className="text-xs text-default-500 cursor-pointer hover:underline">
									Forgot Password?
								</p>
							</div>
							<Button fullWidth color="success" className="mt-5">
								Sign in
							</Button>
							<div className="flex flex-row gap-2 mt-5 items-center">
								<p className="text-sm text-default-500">
									Dont have an account?
								</p>
								<p className="text-sm cursor-pointer hover:underline">
									Sign up
								</p>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>

			{/* Image Side */}
			<div className="hidden sm:block sm:w-1/2 relative">
				<div
					className="w-full h-full"
					style={{
						// Fade effect from left to right
						maskImage:
							"linear-gradient(to right, transparent, black 70%)",
						WebkitMaskImage:
							"linear-gradient(to right, transparent, black 70%)",
					}}
				>
					<Image
						src="/login_image.jpg"
						alt="Login Illustration"
						removeWrapper
						className="w-full h-full rounded-none object-cover"
					/>
				</div>
			</div>
		</div>
	);
}

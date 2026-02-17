import {
	Image,
	Card,
	CardBody,
	Input,
	CardHeader,
	Checkbox,
	Button,
} from "@heroui/react";

export default function Login() {
	return (
		<div className="flex min-h-screen">
			{/* Login Side */}
			<div className="flex w-1/2 items-center justify-center ">
				<div className="text-2xl font-bold">
					<Card className="w-[500px] h-[500px] p-5">
						<CardHeader className="flex flex-col items-start">
							Welcome Back!
							<span className="font-semibold text-default-500 text-sm">
								Please enter your details
							</span>
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
								<div className="flex items-center">
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
							<Button fullWidth className="mt-5" color="success">
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
			<div className="w-1/2">
				<Image
					src="/login_image.jpg"
					alt="Login Illustration"
					removeWrapper
					className="w-full h-full rounded-none object-cover"
				/>
			</div>
		</div>
	);
}

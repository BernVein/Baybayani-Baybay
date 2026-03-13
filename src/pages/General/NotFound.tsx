import { Button, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { BaybayaniLogo } from "@/components/icons";
import { useAuth } from "@/ContextProvider/AuthContext/AuthProvider";

const NotFound = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const isLoggedIn = !!auth?.user;
	const isAdmin = auth?.profile?.user_role === "Admin";

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background">
			<div className="flex flex-col items-center gap-6 max-w-md w-full">
				<div className="flex items-center gap-2 mb-4">
					<BaybayaniLogo className="size-20" />
					<h1 className="text-4xl font-bold">
						<span className="text-[#146A38]">BAYBAY</span>
						<span className="text-[#F9C424]">ANI</span>
					</h1>
				</div>

				<div className="space-y-2">
					<h2 className="text-2xl font-semibold text-foreground">
						Page Not Found
					</h2>
					<p className="text-default-500">
						The page you're looking for doesn't exist or has been
						moved.
					</p>
				</div>

				<div className="flex flex-col w-full gap-3 mt-8">
					{!isAdmin && !isLoggedIn && (
						<Button
							color="success"
							size="lg"
							onPress={() => navigate(isAdmin ? "/" : "/shop")}
							className="font-semibold"
						>
							Go to shop
						</Button>
					)}

					{!isLoggedIn ? (
						<div className="flex gap-3 w-full">
							<Button
								as={Link}
								href="/login"
								variant="flat"
								color="primary"
								className="flex-1 font-semibold"
								onPress={() => {
									navigate("/login");
								}}
							>
								Log In
							</Button>
							<Button
								as={Link}
								href="/signup"
								variant="flat"
								className="flex-1 font-semibold"
								onPress={() => {
									navigate("/signup");
								}}
							>
								Sign Up
							</Button>
						</div>
					) : (
						<Button
							variant="flat"
							color="default"
							size="lg"
							onPress={() => navigate("/")}
							className="font-semibold"
						>
							Back to Home
						</Button>
					)}
				</div>

				<p className="mt-8 text-sm text-default-400">
					Lost? Try heading back to our{" "}
					<Link
						size="sm"
						onPress={() => navigate("/")}
						className="cursor-pointer"
						color="success"
					>
						home page
					</Link>
					.
				</p>
			</div>
		</div>
	);
};

export default NotFound;

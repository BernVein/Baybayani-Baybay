import { Button, Link, Skeleton, Pagination } from "@heroui/react";
import { useEffect, useState } from "react";

import OrderItem from "./OrderItem";

import { BaybayaniLogo, CartIcon } from "@/components/icons";
import { useFetchOrderCards } from "@/data/supabase/Customer/Orders/useFetchOrderItems";
import { useAuth } from "@/data/supabase/General/AuthContext/AuthProvider";
export default function OrderIndex() {
	const [page, setPage] = useState(1);
	const { user } = useAuth();
	const {
		data: orderItems,
		error,
		totalPages,
		loading,
		initialLoading,
	} = useFetchOrderCards(user?.id, page);

	useEffect(() => {
		document.title = "Baybayani | Orders";
	}, []);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<>
			<div className="w-full sm:w-3/4 mx-auto px-5">
				{/* Header */}
				<div className="flex items-center gap-2 mb-5">
					<BaybayaniLogo className="size-7" />
					<h2 className="text-xl sm:text-3xl font-semibold">
						Baybayani <span className="text-default-400">|</span>{" "}
						Orders
					</h2>
				</div>

				{/* Orders Grid */}
				<div
					className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-200"
					style={{ opacity: loading && !initialLoading ? 0.6 : 1 }}
				>
					{/* Loading Skeleton — only on initial load */}
					{initialLoading
						? [...Array(3)].map((_, i) => (
								<div
									key={`skeleton-${i}`}
									className="relative w-full rounded-lg"
								>
									<div className="inline-flex max-w-full w-full bg-content1 m-0 items-center justify-start rounded-lg p-0 border-2 border-transparent">
										<div className="flex flex-row gap-3 items-stretch p-4 w-full">
											{/* Image skeleton */}
											<Skeleton className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] rounded-sm" />

											{/* Content skeleton */}
											<div className="flex flex-col flex-1 gap-2">
												<Skeleton className="h-4 w-3/4 rounded-md" />
												<Skeleton className="h-3 w-1/2 rounded-md" />
												<Skeleton className="h-3 w-full rounded-md" />
												<Skeleton className="h-3 w-full rounded-md" />
												<Skeleton className="h-3 w-2/3 rounded-md" />
											</div>
										</div>
									</div>
								</div>
							))
						: orderItems
								?.slice()
								.sort(
									(a, b) =>
										new Date(b.date_ordered).getTime() -
										new Date(a.date_ordered).getTime(),
								)
								.map((order) => (
									<OrderItem
										key={order.order_item_user_id}
										orderItem={order}
									/>
								))}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-8">
						<Pagination
							loop
							showControls
							color="success"
							page={page}
							total={totalPages}
							onChange={handlePageChange}
						/>
					</div>
				)}

				{/* No orders message */}
				{!loading && orderItems.length === 0 && !error && (
					<div className="col-span-full flex flex-col items-center justify-center w-full md:w-3/4 md:mx-auto py-16 px-5 text-center">
						<CartIcon className="size-40" />
						<h3 className="text-xl font-semibold mb-2">
							You have no orders yet
						</h3>
						<p className="text-default-500 mb-6">
							Visit the shop to place your first order!
						</p>
						<Link href="/">
							<Button
								color="default"
								startContent={
									<BaybayaniLogo className="size-5" />
								}
							>
								Go to Shop
							</Button>
						</Link>
					</div>
				)}
			</div>
		</>
	);
}

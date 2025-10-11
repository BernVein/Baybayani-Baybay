import ItemCard from "./ItemCard";

export default function ShopItems() {
	const list = [
		{
			title: "Orange",
			img: "https://picsum.photos/300/300",
			price: "$5.50",
			stocks: "232",
			soldBy: "Kilo",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Tangerine",
			img: "https://picsum.photos/300/300",
			price: "$3.00",
			stocks: "2232",
			soldBy: "Piece",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Raspberry",
			img: "https://picsum.photos/300/300",
			stocks: "102",
			soldBy: "Bulk",

			price: "$10.00",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Lemon",
			img: "https://picsum.photos/300/300",
			price: "$5.30",
			stocks: "932",
			soldBy: "Shit",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Orange",
			img: "https://picsum.photos/300/300",
			price: "$5.50",
			stocks: "232",
			soldBy: "Kilo",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Tangerine",
			img: "https://picsum.photos/300/300",
			price: "$3.00",
			stocks: "2232",
			soldBy: "Piece",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Raspberry",
			img: "https://picsum.photos/300/300",
			stocks: "102",
			soldBy: "Bulk",

			price: "$10.00",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Lemon",
			img: "https://picsum.photos/300/300",
			price: "$5.30",
			stocks: "932",
			soldBy: "Shit",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Orange",
			img: "https://picsum.photos/300/300",
			price: "$5.50",
			stocks: "232",
			soldBy: "Kilo",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Tangerine",
			img: "https://picsum.photos/300/300",
			price: "$3.00",
			stocks: "2232",
			soldBy: "Piece",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Raspberry",
			img: "https://picsum.photos/300/300",
			stocks: "102",
			soldBy: "Bulk",

			price: "$10.00",
			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
		{
			title: "Lemon",
			img: "https://picsum.photos/300/300",
			price: "$5.30",
			stocks: "932",
			soldBy: "Shit",

			description:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer arcu leo, dictum nec est ac, ",
		},
	];

	return (
		<div className="gap-5 grid grid-cols-2 sm:grid-cols-4 p-4 mt-2">
			{list.map((item, index) => (
				<ItemCard item={item} index={index} key={index} />
			))}
		</div>
	);
}

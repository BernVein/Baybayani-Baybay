export interface Item {
	category: string;
	title: string;
	img: string;
	priceRetail: number;
	priceWholesale: number;
	wholesaleItem: number;
	stocks: number;
	soldBy: string;
	description: string;
	tag: string | null;
}

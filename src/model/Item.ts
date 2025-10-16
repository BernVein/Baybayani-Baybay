export interface Item {
	category: string;
	title: string;
	img: string[];
	priceRetail: number;
	priceWholesale: number;
	wholesaleItem: number;
	stocks: number;
	lastUpdatedStock?: string;
	soldBy: string;
	description: string;
	tag: string | null;
	previousPriceWholesale?: number;
	lastUpdatedPriceWholesale?: string;
	previousPriceRetail?: number;
	lastUpdatedPriceRetail?: string;
}

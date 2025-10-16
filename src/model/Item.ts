export interface Item {
	category: string;
	title: string;
	img: string[];
	priceRetail: number;
	priceWholesale: number;
	wholesaleItem: number;
	stocks: number;
	lastUpdatedStock?: Date;
	soldBy: string;
	description: string;
	tag: string | null;
	previousPriceWholesale?: number;
	lastUpdatedPriceWholesale?: Date;
	previousPriceRetail?: number;
	lastUpdatedPriceRetail?: Date;
}

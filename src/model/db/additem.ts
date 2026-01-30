export interface VariantDB {
    name?: string; // only if itemHasVariant === true
    stocks?: number;
    dateDelivered?: string;
    supplier?: string;
    totalBuyingPrice?: number;
    lowStockThreshold?: number;
    retailPrice?: number;
    wholesalePrice?: number | null;
    wholesaleMinQty?: number | null;
}

export interface ItemDB {
    name: string;
    categoryId: string;
    shortDescription: string | null;
    unitOfMeasure: string;
    tagId: string | null;
    variants: VariantDB[]; // array of variants (even if itemHasVariant === false, it can be one-item array)
}

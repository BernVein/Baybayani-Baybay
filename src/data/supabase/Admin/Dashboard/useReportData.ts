import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/config/supabaseclient";

export interface ReportData {
	stock_adjustment_type: string;
	stock_delivery_date?: string;
	stock_change_date: string;
	stock_supplier?: string;
	stock_loss_reason?: string;
	item_name: string;
	variant_name: string;
	quantity: number;
	price: number;
	total_price: number;
	effective_stocks: number;
}

export function useReportData(
	dateRange: { start: string; end: string } | null,
) {
	const [reportData, setReportData] = useState<ReportData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	const fetchReportData = useCallback(async (): Promise<
		ReportData[] | null
	> => {
		if (!dateRange) return null;
		setLoading(true);
		setError(null);

		try {
			const { start, end } = dateRange;

			// Fetch stock movements with joined Variant and Item
			const { data, error: fetchError } = await supabase
				.from("StockMovement")
				.select(
					`
					stock_adjustment_type,
					stock_delivery_date,
					stock_change_date,
					stock_supplier,
					stock_loss_reason,
					stock_change_count,
					stock_adjustment_amount,
					sale_amount,
					effective_stocks,
					is_soft_deleted,
					Variant(
						variant_name,
						Item(item_title)
					)
				`,
				)
				.gte("stock_change_date", start)
				.lte("stock_change_date", end)
				.in("stock_adjustment_type", ["Acquisition", "Loss", "Sale"])
				.eq("is_soft_deleted", false)
				.order("stock_change_date", { ascending: false });

			if (fetchError) throw fetchError;

			const formattedData: ReportData[] = (data || []).map(
				(item: any) => {
					const type = item.stock_adjustment_type;
					const price =
						type === "Sale"
							? item.sale_amount || 0
							: item.stock_adjustment_amount || 0;

					return {
						stock_adjustment_type: type,
						stock_delivery_date: item.stock_delivery_date,
						stock_change_date: item.stock_change_date,
						stock_supplier: item.stock_supplier,
						stock_loss_reason: item.stock_loss_reason,
						item_name:
							item.Variant?.Item?.item_title || "Unknown Item",
						variant_name:
							item.Variant?.variant_name || "Unknown Variant",
						quantity: item.stock_change_count || 0,
						price: price,
						total_price: price,
						effective_stocks: item.effective_stocks || 0,
					};
				},
			);

			setReportData(formattedData);
			return formattedData;
		} catch (err) {
			console.error("Error fetching report data:", err);
			setError(err);
			return null;
		} finally {
			setLoading(false);
		}
	}, [dateRange]);

	useEffect(() => {
		fetchReportData();
	}, [fetchReportData]);

	return { reportData, loading, error, refetch: fetchReportData };
}

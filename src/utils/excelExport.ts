import * as XLSX from "xlsx-js-style";
import { ReportData } from "@/data/supabase/Admin/Dashboard/useReportData";
import { format } from "date-fns";

export function exportReportToExcel(
	data: ReportData[],
	dateRange: { start: string; end: string },
) {
	const title = "Baybayani Inventory Movement Report";

	const worksheetData = [
		[title],
		[
			`Reporting Period: ${format(
				new Date(dateRange.start),
				"MMMM dd, yyyy",
			)} - ${format(new Date(dateRange.end), "MMMM dd, yyyy")}`,
		],
		[],
		[
			"Date",
			"Stock Count",
			"Type",
			"Supplier / Loss Reason",
			"Item Name",
			"Price Impact",
		],
	];

	const sortedData = [...data].sort(
		(a, b) =>
			new Date(a.stock_change_date).getTime() -
			new Date(b.stock_change_date).getTime(),
	);

	const seenVariants = new Set<string>();

	const rows = sortedData.map((item) => {
		const type = item.stock_adjustment_type;
		const isLoss = type === "Loss";
		const isAcquisition = type === "Acquisition";

		let reason = "N/A";

		if (isAcquisition) reason = item.stock_supplier || "N/A";
		else if (isLoss) reason = item.stock_loss_reason || "N/A";
		else if (type === "Sale") reason = "Customer Sale";

		const netPriceImpact = isLoss ? -item.total_price : item.total_price;

		const variantId = `${item.item_name}-${item.variant_name}`;

		let displayCount: number;

		if (!seenVariants.has(variantId)) {
			displayCount = item.effective_stocks;
			seenVariants.add(variantId);
		} else {
			displayCount = item.quantity;
		}

		const productName =
			item.variant_name === "Default" || item.variant_name === "Normal"
				? item.item_name
				: `${item.item_name} (${item.variant_name})`;

		const stockWithUnit = `${displayCount} ${item.item_unit}`.trim();

		return [
			isAcquisition && item.stock_delivery_date
				? format(new Date(item.stock_delivery_date), "yyyy-MM-dd HH:mm:ss")
				: format(new Date(item.stock_change_date), "yyyy-MM-dd HH:mm:ss"),
			stockWithUnit,
			type,
			reason,
			productName,
			netPriceImpact,
		];
	});

	const ws = XLSX.utils.aoa_to_sheet([...worksheetData, ...rows]);

	// =========================
	// MERGES
	// =========================

	ws["!merges"] = [
		{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
		{ s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
	];

	// =========================
	// COLUMN WIDTHS
	// =========================

	ws["!cols"] = [
		{ wch: 16 },
		{ wch: 14 },
		{ wch: 16 },
		{ wch: 32 },
		{ wch: 45 },
		{ wch: 20 },
	];

	// =========================
	// FREEZE HEADER
	// =========================

	ws["!freeze"] = { xSplit: 0, ySplit: 4 };

	ws["!autofilter"] = {
		ref: `A4:F${rows.length + 4}`,
	};

	// =========================
	// TITLE STYLE
	// =========================

	ws["A1"].s = {
		font: {
			sz: 26,
			bold: true,
			color: { rgb: "1B5E20" },
		},
		alignment: {
			horizontal: "center",
			vertical: "center",
		},
	};

	ws["A2"].s = {
		font: {
			italic: true,
			sz: 12,
			color: { rgb: "4E944F" },
		},
		alignment: {
			horizontal: "center",
		},
	};

	// =========================
	// HEADER STYLE
	// =========================

	const headerRow = 4;
	const headers = ["A", "B", "C", "D", "E", "F"];

	headers.forEach((col) => {
		const cell = ws[`${col}${headerRow}`];
		if (!cell) return;

		cell.s = {
			font: {
				bold: true,
				color: { rgb: "FFFFFF" },
				sz: 12,
			},
			fill: {
				fgColor: { rgb: "2E7D32" },
			},
			alignment: {
				horizontal: "center",
				vertical: "center",
				wrapText: true,
			},
			border: {
				top: { style: "medium", color: { rgb: "1B5E20" } },
				bottom: { style: "medium", color: { rgb: "1B5E20" } },
				left: { style: "thin", color: { rgb: "C8E6C9" } },
				right: { style: "thin", color: { rgb: "C8E6C9" } },
			},
		};
	});

	// =========================
	// DATA STYLING
	// =========================

	const startRow = 5;

	rows.forEach((_, i) => {
		const r = startRow + i;
		const type = sortedData[i].stock_adjustment_type;

		const zebra = i % 2 === 0 ? "FFFFFF" : "F9FBF9";

		let fontColor = "000000";

		if (type === "Loss") fontColor = "C62828";
		if (type === "Sale") fontColor = "2E7D32";

		headers.forEach((col) => {
			const cell = ws[`${col}${r}`];
			if (!cell) return;

			cell.s = {
				font: {
					color: { rgb: fontColor },
				},
				fill: {
					fgColor: { rgb: zebra },
				},
				border: {
					top: { style: "thin", color: { rgb: "E0E0E0" } },
					bottom: { style: "thin", color: { rgb: "E0E0E0" } },
					left: { style: "thin", color: { rgb: "E0E0E0" } },
					right: { style: "thin", color: { rgb: "E0E0E0" } },
				},
				alignment: {
					vertical: "center",
					horizontal:
						col === "B" || col === "C"
							? "center"
							: col === "F"
								? "right"
								: "left",
				},
			};

			if (col === "F") {
				cell.z = '"₱"#,##0.00_);[Red]("₱"#,##0.00)';
			}
		});
	});

	// =========================
	// TOTAL ROW
	// =========================

	const totalRow = startRow + rows.length + 1;
	const lastDataRow = startRow + rows.length - 1;

	ws[`E${totalRow}`] = {
		v: "TOTAL REPORT VALUE:",
		t: "s",
		s: {
			font: { bold: true, sz: 12 },
			alignment: { horizontal: "right" },
		},
	};

	ws[`F${totalRow}`] = {
		f: `SUM(F${startRow}:F${lastDataRow})`,
		t: "n",
		s: {
			font: {
				bold: true,
				sz: 13,
				color: { rgb: "1B5E20" },
			},
			fill: {
				fgColor: { rgb: "E8F5E9" },
			},
			border: {
				top: { style: "medium", color: { rgb: "2E7D32" } },
				bottom: { style: "medium", color: { rgb: "2E7D32" } },
			},
			alignment: { horizontal: "right" },
		},
		z: '"₱"#,##0.00_);[Red]("₱"#,##0.00)',
	};

	// =========================
	// EXPORT
	// =========================

	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");

	const filename = `Baybayani Report ${format(
		new Date(dateRange.start),
		"MMMM d",
	)} - ${format(new Date(dateRange.end), "MMMM d")}.xlsx`;

	XLSX.writeFile(wb, filename);
}

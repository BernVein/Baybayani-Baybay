const networkPrefixes = {
	Globe: [
		"0905",
		"0906",
		"0915",
		"0916",
		"0917",
		"0926",
		"0927",
		"0935",
		"0936",
		"0937",
		"0953",
		"0954",
		"0955",
		"0956",
		"0965",
		"0966",
		"0967",
		"0975",
		"0976",
		"0977",
	],
	Smart: [
		"0908",
		"0909",
		"0910",
		"0911",
		"0912",
		"0913",
		"0914",
		"0918",
		"0919",
		"0920",
		"0921",
		"0928",
		"0929",
		"0930",
		"0938",
		"0939",
		"0946",
		"0947",
		"0948",
		"0949",
		"0950",
		"0951",
		"0961",
		"0963",
		"0968",
		"0969",
		"0970",
		"0981",
		"0989",
		"0998",
		"0999",
	],
	DITO: ["0895", "0896", "0897", "0898", "0991", "0992", "0993", "0994"],
};

export const detectNetwork = (phone: string) => {
	const digits = phone.replace(/\D/g, "");
	const prefix = digits.slice(0, 4);

	for (const [network, prefixes] of Object.entries(networkPrefixes)) {
		if (prefixes.includes(prefix)) return network;
	}

	return "Unknown";
};

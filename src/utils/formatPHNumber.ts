export const formatPHNumber = (phone: string) => {
	if (!phone) return "";

	let digits = phone.replace(/\D/g, "");

	if (digits.startsWith("639") && digits.length === 12) {
		digits = "0" + digits.slice(2);
	}

	if (digits.startsWith("9") && digits.length === 10) {
		digits = "0" + digits;
	}

	if (!digits.startsWith("09") || digits.length !== 11) {
		return phone;
	}

	return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
};

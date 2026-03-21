/**
 * Validates if a File object is a valid, readable image.
 * Checks the mime type and attempts to load it into an Image object.
 */
export const validateImage = (file: File): Promise<boolean> => {
	return new Promise((resolve) => {
		// Basic check for mime type
		if (!file.type.startsWith("image/")) {
			resolve(false);
			return;
		}

		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(true);
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(false);
		};

		img.src = objectUrl;
	});
};

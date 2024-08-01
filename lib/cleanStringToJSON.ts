export const cleanupStringToJSON = (
	input: string,
	outputType: string
): string => {
	if (outputType === "array") {
		let cleanedString = input.trim();

		// Remove any potential Unicode BOM (Byte Order Mark)
		cleanedString = cleanedString.replace(/^\uFEFF/, "");

		// Remove any potential line breaks or extra spaces within the JSON
		cleanedString = cleanedString.replace(/\s+/g, " ");

		// Remove backslashes
		cleanedString = cleanedString.replace(/\\/g, "");

		// remove backticks
		cleanedString = cleanedString.replace(/`/g, "");

		// Remove JSON text
		cleanedString = cleanedString.replace(/json/gi, "");
		console.log("Array type", cleanedString);
		return cleanedString;
	} else {
		// If not array
		// Find the start of the JSON object
		const jsonStart = input.indexOf("{");
		if (jsonStart === -1) {
			throw new Error("No JSON object found in the input string");
		}

		// Extract everything from the start of the JSON object to the end
		let cleanedString = input.substring(jsonStart);
		// Remove backslashes
		cleanedString = cleanedString.replace(/\\/g, "");

		// Remove backticks
		cleanedString = cleanedString.replace(/`/g, "");

		// Remove "json" string
		cleanedString = cleanedString.replace(/json/gi, "");
		console.log("Cleaned string object", cleanedString);
		return cleanedString;
	}
};

export const cleanupStringToJSON = (input: string): string => {
	// Remove backslashes
	let cleanedString = input.replace(/\\/g, "");

	// Remove backticks
	cleanedString = cleanedString.replace(/`/g, "");

	// Remove "json" string
	cleanedString = cleanedString.replace(/json/gi, "");

	return cleanedString;
};

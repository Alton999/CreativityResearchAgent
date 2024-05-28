const wordwareAPI = process.env.WORDWARE_API_KEY;

import { cleanupStringToJSON } from "@/lib/cleanupStringToJSON";
type WordwareType = {
	wordwarePromptId: string;
	question: string;
	field: string;
};

type SearchTermsArray = {
	searchTerm: string;
	explanation: string;
};

export const wordware = async ({
	question,
	field,
	wordwarePromptId
}: WordwareType): Promise<SearchTermsArray[]> => {
	try {
		console.log("Trying wordware", question, field);
		const data = await fetch(
			`https://app.wordware.ai/api/prompt/${wordwarePromptId}/run`,
			{
				method: "post",
				body: JSON.stringify({
					inputs: {
						research_question: question,
						fields: field
					}
				}),
				headers: {
					Authorization: `Bearer ${wordwareAPI}`
				}
			}
		);
		const responseData = await data.text();

		const chunks = responseData.split("\n").filter(Boolean); // Split by newline and remove empty lines

		// let summary = "";
		// let recording = false;
		const summary = chunks
			.map((response) => {
				if (!response) throw new Error("Response is null");
				let responseJson = JSON.parse(response);
				// Response type
				// if (responseJson.value?.type !== "chunk") {
				// 	console.log("Response type", responseJson?.value);
				// }
				// Check if response is of type generation and label is script. Don't want classification.
				if (responseJson.value.type === "outputs") {
					console.log("Response", responseJson.value.values.final);
					return responseJson.value.values.final;
				} else {
					return "";
				}
			})
			.join("");

		// Should return an array of SearchTerm objects
		// Clean up string before going to parse
		const cleanedString = cleanupStringToJSON(summary);
		const searchTermJson = JSON.parse(cleanedString);
		console.log("Summary JSON:", searchTermJson);
		return searchTermJson;
	} catch (error) {
		console.log("Error fetching wordware", error);
		throw error;
	}
};

// const wordwarePromptId = "816acaae-3f3c-473e-b957-125ff26f7c6d";
const wordwareAPI = process.env.WORDWARE_API_KEY;

type WordwareType = {
	wordwarePromptId: string;
	question: string;
	field: string;
};

export const wordware = async ({
	question,
	field,
	wordwarePromptId
}: WordwareType): Promise<string> => {
	try {
		console.log("Trying wordware", question, field);
		const data = await fetch(
			`https://app.wordware.ai/api/prompt/${wordwarePromptId}/run`,
			{
				method: "post",
				body: JSON.stringify({
					inputs: {
						research_question: question,
						field: field
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

		console.log("Summary", summary);
		// console.log("End fetching");
		return summary;
	} catch (error) {
		console.log("Error fetching wordware", error);
		throw error;
	}
};

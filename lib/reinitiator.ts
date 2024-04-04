// const wordwarePromptId = "816acaae-3f3c-473e-b957-125ff26f7c6d";
const wordwareAPI = process.env.WORDWARE_API_KEY;

type SearchSummmaryWordwareType = {
	evaluation: string;
	wordwarePromptId: string;
	researchQuestion: string;
};

export const reinitiator = async ({
	wordwarePromptId,
	evaluation,
	researchQuestion
}: SearchSummmaryWordwareType): Promise<string> => {
	try {
		console.log(
			"Wordware: generating reinitiation with this evaluation",
			evaluation
		);
		const data = await fetch(
			`https://app.wordware.ai/api/prompt/${wordwarePromptId}/run`,
			{
				method: "post",
				body: JSON.stringify({
					inputs: {
						evaluation: evaluation,
						research_question: researchQuestion
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
				console.log("Response from search summary", responseJson);
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

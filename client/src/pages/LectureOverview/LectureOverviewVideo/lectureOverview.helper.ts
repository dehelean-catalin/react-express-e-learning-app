import { Content, ContentData } from "../../../data/models/creatorModel";

export const getChapterVideoWithProgress = (
	data: Content[],
	chapterId: string
): ContentData | undefined => {
	let content;
	for (const i in data) {
		for (const j in data[i].children) {
			if (data[i].children[j].data.id === chapterId)
				content = data[i].children[j].data;
		}
	}

	return content;
};

export type DashboardLecture = {
	id: string;
	lastUpdate: number;
	publish: Publish;
	rating: number;
	enrolledUsers: string[];
	numberOfRatings: number;
};

export type CreatedLectureModel = DashboardLecture & {
	content: Content[];
	goals: string[];
	requirements: string[];
	duration: number;
};

export type Publish = {
	author: string;
	authorId: string;
	title: string;
	category: Category;
	description: string;
	language: string;
	status: Status;
	level: Level;
	caption: string;
	promoVideo: string;
};

export type Content = {
	label: string;
	data: string;
	children: {
		label: string;
		data: {
			id: string;
			description: string;
			date: string;
			duration: number;
			content: string;
			track: string;
			type: string;
			status: VideoStatus;
		};
	}[];
};

export type LectureTemplateData = {
	title: string;
	category: Category;
	language: string;
	author: string;
};

export type Language = "English" | "French" | "Romanian";
export type VideoStatus = "Success" | "Failed";
export type Status = "Draft" | "Public" | "Private" | "Unlisted";
export type Level = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export enum Category {
	ALL = "All",
	Design = "Design",
	DataScience = "Data science",
	Web = "Web development",
	Architecture = "Architecture",
	Electronics = "Electronics",
	Psychology = "Psychology",
	History = "History",
	Policy = "Policy",
	None = "",
}

export type Review = {
	profilePicture: string;
	author: string;
	date: string;
	message: string;
	rating: number;
};

export type ReviewData = Omit<Review, "date">;

export type UserModel = {
	email: string;
	displayName: string;
	phoneNumber: string;
	address: string;
	aboutYou: string;
	profilePicture: string;
	connections: ConnectionItem[];
	savedLectures: string[];
	history: string[];
};

export type AccountData = {
	email: string;
	displayName: string;
	profilePicture: string;
	phoneNumber: string;
	address: string;
	aboutYou: string;
};

export type ConnectionItem = {
	device: string;
	location: string;
	date: string;
};

export type HistoryModel = {
	id: string;
	videoProgress: VideoProgress;
};

export type VideoProgress = {
	lastChapter: string;
	lastDate: string;
	lastName: string;
	items: VideoProgressItem[];
};

export type VideoProgressItem = { id: string; current: number; total: number };

export type CreateAccount = {
	displayName: string;
	email: string;
	device: string;
	location: string;
};

export interface ProviderAccount extends CreateAccount {
	photoURL: string;
}

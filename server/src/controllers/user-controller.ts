import { NextFunction, Request, Response } from "express";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../config/firebase";
import { LectureModel } from "../models/lecture-model";
import { ValidatedRequest } from "../models/request";
import { UserModel, WatchingLectureModel } from "../models/user-model";
import { tryAgainError } from "./../constant";

export const getUserByID = async (req: Request, res: Response) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const userRef = doc(db, "users", validatedReq.userData.userId);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) {
			throw new Error("This user don't exist");
		}
		const userData = userSnap.data() as UserModel;
		res.status(200).json(userData);
	} catch (err: any) {
		res.status(400).json({ code: 400, message: err.message });
	}
};

export const saveLecture = async (req: Request, res: Response) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const docRef = doc(db, "users", validatedReq.userData.userId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			throw new Error(tryAgainError);
		}
		const { savedLectures } = docSnap.data();
		if (savedLectures?.includes(req.params.id)) {
			throw new Error("Lecture is already saved");
		}

		savedLectures.push(req.params.id);

		await updateDoc(docRef, {
			savedLectures,
		});

		res.status(200).json({ code: 200, message: "Succesfully saved" });
	} catch (err: any) {
		return res.status(400).json({ code: 400, message: err.message });
	}
};

export const deleteSavedLecture = async (req: Request, res: Response) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const docRef = doc(db, "users", validatedReq.userData.userId);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			throw new Error("Try again! Something went wrong");
		}

		let { savedLectures } = docSnap.data();
		savedLectures = savedLectures.filter(
			(lectureId: string) => lectureId !== req.params.id
		);
		await updateDoc(docRef, { savedLectures });
		res.status(200).json(savedLectures);
	} catch (err: any) {
		return res.status(400).json({ code: 400, message: err.message });
	}
};

export const updatetWatchingLectureCurrenTime = async (
	req: Request,
	res: Response
) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const userRef = doc(db, "users", validatedReq.userData.userId);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) {
			throw new Error("This Lecture dont exist");
		}
		const watchingLectures = userSnap.get(
			"watchingLectures"
		) as WatchingLectureModel[];

		watchingLectures.forEach((i) => {
			if (i.id === req.params.id) {
				i.items.forEach((p) => {
					p.children?.forEach((c) => {
						if (c.data && c.key === req.query.page) {
							if (req.body.time > c.data.duration) {
								req.body.time = c.data.duration;
							}
							if (req.body.time > c.data.confirmedProgress) {
								c.data.confirmedProgress = req.body.time;
								c.data.currentProgress = c.data.confirmedProgress;
							} else {
								c.data.currentProgress = req.body.time;
							}
						}
					});
				});
			}
		});

		await updateDoc(userRef, { watchingLectures });

		res.status(200).json(watchingLectures);
	} catch (err: any) {
		res.status(400).json({ code: 400, message: err.message });
	}
};

export const updateWatchingLectureLastEntry = async (
	req: Request,
	res: Response
) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const userRef = doc(db, "users", validatedReq.userData.userId);
		const userSnap = await getDoc(userRef);
		if (!userSnap.exists()) {
			throw new Error("This Lecture dont exist");
		}
		const watchingLectures = userSnap.get(
			"watchingLectures"
		) as WatchingLectureModel[];

		watchingLectures.forEach((i) => {
			if (i.id === req.params.id) {
				i.lastEntry = req.body;
			}
		});

		await updateDoc(userRef, { watchingLectures });

		res.status(200).json({ code: 200, message: "Success" });
	} catch (err: any) {
		res.status(400).json({ code: 400, message: err.message });
	}
};

export const getHistoryLectureList = async (req: Request, res: Response) => {
	const validatedReq = req as ValidatedRequest;
	const userRef = doc(db, "users", validatedReq.userData.userId);

	try {
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			throw new Error("Try again! Something went wrong");
		}

		let { watchingLectures } = userSnap.data() as UserModel;
		let loadedIds: string[] = [];
		watchingLectures.map((i: WatchingLectureModel) => loadedIds.push(i.id));

		let loadedLectures: any[] = [];

		for (const key in loadedIds) {
			const lectureRef = doc(db, "lectures", loadedIds[key]);
			const lectureSnap = await getDoc(lectureRef);
			if (!lectureSnap.exists()) {
				throw new Error("Try again! Something went wrongggg");
			}
			const { id, thumbnail, createdBy, title, reviews } =
				lectureSnap.data() as LectureModel;
			let page = "0";
			let date = "";
			let confirmedProgress = 0;
			let duration = 0;
			let chapterName = "";
			watchingLectures.forEach((i) => {
				if (loadedIds[key] === i.id) {
					page = i.lastEntry.page;
					date = `${i.lastEntry.date} ${i.lastEntry.time}`;

					i.items.forEach((o) =>
						o.children.forEach((s) => {
							confirmedProgress += s.data.confirmedProgress;
							duration += s.data.duration;
							if (s.key === i.lastEntry.page) {
								chapterName = s.label;
							}
						})
					);
				}
			});
			const progress = Math.round((confirmedProgress * 100) / duration);
			const rating =
				reviews.data.reduce((a, b) => a + b.rating, 0) / reviews.data.length;
			loadedLectures.push({
				id,
				thumbnail,
				createdBy,
				title,
				reviews: reviews,
				numberOfRates: reviews.data.length,
				progress,
				page,
				date,
				chapterName,
			});
		}

		loadedLectures.sort(function (a, b): number {
			const t1 = new Date(a.date);
			const t2 = new Date(b.date);
			return t2.getTime() - t1.getTime();
		});

		res.status(200).json(loadedLectures);
	} catch (err: any) {
		return res.status(400).json({ code: 400, message: err.message });
	}
};

export const getLastChapter = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const validatedReq = req as ValidatedRequest;
	const { id } = req.params;
	const { userId } = validatedReq.userData;

	try {
		const lectureRef = doc(db, `lectures/${id}/enrolledUsers`, userId);

		const lectureSnap = await getDoc(lectureRef);
		if (!lectureSnap.exists()) throw new Error("Something went wrong");

		res.status(200).json(lectureSnap.get("lastChapter"));
	} catch (err: any) {
		next(err);
	}
};

export const getWatchingLectureList = async (req: Request, res: Response) => {
	try {
		const validatedReq = req as ValidatedRequest;
		const userRef = doc(db, "users", validatedReq.userData.userId);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists()) {
			throw new Error("Try again! Something went wrong");
		}

		let { watchingLectures } = userSnap.data() as UserModel;
		let loadedIds: string[] = [];

		watchingLectures.map((i: WatchingLectureModel) => loadedIds.push(i.id));
		let loadedLectures: any[] = [];
		for (const key in loadedIds) {
			const lectureRef = doc(db, "lectures", loadedIds[key]);
			const lectureSnap = await getDoc(lectureRef);
			if (!lectureSnap.exists()) {
				throw new Error("Try again! Something went wrong");
			}
			const { thumbnail, createdBy, title, reviews, items } =
				lectureSnap.data() as LectureModel;
			loadedLectures.push({
				thumbnail,
				createdBy,
				title,
				reviews,
				items,
			});
		}
		res.status(200).json(loadedLectures);
	} catch (err: any) {
		return res.status(400).json({ code: 400, message: err.message });
	}
};

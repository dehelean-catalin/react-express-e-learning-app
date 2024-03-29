import { Reducer } from "redux";
import { ActionType, createAction, getType } from "typesafe-actions";
import { VideoProgressItem } from "../models/usersModel";

const actions = {
	setProgress: createAction(
		"getProgress",
		(payload: VideoProgressItem[]) => payload
	)(),
};

export type ProgressAction = ActionType<typeof actions>;
export const ProgressActions = actions;

const INITIAL_STATE: { data: VideoProgressItem[] } = {
	data: [],
};

const progressReducer: Reducer<
	{ data: VideoProgressItem[] },
	ProgressAction
> = (
	state: { data: VideoProgressItem[] } = INITIAL_STATE,
	action: ProgressAction
) => {
	switch (action.type) {
		case getType(ProgressActions.setProgress):
			return {
				...state,
				data: action.payload,
			};
		default:
			return state;
	}
};
export default progressReducer;

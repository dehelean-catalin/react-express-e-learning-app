import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useAxios } from "../../../data/hooks/useAxios";
import { AccountDataState } from "../../../data/redux/accountReducer";
import { RootState } from "../../../data/redux/store";
import { postLectureReview } from "../../../data/services/lectureService";
import PRButton from "../../PRButton/PRButton";
import PRDialog from "../../PRDialog/PRDialog";
import "./LeaveRatingDialog.scss";

const LeaveRatingDialog = ({ visible, onHide }) => {
	const axios = useAxios();
	const { id } = useParams();
	const [rating, setRating] = useState(null);
	const [message, setMessage] = useState("");
	const queryClient = useQueryClient();

	const { displayName, profilePicture } = useSelector<
		RootState,
		AccountDataState
	>((s) => s.accountReducer.data);

	const { mutate: handleReview, isLoading } = useMutation(
		"postLectureReview",
		() =>
			postLectureReview(axios, id, {
				author: displayName,
				profilePicture,
				message,
				rating,
			}),
		{
			onSuccess: () => {
				setRating(null);
				setMessage("");
				queryClient.invalidateQueries("getLectureReview").then(() => onHide());
			},
		}
	);

	return (
		<PRDialog visible={visible} onHide={onHide} header={<h3>Feedback</h3>}>
			<div className="leave-rating">
				<p>How was your experience with this lecture?</p>
				<Rating
					className="rating-stars"
					value={rating}
					onChange={(e) => setRating(e.value)}
					offIcon={<i className="pi pi-star text-4xl" />}
					onIcon={<i className="pi pi-star-fill text-4xl text-orange-300" />}
					cancel={false}
				/>

				<InputTextarea
					value={message}
					onChange={({ target }) => setMessage(target.value)}
					placeholder="Add a comment"
					style={{ resize: "none" }}
				/>

				<PRButton
					label="Rate now"
					onClick={() => handleReview()}
					loading={isLoading}
					disabled={!rating}
				/>
			</div>
		</PRDialog>
	);
};

export default LeaveRatingDialog;

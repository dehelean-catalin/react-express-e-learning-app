import { Button } from "primereact/button";
import { FC, useState } from "react";
import "./NewSectionForm.scss";

type Props = {
	onSubmit: any;
	toggleVisibility: (b: boolean) => void;
	index?: number;
};

const NewSectionForm: FC<Props> = ({ onSubmit, toggleVisibility, index }) => {
	const [inputValues, setInputValues] = useState({
		title: "",
		description: "",
	});

	return (
		<div
			className="new-section-form"
			onKeyDown={(e) => {
				if (e.code === "Enter") {
					onSubmit(inputValues.title, inputValues.description);
					toggleVisibility(false);
				}
			}}
		>
			<h3>{index ? `Edit section ${index + 1}` : "New section:"}</h3>
			<fieldset>
				<label htmlFor="title">Section title</label>

				<input
					name="title"
					value={inputValues.title}
					placeholder="Enter the title"
					onChange={(e) =>
						setInputValues({ ...inputValues, title: e.target.value })
					}
					autoFocus
				/>
				<label htmlFor="description">
					What will students be able to do at the end of this section?
				</label>

				<input
					name="description"
					className=""
					value={inputValues.description}
					placeholder="Enter the description"
					onChange={(e) =>
						setInputValues({
							...inputValues,
							description: e.target.value,
						})
					}
				/>

				<div className="flex justify-content-end gap-2 mt-2">
					<Button
						type="button"
						label="Cancel"
						className="cancel"
						onClick={() => toggleVisibility(false)}
					/>
					<Button
						type="button"
						label="Save"
						onClick={() => {
							onSubmit(inputValues.title, inputValues.description);
							toggleVisibility(false);
						}}
						disabled={!inputValues.title.trim().length}
					/>
				</div>
			</fieldset>
		</div>
	);
};

export default NewSectionForm;

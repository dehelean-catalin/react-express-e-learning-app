import { Tree, TreeExpandedKeysType } from "primereact/tree";
import TreeNode from "primereact/treenode";
import { FC, useCallback } from "react";
import { BsPlayCircle } from "react-icons/bs";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useAxios } from "../../resources/axiosInstance";
import styles from "./LectureOverview.module.scss";

type Props = {
	data: TreeNode[];
	page: string;
};
const LectureOverviewTree: FC<Props> = ({ data, page }) => {
	const navigate = useNavigate();
	const { id } = useParams();
	const axiosInstance = useAxios();

	const getExpendedKey: () => TreeExpandedKeysType = useCallback(() => {
		let currentKey: TreeExpandedKeysType = null;
		data.forEach((i) =>
			i.children.forEach((o) => {
				if (o.key === page) {
					currentKey = { [i.key]: true };
				}
			})
		);
		return currentKey;
	}, [data, page]);

	const expandedKey = getExpendedKey();

	const nodeTemplate = (node: TreeNode, options) => {
		let label = <b>{node.label}</b>;

		return (
			<div className={options.className}>
				<div style={node.data && node.key === page ? { color: "#16b87f" } : {}}>
					{node.data &&
					node.data.confirmedProgress >= node.data.duration - 8 ? (
						<MdCheckBox />
					) : (
						<MdCheckBoxOutlineBlank />
					)}
					{label}
				</div>

				<div style={node.data && node.key === page ? { color: "#16b87f" } : {}}>
					<BsPlayCircle />
					{getDuration(node)}
				</div>
			</div>
		);
	};
	const d = new Date();
	return (
		<div className={styles.content}>
			<span>Lecture content</span>
			{!!expandedKey && (
				<Tree
					value={data}
					nodeTemplate={nodeTemplate}
					className={styles["course-list"]}
					onNodeClick={(e) => {
						if (!e.node.children && page !== e.node.key) {
							navigate(`/lecture/${id}/overview?page=${e.node.key}`);
							axiosInstance.put(`/user/watching-lectures/${id}/last-entry`, {
								date: new Date().toISOString().split("T")[0],
								page: e.node.key,
								time: d.toTimeString().split(" ")[0],
							});
						}
					}}
					expandedKeys={expandedKey}
				/>
			)}
		</div>
	);
};

export default LectureOverviewTree;

export const getDuration = (node) => {
	if (node?.children) {
		const valueInMin = Math.ceil(
			node.children.reduce((a, b) => Math.round(a) + b.data.duration, 0) / 60
		);

		if (valueInMin >= 60) {
			return valueInMin / 60 + " h";
		}
		return valueInMin + " min";
	}
	const value = Math.round(node.data.duration / 60);
	if (value >= 60) {
		return value / 60 + " h";
	}
	return value + " min";
};

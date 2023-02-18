import { GithubAuthProvider, linkWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAxios } from "../../config/axiosInstance";
import { auth } from "../../config/firebaseConfig";
import ChangePasswordPage from "./ChangePassword/ChangePassword";
import { ConnectionItem } from "./ConnectionCard/ConnectionCard";
import ConnectionSection from "./ConnectionsSection/ConnectionsSection";
import styles from "./SecurityPage.module.scss";
const SecurityPage = () => {
	const axiosInstance = useAxios();
	const [connectionsList, setConnectionsList] = useState<ConnectionItem[]>([]);
	useEffect(() => {
		axiosInstance.get("/connections-list").then((res) => {
			setConnectionsList(res.data);
		});
	}, []);
	const handleLinkUp = async () => {
		const provider = new GithubAuthProvider();
		provider.addScope("email");
		linkWithPopup(auth.currentUser, provider);
	};

	return (
		<div className={styles["security-page"]}>
			<div className={styles.title}>Activity log</div>
			<ConnectionSection value={connectionsList} />
			<ChangePasswordPage />
			<button onClick={handleLinkUp}>salut</button>
		</div>
	);
};

export default SecurityPage;

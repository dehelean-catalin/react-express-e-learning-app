import { classNames } from "primereact/utils";
import { useEffect } from "react";
import { IoMdInformationCircle } from "react-icons/io";
import { RiErrorWarningFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
	BannerNotificationState,
	NotificationActions,
} from "../../data/redux/notificationReducer";
import { RootState } from "../../data/redux/store";
import styles from "./Notification.module.scss";

const Notification = () => {
	const dispatch = useDispatch();
	const bannerNotification = useSelector<RootState, BannerNotificationState>(
		(s) => s.notificationReducer.bannerNotification
	);
	const clearNotification = () =>
		dispatch(NotificationActions.clearBannerMessage());

	useEffect(() => {
		let clearNotificationTimeout: any;
		if (
			bannerNotification != null &&
			typeof bannerNotification !== "undefined"
		) {
			clearNotificationTimeout = bannerNotification?.timeout
				? setTimeout(() => clearNotification(), bannerNotification?.timeout)
				: null;
		}

		return function () {
			clearNotificationTimeout ? clearTimeout(clearNotificationTimeout) : <></>;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bannerNotification]);

	return (
		<div
			className={classNames(
				styles.notification,
				styles[`${bannerNotification?.type}`]
			)}
		>
			<span>
				{bannerNotification?.type === "info" && (
					<IoMdInformationCircle fontSize="22px" />
				)}
				{bannerNotification?.type === "warning" && (
					<RiErrorWarningFill fontSize="22px" />
				)}
				{bannerNotification?.message}
			</span>
			{typeof bannerNotification?.action !== "undefined" && (
				<NavLink to={bannerNotification.action} className={styles.link}>
					Go to
				</NavLink>
			)}
		</div>
	);
};

export default Notification;

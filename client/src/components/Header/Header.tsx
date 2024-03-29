import { FC } from "react";
import { useLocation } from "react-router";
import CreateHeader from "../../pages/Creator/Create/CreateHeader/CreateHeader";
import { InputTextSearch } from "../Inputs/InputTextSearch/InputTextSearch";
import "./Header.scss";
import HeaderButtons from "./HeaderButtons/HeaderButtons";
import HeaderLogo from "./HeaderLogo/HeaderLogo";

const Header: FC = () => {
	const { pathname } = useLocation();

	if (pathname === "/create") return <CreateHeader />;

	if (pathname.includes("/creator/created-lectures/")) return;

	return (
		<header className={"app-header"}>
			<HeaderLogo />
			<InputTextSearch />
			<HeaderButtons />
		</header>
	);
};

export default Header;

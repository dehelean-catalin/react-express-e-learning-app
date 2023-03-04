import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import InputPasswordField from "../../common/InputPasswordField/InputPasswordField";
import InputTextField from "../../common/InputTextField/InputTextField";
import AuthForm from "../../components/AuthForm/AuthForm";
import {
	formatEmailError,
	formatPasswordError,
} from "../../helper/loginHelper";
import { useAuthentication } from "../../hooks/useAuthentication";
import styles from "./Login.module.scss";

const Login = () => {
	const { isLoading, handleLogin, error, setError } = useAuthentication();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [emailTouched, setEmailTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);

	const hasValue = !!email && !!password;
	const disabled =
		!hasValue || formatPasswordError(error, password, passwordTouched);

	const submitHandler = (e: React.FormEvent) => {
		e.preventDefault();
		if (disabled) {
			return;
		}
		setPasswordTouched(false);
		setEmailTouched(false);
		handleLogin(email, password);
	};

	return (
		<div>
			<AuthForm
				title="Sign in"
				onSubmit={submitHandler}
				isLoading={isLoading}
				button={<button disabled={!!disabled}>Sign in</button>}
			>
				<InputTextField
					overlay="white"
					value={email}
					placeholder="Enter email"
					label="Email"
					onChange={setEmail}
					onBlur={() => setEmailTouched(true)}
					errorMessage={formatEmailError(email, emailTouched)}
				/>

				<InputPasswordField
					overlay="white"
					value={password}
					onChange={(e) => {
						setPassword(e);
						if (error?.message) {
							setError(null);
						}
					}}
					onBlur={() => setPasswordTouched(true)}
					errorMessage={formatPasswordError(error, password, passwordTouched)}
				/>
				<div className={styles.password}>
					<NavLink to="/forgot-password">Forget password?</NavLink>
				</div>
			</AuthForm>

			<div className={styles["sign-up-info"]}>
				You are new here? Join us
				<Link to={"/register"} className={styles.link}>
					Sign up
				</Link>
			</div>
		</div>
	);
};

export default Login;

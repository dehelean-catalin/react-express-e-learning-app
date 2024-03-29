import { passwordReggex } from "./inputPasswordHelper";

export const emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const formatEmailError = (
	error: null | { message: string },
	email: string,
	emailTouched: boolean
) => {
	const formattedEmail = email?.trim();
	console.log(error);
	if (error?.message?.toLocaleLowerCase().includes("email") && emailTouched)
		return error.message;

	if (!formattedEmail.length && emailTouched) return "Email is required";

	if (!formattedEmail.match(emailExp) && emailTouched)
		return "Not an email format";

	return;
};

export const formatDisplayNameError = (
	email: string | null,
	emailTouched: boolean
) => {
	if (email?.trim().length === 0 && emailTouched) return "Name is required";

	return;
};

export const formatPasswordError = (
	error: null | { message: string },
	password: string | null,
	passwordTouched: boolean
) => {
	if (error?.message.includes("Password") && !passwordTouched) {
		return error.message;
	}
	if (password.trim().length === 0 && passwordTouched) {
		return "Password is required";
	}
	if (password.trim().length < 6 && passwordTouched) {
		return "Password is too short";
	}
	if (password.trim().length > 20 && passwordTouched) {
		return "Password is too long";
	}
	if (passwordReggex(password) && passwordTouched) {
		return "Password does not match the pattern";
	}
	return;
};

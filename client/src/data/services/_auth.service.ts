import axios from "axios";
import { AuthModel } from "data/models/_auth.model";

export const postLogin = async (data: AuthModel): Promise<string> => {
	return await axios
		.post("http://localhost:4000/login", data)
		.then((res) => res.data);
};

export const postRegister = async (data: AuthModel): Promise<string> => {
	return await axios
		.post("http://localhost:4000/register", data)
		.then((res) => res.data);
};

export const postLoginProvider = async (data: AuthModel): Promise<string> => {
	return await axios
		.post("http://localhost:4000/login-provider", data)
		.then((res) => res.data);
};

// verifica si asta dobitocule:
export const forgotPassword = async (email: string): Promise<string> => {
	return axios.post("http://localhost:4000/forgot-password", email);
};
import { Router } from "express";
import {
	getProfileData,
	getProfilePicture,
	putProfileData,
	putProfilePicture,
} from "../controllers/profile-controller";
import {
	default as tokenAuth,
	default as tokenAuthMiddleware,
} from "../middleware/tokenAuth-middleware";
import validation from "../middleware/validation-middleware";
import { ProfileSchema } from "../schema/users-schema";

const router = Router();

router.get("/profile-data", tokenAuthMiddleware, getProfileData);
router.put("/profile-data", validation(ProfileSchema), putProfileData);

router.get("/profile-picture", tokenAuth, getProfilePicture);
router.put("/profile-picture", tokenAuth, putProfilePicture);

export default router;
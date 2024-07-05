import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createCustomerLoan } from "../controllers/customerLoan.controller.js";

router.route("/createLoan").post(createCustomerLoan);


export default router;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();



app.use(
  cors(),
  //   {
  //   origin: process.env.CORS_ORIGIN,
  //   credentials: true,
  // }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.ACCESS_TOKEN_SECRET, // Replace with your secret key
    resave: false,
    saveUninitialized: false,
  }),
);


import userRouter from "./routes/user.routes.js";
import customerRouter from "./routes/customer.routes.js";
import loanRouter from "./routes/loan.routes.js"

app.use("/api/v1/users", userRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/loan",loanRouter);

export { app };

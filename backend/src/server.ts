import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import todosRouter from "./routes/todos/todos";
import tasksRouter from "./routes/tasks/tasks";

const app = express();
app.use(
	cors({
		origin: "http://localhost:4030",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

app.use("/", tasksRouter);
app.use("/todos", todosRouter);

app.listen(3222, () => {
	console.log("Server running at http://localhost:3222");
});

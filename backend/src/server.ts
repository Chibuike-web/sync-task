import express from "express";
import cors from "cors";
import todosRouter from "./routes/todos";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/todos", todosRouter);

app.listen(3222, () => {
	console.log("Server running at http://localhost:3222");
});

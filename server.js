const app = require("./src/app");
require("dotenv").config();
const port = process.env.PORT;
const userRoutes = require("./src/routes/user.router");
const postRoutes = require("./src/routes/post.router");

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.use("/api", userRoutes);
app.use("/api", postRoutes);

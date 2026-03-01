const http = require("http");
const app = require("./app");

http.createServer(app);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});

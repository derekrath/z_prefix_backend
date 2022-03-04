const { app } = require("./app");

// const port = process.env.PORT;
//heroku sets port to 80
// const port = process.env.PORT || 80
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
  console.log(`PORT ${process.env.PORT}`);
  console.log(`NODE_ENV ${process.env.NODE_ENV}`);
});

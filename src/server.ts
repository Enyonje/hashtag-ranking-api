import app from "./app.js"; // use .js if compiling to ESNext, else "./app" for CommonJS

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
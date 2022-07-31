import httpServer from "./socket";

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

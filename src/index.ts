import router from "./infrastructures/Router";
import { connectDb } from "./infrastructures/database/mongodb";

(async () => {
  try {
    await connectDb();
    console.log("connect db");
  } catch (e) {
    console.error("failed init", e);
    throw new e();
  }
})();

router.listen(5000, () => {
  console.log("server listening on port 5000");
});

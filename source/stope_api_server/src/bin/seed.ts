import { mockAssets } from "@taigalabs/stope-mock-data";

import { connectDB } from "@/db";

(async function main() {
  console.log("Starting seed...");

  const db = await connectDB();


  mockAssets;
  await db.insert('assets')

})();

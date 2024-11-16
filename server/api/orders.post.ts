import { orders, InsertOrder } from "@/db/schema";
import { db } from "../api/sqlite-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newOrder: InsertOrder = {
      ...body
    }
    const result = db.insert(orders).values(newOrder).run();
    return { newOrder : result}
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
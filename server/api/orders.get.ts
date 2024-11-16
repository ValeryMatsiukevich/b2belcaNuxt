import { orders } from "../../db/schema";
import { db } from "../api/sqlite-service";

export default defineEventHandler(async () => {
  try {
    const ordersResp = db.select().from(orders).all();
    return { "orders" : ordersResp}
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
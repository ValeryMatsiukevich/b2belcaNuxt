import { orders } from "../../../db/schema";
import { db } from "../../api/sqlite-service";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    // get id as function parameter from route params
    const orderId = event.context.params?.id as string;
    const ordersResp = db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(orderId)))
      .get();
    return { user: ordersResp };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
import { orders } from "../../../db/schema";
import { db } from "../../api/sqlite-service";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.id as string;
    const usersResp = db
      .delete(orders)
      .where(eq(orders.id, parseInt(userId)))
      .run();
    return { user: usersResp };
  } catch (e: any) {
    throw createError({
      statusCode: 400,
      statusMessage: e.message,
    });
  }
});
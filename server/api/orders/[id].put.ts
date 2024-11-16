import { InsertOrder, orders } from "../../../db/schema";
import { db } from "../../api/sqlite-service";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {

  try {

    const userId = event.context.params?.id as string;

    const body = await readBody(event);

    const editOrder: InsertOrder = {

      ...body

    }

    const ordersResp = db

      .update(orders)

      .set(editOrder)

      .where(eq(orders.id, parseInt(userId)))

      .run();

    return { order: ordersResp };

  } catch (e: any) {

    throw createError({

      statusCode: 400,

      statusMessage: e.message,

    });

  }

});
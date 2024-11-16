import {  sql } from "drizzle-orm";
import type { InferSelectModel,InferInsertModel  } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey(),
  ClientUNP: text("ClientUNP"),
  UNP: text("UNP"),
  client: text("client"),
  date: text("date"),
  good: text("good"),
  guid: text("guid"),
  manager: text("manager"),
  number: integer("number"),
  ordernumber: text("ordernumber"),
  price: text("price"),
  quantity: integer("quantity"),
  sklad: integer("sklad"),
  response: text("response"),
  status: integer("status"),
  supplier: integer("supplier"),
  term: text("term"),
  type: integer("type"),
  version: integer("version"),    
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Order = InferSelectModel<typeof orders>;
export type InsertOrder = InferInsertModel <typeof orders>;

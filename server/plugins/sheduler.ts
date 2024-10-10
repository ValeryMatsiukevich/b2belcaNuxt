import { useScheduler } from "#scheduler";
import getCatalog1C from "~~/server/api/getCatalog1C";
import getOst8skl1C from "~~/server/api/getOst8skl1C";
import getManagers1C from "~~/server/api/getManagers1C";
import getContragents1C from "~~/server/api/getContragents1C";
import getPrices from "../api/getPrices";
import getBalance1C from "../api/getBalance1C";
import getInvoices1C from "../api/getInvoices1C";

export default defineNitroPlugin(() => {
  startScheduler();
});

function startScheduler() {
  const scheduler = useScheduler();

  scheduler
    .run(() => {
      getOst8skl1C();
      getPrices();
    })
    .everyHours(1);
  scheduler
    .run(() => {
      getCatalog1C();
      getManagers1C();
      getContragents1C();
      getBalance1C();
      getInvoices1C();
    })
    .everyFourHours();
}

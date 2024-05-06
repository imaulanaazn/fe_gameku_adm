import dayjs from "dayjs";
import { useEffect } from "react";

export function useDateRange(
  selectedOption: { label: string; value: string } | null,
  refresh: number,
  callback: ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => void
) {
  useEffect(() => {
    let date = { startDate: "", endDate: "" };

    const today = dayjs();
    let startDate, endDate;

    if (selectedOption?.value) {
      switch (selectedOption.value) {
        case "today":
          startDate = today.startOf("day");
          endDate = today.endOf("day");
          break;
        case "yesterday":
          const yesterday = today.subtract(1, "day");
          startDate = yesterday.startOf("day");
          endDate = yesterday.endOf("day");
          break;
        case "thisWeek":
          startDate = today.startOf("week");
          endDate = today.endOf("day");
          break;
        case "thisMonth":
          startDate = today.startOf("month");
          endDate = today.endOf("day");
          break;
        case "lastMonth":
          endDate = today.startOf("month").subtract(1, "day");
          startDate = endDate.startOf("month");
          break;
        case "last30days":
          startDate = today.subtract(1, "month").startOf("day");
          endDate = today.endOf("day");
          break;
        case "lastYear":
          startDate = today.subtract(1, "year").startOf("day");
          endDate = today.endOf("day");
          break;
        default:
          startDate = today.subtract(1, "year").startOf("day");
          endDate = today.endOf("day");
          // Handle other cases if necessary
          break;
      }
    } else {
      startDate = today.subtract(1, "year").startOf("day");
      endDate = today.endOf("day");
    }

    // Convert the date ranges to ISO strings
    if (startDate && endDate) {
      date = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
    }

    // Call the callback function with the date range if available
    if (date.startDate && date.endDate) {
      callback(date);
    }
  }, [selectedOption?.value, refresh]);
}

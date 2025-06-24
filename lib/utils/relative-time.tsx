import { formatDistanceToNowStrict } from "date-fns";

export function formatRelativeTime(isoString: string): string {
  try {
    if (!isoString) throw new Error("No date string provided");

    const date = new Date(isoString);

    if (isNaN(date.getTime())) throw new Error("Invalid date");

    return formatDistanceToNowStrict(date, { addSuffix: true });
  } catch (error) {
    console.log(error);
    return "Invalid Date";
  }
}

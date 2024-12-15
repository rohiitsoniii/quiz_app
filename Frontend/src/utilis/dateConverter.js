export const formatDate = (isoString) => {
  const date = new Date(isoString);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  // Ensure the day is 2 digits
  const [day, month, year] = formattedDate.replace(",", "").split(" ");

  return `${day.padStart(2, "0")} ${month}, ${year}`;
};

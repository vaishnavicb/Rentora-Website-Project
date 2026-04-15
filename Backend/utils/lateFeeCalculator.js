exports.calculateLateFee = (endDate, returnDate, lateFeePerDay) => {
  const end = new Date(endDate);
  const returned = new Date(returnDate);

  if (returned <= end) {
    return 0;
  }

  const diffTime = returned - end;
  const lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return lateDays * lateFeePerDay;
};
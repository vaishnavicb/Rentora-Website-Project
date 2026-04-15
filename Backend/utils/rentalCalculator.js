exports.calculateRental = (startDate, endDate, pricePerDay, deposit) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end - start;
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const rentalAmount = totalDays * pricePerDay;
  const totalPayable = rentalAmount + deposit;

  return {
    totalDays,
    rentalAmount,
    totalPayable
  };
};
export const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}.${day}.${year}`;
};

export const formatDateAmerican = (date: Date): string => {
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  return `${month}/${day}`;
};

export const getDateForDay = (startDate: Date, day: number): Date => {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + (day - 1));
  return date;
};

export const getDaysOptions = (startDate: Date): Date[] => {
  const options: Date[] = [];
  for (let i = 0; i <= 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    options.push(date);
  }
  return options;
};


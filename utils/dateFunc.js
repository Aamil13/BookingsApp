export const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    return { year, month };
  };

  export const getStartAndEndOfWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday is 0, adjust to Monday
    const startOfWeek = new Date(now.setDate(now.getDate() + diffToMonday));
    const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
    
    return {
      startOfWeek: formatDateToYearMonthDay(startOfWeek),
      endOfWeek: formatDateToYearMonthDay(endOfWeek)
    };
  };
  
  const formatDateToYearMonthDay = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // Returns date in 'YYYY-MM-DD' format
  };

  export const getCurrentYear = () => {
    const now = new Date();
    return now.getFullYear();
  };

  export const formatDateToYearMonth = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
    return { year, month };
  };
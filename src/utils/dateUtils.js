const formatDate = dateStr => {
  try {
    return new Date(dateStr).toLocaleDateString("en-gb");
    // return d.toLocaleDateString("en-gb");
  } catch {
    return dateStr;
  }
}

const formatDateYYYYMMDD = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const formatTimeIn15Minutes = () => {
  const eta = new Date(Date.now() + 15 * 60 * 1000); // +15 mins
  return eta.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export { formatDate, formatDateYYYYMMDD, formatTimeIn15Minutes };
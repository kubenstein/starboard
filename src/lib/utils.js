export function currentTimestamp() {
  return (Math.floor(Date.now() / 1000));
}

export function formattedDate(timestamp) {
  function pad(x) { return `0${x}`.slice(-2); }

  const d = new Date(timestamp * 1000);
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const day = pad(d.getDate());
  const month = pad((d.getMonth() + 1));
  const year = pad(d.getYear());
  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
}

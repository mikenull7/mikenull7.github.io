export const formatClock = (seconds, ot) => {
  const minutes = Math.max(Math.floor(seconds / 60), 0);
  const remainingSeconds = seconds % 60;

  return `${ot ? "+" : ""}${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export const setClock = (seconds, ot) => {
  document.querySelector(".clock").innerHTML = formatClock(seconds, ot);
};

export const formatReplayClock = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = Math.floor(minutes / 60);
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
  const formattedMinutesFinal = (minutes % 60).toString().padStart(2, "0");

  return `${formattedMinutesFinal}:${formattedSeconds}`;
};

export const setReplayClock = (seconds) => {
  document.querySelector("#GoalTime").innerHTML = formatReplayClock(seconds);
};

export const setTeamMeters = (teamMeters = { blue: "", orange: "" }) => {
  document.querySelector("#bluenames").innerHTML = teamMeters.blue
    .split(",")
    .join("<br/>");
  document.querySelector("#orangenames").innerHTML = teamMeters.orange
    .split(",")
    .join("<br/>");
};

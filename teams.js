export const setTeamNames = (
  teamNames = { blue: "BLUE", orange: "ORANGE" }
) => {
  document.querySelector(".team#blue #name").innerHTML = teamNames.blue;
  document.querySelector(".team#orange #name").innerHTML = teamNames.orange;
};

export const setTeamScores = (teamScores = { blue: 0, orange: 0 }) => {
  document.querySelector(".team#blue #score").innerHTML = teamScores.blue;
  document.querySelector(".team#orange #score").innerHTML = teamScores.orange;
};

export const targetPlayer = {
  name: `name`,
  shots: 34,
  assists: 10,
  saves: 3,
  goals: 20,
  score: 200,
};

export const PlayerStatCardName = (name) => {
  targetPlayer.name = name;
  document.querySelector(
    "#target-statcard-playername"
  ).innerHTML = `${targetPlayer.name}`;
};

export const PlayerStatCardShots = (shots) => {
  targetPlayer.shots = shots;
  document.querySelector(
    "#target-statcard-shots"
  ).innerHTML = `${targetPlayer.shots}`;
};

export const PlayerStatCardAssists = (assists) => {
  targetPlayer.assists = assists;
  document.querySelector(
    "#target-statcard-assists"
  ).innerHTML = `${targetPlayer.assists}`;
};

export const PlayerStatCardSaves = (saves) => {
  targetPlayer.saves = saves;
  document.querySelector(
    "#target-statcard-saves"
  ).innerHTML = `${targetPlayer.saves}`;
};

export const PlayerStatCardGoals = (goals) => {
  targetPlayer.goals = goals;
  document.querySelector(
    "#target-statcard-goals"
  ).innerHTML = `${targetPlayer.goals}`;
};

export const PlayerStatCardScore = (score) => {
  targetPlayer.score = score;
  document.querySelector(
    "#target-statcard-score"
  ).innerHTML = `${targetPlayer.score}`;
};

/*console.log(
  targetPlayer.shots,
  targetPlayer.assists,
  targetPlayer.saves,
  targetPlayer.goals,
  targetPlayer.score
);
*/

/*export const setPlayerStatCardName = targetPlayer.name;
document.querySelector(
  "#target-statcard-bg"
).innerHTML = `${targetPlayer.name}`;
*/

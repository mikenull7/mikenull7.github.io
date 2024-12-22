import "./style.css";
import { sosSocket } from "./socket";
import { setTargetPlayerBoost } from "./boost";
//import { getTeamNames } from "./teams";
import { setTeamScores } from "./teams";
import { setClock } from "./clock";
import { PlayerStatCardName, targetPlayer } from "./statcard";
import {
  PlayerStatCardAssists,
  PlayerStatCardGoals,
  PlayerStatCardSaves,
  PlayerStatCardShots,
  PlayerStatCardScore,
} from "./statcard";
import { setBoostNumbers } from "./TeamBoostNumbers";
import { setTeamMeters } from "./TeamBoostMeters";
import { formatReplayClock, setReplayClock } from "./replayclock";
import { setPlayerNamesPG } from "./postgamedata";

console.log("Starting...");

//START GLOBAL ELEMENTS HERE//
let latestGameState;
let BlueColorPrimary;
let OrangeColorPrimary;
let spectatedPlayer = null;
let previousSpectatedPlayer = null;
let blueTeamWins = 0;
let orangeTeamWins = 0;
let gamesPlayed = 1;
let eventQueue = [];
const eventDisplayTimeout = 2000;

function updateSeriesTitle() {
  const seriesTextDiv = document.getElementById("Series-Text");
  seriesTextDiv.innerHTML = `GAME ${gamesPlayed} BEST OF 7`;
}
// Function to update the divs with the current win counts
function updateWinDivs() {
  // Assuming you have div IDs like 'blue-win-1', 'blue-win-2', etc.
  for (let i = 1; i <= 4; i++) {
    const blueDiv = document.getElementById(`blue-win-${i}`);
    const orangeDiv = document.getElementById(`orange-win-${i}`);
    // Reset the visibility of all win divs
    blueDiv.style.backgroundColor = "transparent";
    orangeDiv.style.display = "transparent";
  }

  // Show the divs corresponding to the number of wins each team has
  for (let i = 1; i <= blueTeamWins; i++) {
    document.getElementById(`blue-win-${i}`).style.backgroundColor =
      "#" + `${BlueColorPrimary}`;
  }
  for (let i = 1; i <= orangeTeamWins; i++) {
    document.getElementById(`orange-win-${i}`).style.backgroundColor =
      "#" + `${OrangeColorPrimary}`;
  }
}
updateSeriesTitle();

//PARSED DATA STARTS HERE//
sosSocket.addEventListener("message", (event) => {
  const message = event.data;

  sosSocket.onmessage = (event) => {
    console.log(event.data);

    // Update the UI with the new data (for example, update scores or player info)

    const parsed = JSON.parse(message);
    console.log(parsed.event);

    //const gameStart = document.getElementById("game-start-flyover");
    //const gameEnd = document.getElementById("game-end-hypechamber");
    // const PostGameScoreboard = document.getElementById("PostGame-bg");
    const PostGameOverlay = document.querySelector(".PostGameData");
    const iframePodiumStart = document.getElementById("postgame-bg-video");
    const scriptTag = document.createElement("script");
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);

    let gameStartPlayer;

    // Initialize the YouTube Player
    function onYouTubeIframeAPIReady() {
      gameStartPlayer = new YT.Player("game-start-flyover", {
        events: {
          onReady: onPlayerReady,
        },
      });
    }

    // const PodiumStartVideo = new Vimeo.Player(iframePodiumStart);

    if (parsed.event === "game:update_state") {
      latestGameState = parsed.data; // Save the latest update state
    }

    if (parsed.event === "game:update_state") {
      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        setTargetPlayerBoost(targetPlayer.boost);
        console.log("boost meter on");
        document.getElementById("target-player").style.opacity = 100;
      } else if (parsed.data.game.hasTarget == false) {
        // console.log("boost meter off");
        document.getElementById("target-player").style.opacity = 0;
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardName(targetPlayer.name);
        console.log(targetPlayer.name);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardShots(targetPlayer.shots);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardAssists(targetPlayer.assists);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardSaves(targetPlayer.saves);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardGoals(targetPlayer.goals);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardScore(targetPlayer.score);
      }

      if (parsed.data.game.hasTarget) {
        const targetPlayer = parsed.data.players[parsed.data.game.target];
        PlayerStatCardShots(targetPlayer.shots);
      }

      if (parsed.data.game.hasTarget) {
        document.getElementById("statcard").style.opacity = 100;
      } else if (parsed.data.game.hasTarget == false) {
        document.getElementById("statcard").style.opacity = 0;
      }

      const BlueID = 0;
      const OrangeID = 1;
      const BlueTeamPlayers = Object.values(parsed.data.players).filter(
        (player) => player.team === BlueID
      );

      const arrayBlue = [
        BlueTeamPlayers.map(function (playermapBlue) {
          return playermapBlue.name;
        }),
      ].join("<br/>");
      // console.log(arrayBlue);

      const OrangeTeamPlayers = Object.values(parsed.data.players).filter(
        (player) => player.team === OrangeID
      );

      const arrayOrange = [
        OrangeTeamPlayers.map(function (playermapOrange) {
          return playermapOrange.name;
        }),
      ].join("\n");
      // console.log(arrayOrange);

      setTeamMeters({
        blue: arrayBlue,
        orange: arrayOrange,
      });

      function adjustFontSize(element, name) {
        const maxFontSize = 33; // Maximum font size for short names
        const minFontSize = 25; // Minimum font size for long names
        const maxNameLength = 11; // Max name length before the font size adjusts

        // If name length is greater than the max name length (11 in this case)
        if (name.length > maxNameLength) {
          // Apply the smaller font size for longer names
          element.style.fontSize = minFontSize + "px";
        } else {
          // Apply the normal (larger) font size for shorter names
          element.style.fontSize = maxFontSize + "px";
        }
      }

      // Function to set the team names and apply dynamic font size adjustment
      function setTeamNames(teams) {
        // Set the names for Blue and Orange teams
        const blueNameElement = document
          .getElementById("blue")
          .querySelector("#name");
        const orangeNameElement = document
          .getElementById("orange")
          .querySelector("#name");

        // Set the team names from parsed data
        blueNameElement.innerHTML = teams.blue;
        orangeNameElement.innerHTML = teams.orange;

        // Apply dynamic font size adjustment based on the team name lengths
        adjustFontSize(blueNameElement, teams.blue);
        adjustFontSize(orangeNameElement, teams.orange);
      }

      setTeamNames({
        blue: parsed.data.game.teams[0].name,
        orange: parsed.data.game.teams[1].name,
      });
      setTeamScores({
        blue: parsed.data.game.teams[0].score,
        orange: parsed.data.game.teams[1].score,
      });

      setClock(parsed.data.game.time_seconds, parsed.data.game.isOT);

      const BlueBoost = [
        BlueTeamPlayers.map(function (playermapBlue) {
          return playermapBlue.boost;
        }),
      ].join("<br/>");
      // console.log(BlueBoost);

      const OrangeBoost = [
        OrangeTeamPlayers.map(function (playermapOrange) {
          return playermapOrange.boost;
        }),
      ].join("<br/>");
      // console.log(OrangeBoost);

      setBoostNumbers({
        blue: BlueBoost,
        orange: OrangeBoost,
      });

      const BoostWidth1 = BlueBoost.split(",")[0];
      const BoostWidth2 = BlueBoost.split(",")[1];
      const BoostWidth3 = BlueBoost.split(",")[2];
      const BoostWidth4 = OrangeBoost.split(",")[0];
      const BoostWidth5 = OrangeBoost.split(",")[1];
      const BoostWidth6 = OrangeBoost.split(",")[2];

      const BlueBoost1 = (document.getElementById(
        "teamLeft-boost-track-fill-1"
      ).style.width = (BoostWidth1 / 100) * 345);
      //hey
      const BlueBoost2 = (document.getElementById(
        "teamLeft-boost-track-fill-2"
      ).style.width = (BoostWidth2 / 100) * 345);
      //hey3
      const BlueBoost3 = (document.getElementById(
        "teamLeft-boost-track-fill-3"
      ).style.width = (BoostWidth3 / 100) * 345);

      const OrangeBoost1 = (document.getElementById(
        "teamRight-boost-track-fill-1"
      ).style.width = (BoostWidth4 / 100) * 345);
      //hey
      const OrangeBoost2 = (document.getElementById(
        "teamRight-boost-track-fill-2"
      ).style.width = (BoostWidth5 / 100) * 345);
      //hey3
      const OrangeBoost3 = (document.getElementById(
        "teamRight-boost-track-fill-3"
      ).style.width = (BoostWidth6 / 100) * 345);

      const Teams = parsed.data.game.teams;
      // console.log(Teams);
      const ColorPrimary = Teams.map(function (TeamsmapColor) {
        return TeamsmapColor.color_primary;
      });

      const BlueColorPrimary = ColorPrimary[0];
      const OrangeColorPrimary = ColorPrimary[1];

      // SPECTATED PLAYER
      const spectatedPlayer = parsed.data.players[parsed.data.game.target];

      // STROKE COLOR
      const StrokeColor =
        spectatedPlayer?.team == 0 ? BlueColorPrimary : OrangeColorPrimary;
      // BOOST COLOR
      const BoostFill = document.querySelector("#target-boost-track-fill");
      BoostFill.style.stroke = `${"#" + StrokeColor}`;

      // STAT CARD COLOR
      const StatCardStroke = document.querySelector("#target-statcard-bg");
      StatCardStroke.style.borderColor = `${"#" + StrokeColor}`;

      const replayLogo = document.getElementById("ScoreCard-Container");
      if (parsed.data.game.isReplay) {
        replayLogo.style.opacity = 1;
      } else {
        replayLogo.style.opacity = 0;
      }

      //OVERTIME LOGO
      const overtimeLogo = document.getElementById("overtime-logo");
      if (parsed.data.game.isOT) {
        overtimeLogo.style.opacity = 1;
      } else {
        overtimeLogo.style.opacity = 0;
      }
    }

    if (parsed.event === "game:update_state") {
      const Teams = parsed.data.game.teams;
      //  console.log(Teams);
      const BlueTeam = Teams[0];
      const OrangeTeam = Teams[1];

      BlueColorPrimary = BlueTeam.color_primary;
      OrangeColorPrimary = OrangeTeam.color_primary;

      document.getElementById("blue-win-1").style.borderColor =
        "#" + `${BlueColorPrimary}`;
      document.getElementById("blue-win-2").style.borderColor =
        "#" + `${BlueColorPrimary}`;
      document.getElementById("blue-win-3").style.borderColor =
        "#" + `${BlueColorPrimary}`;
      document.getElementById("blue-win-4").style.borderColor =
        "#" + `${BlueColorPrimary}`;
      document.getElementById("orange-win-1").style.borderColor =
        "#" + `${OrangeColorPrimary}`;
      document.getElementById("orange-win-2").style.borderColor =
        "#" + `${OrangeColorPrimary}`;
      document.getElementById("orange-win-3").style.borderColor =
        "#" + `${OrangeColorPrimary}`;
      document.getElementById("orange-win-4").style.borderColor =
        "#" + `${OrangeColorPrimary}`;
    }

    if (parsed.event === "game:goal_scored") {
      console.log(parsed.data);
      const ReplayText = document.getElementById("replay-text");
      ReplayText.innerHTML = "REPLAY";
      const ScorerTeam = parsed.data.scorer.teamnum;
      console.log(ScorerTeam);
      const ScorerName = parsed.data.scorer.name;
      console.log(ScorerName);
      const ScorerText = document.getElementById("Scorer");
      ScorerText.innerHTML = `${ScorerName}`;
      const AssisterName = parsed.data.assister.name;
      //console.log(parsed.data.assister.name);
      const AssisterText = document.getElementById("Assister");
      AssisterText.innerHTML = `${AssisterName}`;
      const BallSpeed = Math.trunc(parsed.data.goalspeed / 1.609);
      //console.log(BallSpeed);
      const BallSpeedText = document.getElementById("BallSpeed");
      BallSpeedText.innerHTML = `${BallSpeed}` + "     MPH";
      const GoalTimeInSeconds = parsed.data.goaltime;
      const GoalTimeText = document.getElementById("GoalTime");
      //GoalTimeText.innerHTML = `${GoalTime}`;

      // REPLAYCLOCK:
      const timeInSeconds = `${GoalTimeInSeconds}`;
      GoalTimeText.innerHTML = formatReplayClock(timeInSeconds);
      const GoalScoredContainer = document.getElementById("scorecard-bg");

      if (ScorerTeam === 0) {
        GoalScoredContainer.style.backgroundColor = "#" + `${BlueColorPrimary}`;
        GoalScoredContainer.style.boxShadow =
          "0px 25px 100px 100px #" + `${BlueColorPrimary}`;
      } else {
        GoalScoredContainer.style.backgroundColor =
          "#" + `${OrangeColorPrimary}`;
        GoalScoredContainer.style.boxShadow =
          "0px 25px 100px 100px #" + `${OrangeColorPrimary}`;
      }

      if (AssisterName === "") {
        document.getElementById("AssisterImage").style.opacity = 0;
      } else {
        document.getElementById("AssisterImage").style.opacity = 1;
      }
    }
    //REPLAY LOGO
    const replaySwipe = document.getElementById("replay-swipe");
    if (parsed.event === "game:replay_start") {
      console.log("Replay started");
      replaySwipe.style.opacity = 1;
      replaySwipe.style.transition = "opacity 0s";
      setTimeout(() => {
        replaySwipe.style.opacity = 0;
        replaySwipe.style.transition = "opacity 1s";
      }, 1000);
    }

    if (parsed.event === "game:pre_countdown_begin") {
      gameStart.style.opacity = 0;
    }
    if (parsed.event === "game:round_started_go") {
      gameStart.currentTime = 0; // Rewind to the start;
    }

    if (parsed.event === "game:match_ended") {
      const winnerTeam = parsed.data.winner_team_num; // 0 for blue team, 1 for orange team

      // Increment the win count for the winning team
      if (winnerTeam === 0) {
        blueTeamWins++;
        //  console.log("Blue team wins! Total wins:", blueTeamWins);
      } else if (winnerTeam === 1) {
        orangeTeamWins++;
        // console.log("Orange team wins! Total wins:", orangeTeamWins);
      }
      //Update Series title
      gamesPlayed++;
      // Update the divs to show the current state of the series
      updateWinDivs();
      updateSeriesTitle();

      // Check if a team has won 4 games to determine if the match has ended
      if (blueTeamWins === 4) {
        //  console.log("Blue team wins the series!");
        // Add additional logic here to handle a series win (e.g., display a message, trigger animations, etc.)
      } else if (orangeTeamWins === 4) {
        //  console.log("Orange team wins the series!");
        // Add additional logic here to handle a series win (e.g., display a message, trigger animations, etc.)
      }
    }

    if (parsed.event === "game:statfeed_event") {
      console.log(parsed.data);
      const statEventType = parsed.data.type;
      const primaryTarget = parsed.data.main_target;
      const secondaryTarget = parsed.data.secondary_target;
      const primaryTargetName = primaryTarget ? primaryTarget.name : "Unknown";
      const secondaryTargetName = secondaryTarget
        ? secondaryTarget.name
        : "Unknown";
      const teamNum = primaryTarget ? primaryTarget.team_num : -1;
      const teamNumSecondary = secondaryTarget ? secondaryTarget.team_num : -1;

      const newEventDiv = document.createElement("div");
      newEventDiv.className = "statfeed-event";

      // Create the icon container and append the icon
      const iconContainer = document.createElement("div");
      iconContainer.className = "statfeed-icon-container";
      const icon = document.createElement("img");
      icon.className = "statfeed-icon";
      icon.src = `./${statEventType}.png`;
      iconContainer.appendChild(icon);

      // Create the text container for player names
      const containerDiv = document.createElement("div");
      containerDiv.className = "statfeed-text-container";

      const primaryTextNode = document.createElement("div");
      primaryTextNode.className = "statfeed-primary-name";
      primaryTextNode.textContent = primaryTargetName;

      const secondaryNameContainer = document.createElement("div");
      secondaryNameContainer.className = "statfeed-secondary-name-container";

      // Secondary Target Name
      const secondaryTextNode = document.createElement("div");
      secondaryTextNode.className = "statfeed-secondary-name";
      secondaryTextNode.textContent = secondaryTargetName;

      secondaryNameContainer.appendChild(secondaryTextNode);

      // Append the primary target name and secondary name container in the text container
      containerDiv.appendChild(primaryTextNode);
      containerDiv.appendChild(secondaryNameContainer);

      // Append the icon and the text container to the event div
      newEventDiv.appendChild(icon);
      newEventDiv.appendChild(containerDiv);

      // Append the new event div to the statfeed container
      document.getElementById("statfeed-container").appendChild(newEventDiv);

      // Style based on team number
      if (teamNum === 0) {
        newEventDiv.style.backgroundColor = `#${BlueColorPrimary}`;
      } else if (teamNum === 1) {
        newEventDiv.style.backgroundColor = `#${OrangeColorPrimary}`;
      }

      if (teamNumSecondary === 0) {
        secondaryTextNode.style.backgroundColor = `#${BlueColorPrimary}`;
      } else if (teamNumSecondary === 1) {
        secondaryTextNode.style.backgroundColor = `#${OrangeColorPrimary}`;
      }

      setTimeout(() => {
        newEventDiv.style.animation = "fadeIn 0.5s forwards";
      }, 0);

      setTimeout(() => {
        newEventDiv.style.animation = "fadeOut 0.5s forwards";
        setTimeout(() => {
          newEventDiv.style.display = "none";
          document
            .getElementById("statfeed-container")
            .removeChild(newEventDiv);
        }, 500);
      }, eventDisplayTimeout);

      eventQueue.push(newEventDiv);
      if (eventQueue.length > 3) {
        const firstEvent = eventQueue.shift();
        firstEvent.style.display = "none";
        document.getElementById("statfeed-container").removeChild(firstEvent);
      }
    }

    if (parsed.event === "game:update_state") {
      // STYLING COLORS HERE FOR SCOREBOARD AND BOOST METERS //
      const BlueBoostMeterFillColors = {
        BlueBoost1: document.querySelector("#teamLeft-boost-track-fill-1"),
        BlueBoost2: document.querySelector("#teamLeft-boost-track-fill-2"),
        BlueBoost3: document.querySelector("#teamLeft-boost-track-fill-3"),
      };

      const BlueBoostMeterBorderColors = {
        BlueBorder1: document.querySelector("#teamLeft-boost-bg-1"),
        BlueBorder2: document.querySelector("#teamLeft-boost-bg-2"),
        BlueBorder3: document.querySelector("#teamLeft-boost-bg-3"),
      };

      const OrangeBoostMeterFillColors = {
        OrangeBoost1: document.querySelector("#teamRight-boost-track-fill-1"),
        OrangeBoost2: document.querySelector("#teamRight-boost-track-fill-2"),
        OrangeBoost3: document.querySelector("#teamRight-boost-track-fill-3"),
      };

      const OrangeBoostMeterBorderColors = {
        OrangeBorder1: document.querySelector("#teamRight-boost-bg-1"),
        OrangeBorder2: document.querySelector("#teamRight-boost-bg-2"),
        OrangeBorder3: document.querySelector("#teamRight-boost-bg-3"),
      };
      //MAIN SCOREBOARD //
      document.querySelector(
        ".team#blue #score-bg"
      ).style.background = `#${BlueColorPrimary}`;
      document.querySelector(
        ".team#orange #score-bg"
      ).style.background = `#${OrangeColorPrimary}`;
      document.querySelector(
        ".team#blue"
      ).style.borderColor = `#${BlueColorPrimary}`;
      document.querySelector(
        ".team#orange"
      ).style.borderColor = `#${OrangeColorPrimary}`;
      // POST GAME SCOREBOARD //
      document.querySelector(
        "#Blue-Score-bg"
      ).style.backgroundColor = `#${BlueColorPrimary}`;
      document.querySelector(
        "#Orange-Score-bg"
      ).style.backgroundColor = `#${OrangeColorPrimary}`;
      document.querySelector(
        "#BlueTeamName"
      ).style.borderColor = `#${BlueColorPrimary}`;
      document.querySelector(
        "#OrangeTeamName"
      ).style.borderColor = `#${OrangeColorPrimary}`;
      //POST GAME PLAYER STATS //
      document.querySelector(
        ".BluePlayers"
      ).style.borderColor = `#${BlueColorPrimary}`;
      document.querySelector(
        ".OrangePlayers"
      ).style.borderColor = `#${OrangeColorPrimary}`;
      document.querySelector(
        ".BluePlayerStats"
      ).style.borderColor = `#${BlueColorPrimary}`;
      document.querySelector(
        ".OrangePlayerStats"
      ).style.borderColor = `#${OrangeColorPrimary}`;
      // STAT BAR COLORS //
      const BlueStatBarFIllColors = {
        BlueGoalsBar: document.querySelector("#BlueGoalsBar"),
        BlueAssistsBar: document.querySelector("#BlueAssistsBar"),
        BlueSavesBar: document.querySelector("#BlueSavesBar"),
        BlueShotsBar: document.querySelector("#BlueShotsBar"),
        BlueDemosBar: document.querySelector("#BlueDemosBar"),
      };

      const OrangeStatBarFIllColors = {
        OrangeGoalsBar: document.querySelector("#OrangeGoalsBar"),
        OrangeAssistsBar: document.querySelector("#OrangeAssistsBar"),
        OrangeSavesBar: document.querySelector("#OrangeSavesBar"),
        OrangeShotsBar: document.querySelector("#OrangeShotsBar"),
        OrangeDemosBar: document.querySelector("#OrangeDemosBar"),
      };

      for (let key in BlueStatBarFIllColors) {
        if (BlueStatBarFIllColors[key]) {
          BlueStatBarFIllColors[
            key
          ].style.backgroundColor = `#${BlueColorPrimary}`;
        }
      }

      for (let key in OrangeStatBarFIllColors) {
        if (OrangeStatBarFIllColors[key]) {
          OrangeStatBarFIllColors[
            key
          ].style.backgroundColor = `#${OrangeColorPrimary}`;
        }
      }
      // Apply styles to Blue Boost Meter Fill Elements
      for (let key in BlueBoostMeterFillColors) {
        if (BlueBoostMeterFillColors[key]) {
          BlueBoostMeterFillColors[key].style.fill = `#${BlueColorPrimary}`;
        }
      }

      // Apply styles to Blue Boost Meter Border Elements
      for (let key in BlueBoostMeterBorderColors) {
        if (BlueBoostMeterBorderColors[key]) {
          BlueBoostMeterBorderColors[
            key
          ].style.borderColor = `#${BlueColorPrimary}`;
        }
      }

      // Apply styles to Orange Boost Meter Fill Elements
      for (let key in OrangeBoostMeterFillColors) {
        if (OrangeBoostMeterFillColors[key]) {
          OrangeBoostMeterFillColors[key].style.fill = `#${OrangeColorPrimary}`;
        }
      }

      // Apply styles to Orange Boost Meter Border Elements
      for (let key in OrangeBoostMeterBorderColors) {
        if (OrangeBoostMeterBorderColors[key]) {
          OrangeBoostMeterBorderColors[
            key
          ].style.borderColor = `#${OrangeColorPrimary}`;
        }
      }
    }

    if (parsed.event === "game:match_created") {
      console.log("Match created");
      // gameStart.style.opacity = 1;
      // gameStart.play();
      // gameStartVideo.play();
      gameStartPlayer.playVideo();

      gameEnd.style.opacity = 0;
      const elements = {
        scorebug: document.querySelector(".scorebug"),
        teamLeftMeters: document.querySelector(".TeamLeftBoostMeters"),
        teamRightMeters: document.querySelector(".TeamRightBoostMeters"),
        blueTeamName: document.querySelector("#blue-team-name"),
        orangeTeamName: document.querySelector("#orange-team-name"),
        overtimeLogo: document.querySelector("#overtime-logo"),
        SeriesText: document.getElementById("Series-Container-bg"),
        SeriesBlue1: document.getElementById("blue-win-1"),
        SeriesBlue2: document.getElementById("blue-win-2"),
        SeriesBlue3: document.getElementById("blue-win-3"),
        SeriesBlue4: document.getElementById("blue-win-4"),
        SeriesOrange1: document.getElementById("orange-wins-1"),
        SeriesOrange2: document.getElementById("orange-wins-2"),
        SeriesOrange3: document.getElementById("orange-wins-3"),
        SeriesOrange4: document.getElementById("orange-wins-4"),
      };

      // Function to set opacity of all elements
      function setElementsOpacity(opacityValue) {
        Object.values(elements).forEach((element) => {
          if (element) {
            element.style.opacity = opacityValue;
          }
        });
      }

      // Set opacity to 0 when the match is created
      setElementsOpacity(0);
    }

    if (parsed.event === "game:pre_countdown_begin") {
      const elements = {
        scorebug: document.querySelector(".scorebug"),
        teamLeftMeters: document.querySelector(".TeamLeftBoostMeters"),
        teamRightMeters: document.querySelector(".TeamRightBoostMeters"),
        blueTeamName: document.querySelector("#blue-team-name"),
        orangeTeamName: document.querySelector("#orange-team-name"),
        overtimeLogo: document.querySelector("#overtime-logo"),
        SeriesText: document.getElementById("Series-Container-bg"),
        SeriesBlue1: document.getElementById("blue-win-1"),
        SeriesBlue2: document.getElementById("blue-win-2"),
        SeriesBlue3: document.getElementById("blue-win-3"),
        SeriesBlue4: document.getElementById("blue-win-4"),
        SeriesOrange1: document.getElementById("orange-wins-1"),
        SeriesOrange2: document.getElementById("orange-wins-2"),
        SeriesOrange3: document.getElementById("orange-wins-3"),
        SeriesOrange4: document.getElementById("orange-wins-4"),
      };

      // Function to set opacity of all elements
      function setElementsOpacity(opacityValue) {
        Object.values(elements).forEach((element) => {
          if (element) {
            element.style.opacity = opacityValue;
          }
        });
      }
      // Set opacity to 1 when the pre countdown begins
      setElementsOpacity(1);
    }
    if (parsed.event === "game:round_started_go") {
      gameStart.currentTime = 0; // Rewind to the start;
      gameEnd.currentTime = 0;
    }

    const DefaultColor = "373d4a";
    if (parsed.event === "game:update_state") {
      const BlueID = 0;
      const OrangeID = 1;
      const BlueTeamPlayers = Object.values(parsed.data.players).filter(
        (player) => player.team === BlueID
      );

      const arrayBlue = [
        BlueTeamPlayers.map(function (playermapBlue) {
          return playermapBlue.name;
        }),
      ].join("<br/>");

      const OrangeTeamPlayers = Object.values(parsed.data.players).filter(
        (player) => player.team === OrangeID
      );

      const arrayOrange = [
        OrangeTeamPlayers.map(function (playermapOrange) {
          return playermapOrange.name;
        }),
      ].join("\n");

      // Initialize the spectated player here
      const spectatedPlayer = parsed.data.players[parsed.data.game.target];
      const hasTarget = parsed.data.game.hasTarget; // Check if there is a target player

      if (spectatedPlayer) {
        const spectatedPlayerName = spectatedPlayer.name;

        // Define the players and background divs as constants
        const BluePlayer1 = arrayBlue.split(",")[0];
        const BluePlayer2 = arrayBlue.split(",")[1];
        const BluePlayer3 = arrayBlue.split(",")[2];
        const OrangePlayer1 = arrayOrange.split(",")[0];
        const OrangePlayer2 = arrayOrange.split(",")[1];
        const OrangePlayer3 = arrayOrange.split(",")[2];

        const BlueBackground1 = document.getElementById("teamLeft-boost-bg-1");
        const BlueBackground2 = document.getElementById("teamLeft-boost-bg-2");
        const BlueBackground3 = document.getElementById("teamLeft-boost-bg-3");
        const OrangeBackground1 = document.getElementById(
          "teamRight-boost-bg-1"
        );
        const OrangeBackground2 = document.getElementById(
          "teamRight-boost-bg-2"
        );
        const OrangeBackground3 = document.getElementById(
          "teamRight-boost-bg-3"
        );

        // Determine if the new spectated player is on the Blue team or Orange team
        const isBlueTeam = [BluePlayer1, BluePlayer2, BluePlayer3].includes(
          spectatedPlayerName
        );
        const isOrangeTeam = [
          OrangePlayer1,
          OrangePlayer2,
          OrangePlayer3,
        ].includes(spectatedPlayerName);

        // If the spectated player has changed teams, reset the background color for all containers
        if (
          previousSpectatedPlayer &&
          previousSpectatedPlayer.team !== spectatedPlayer.team
        ) {
          // Reset all boost backgrounds to default color
          BlueBackground1.style.backgroundColor = "#373d4a";
          BlueBackground2.style.backgroundColor = "#373d4a";
          BlueBackground3.style.backgroundColor = "#373d4a";
          OrangeBackground1.style.backgroundColor = "#373d4a";
          OrangeBackground2.style.backgroundColor = "#373d4a";
          OrangeBackground3.style.backgroundColor = "#373d4a";
        }

        // Apply the Blue team color to the spectated player's boost containers
        if (isBlueTeam) {
          console.log(
            `Spectated player is on the Blue team: ${spectatedPlayerName}`
          );

          if (spectatedPlayerName === BluePlayer1) {
            BlueBackground1.style.backgroundColor = `#${BlueColorPrimary}`;
          } else {
            BlueBackground1.style.backgroundColor = "#373d4a"; // default color
          }

          if (spectatedPlayerName === BluePlayer2) {
            BlueBackground2.style.backgroundColor = `#${BlueColorPrimary}`;
          } else {
            BlueBackground2.style.backgroundColor = "#373d4a"; // default color
          }

          if (spectatedPlayerName === BluePlayer3) {
            BlueBackground3.style.backgroundColor = `#${BlueColorPrimary}`;
          } else {
            BlueBackground3.style.backgroundColor = "#373d4a"; // default color
          }
        }

        // Apply the Orange team color to the spectated player's boost containers
        else if (isOrangeTeam) {
          console.log(
            `Spectated player is on the Orange team: ${spectatedPlayerName}`
          );

          if (spectatedPlayerName === OrangePlayer1) {
            OrangeBackground1.style.backgroundColor = `#${OrangeColorPrimary}`;
          } else {
            OrangeBackground1.style.backgroundColor = "#373d4a"; // default color
          }

          if (spectatedPlayerName === OrangePlayer2) {
            OrangeBackground2.style.backgroundColor = `#${OrangeColorPrimary}`;
          } else {
            OrangeBackground2.style.backgroundColor = "#373d4a"; // default color
          }

          if (spectatedPlayerName === OrangePlayer3) {
            OrangeBackground3.style.backgroundColor = `#${OrangeColorPrimary}`;
          } else {
            OrangeBackground3.style.backgroundColor = "#373d4a"; // default color
          }
        }

        // Update the previous spectated player for the next cycle
        previousSpectatedPlayer = spectatedPlayer;
      }
      // If there's no target player (hasTarget = false), reset all background colors
      if (parsed.data.game.target === "") {
        // console.log(
        //   "No spectated player (hasTarget is false), resetting background colors."
        //  );

        const BlueBackground1 = document.getElementById("teamLeft-boost-bg-1");
        const BlueBackground2 = document.getElementById("teamLeft-boost-bg-2");
        const BlueBackground3 = document.getElementById("teamLeft-boost-bg-3");
        const OrangeBackground1 = document.getElementById(
          "teamRight-boost-bg-1"
        );
        const OrangeBackground2 = document.getElementById(
          "teamRight-boost-bg-2"
        );
        const OrangeBackground3 = document.getElementById(
          "teamRight-boost-bg-3"
        );
        // Reset background color for both Blue and Orange teams to default
        BlueBackground1.style.backgroundColor = `#${DefaultColor}`;
        BlueBackground2.style.backgroundColor = `#${DefaultColor}`;
        BlueBackground3.style.backgroundColor = `#${DefaultColor}`;
        OrangeBackground1.style.backgroundColor = `#${DefaultColor}`;
        OrangeBackground2.style.backgroundColor = `#${DefaultColor}`;
        OrangeBackground3.style.backgroundColor = `#${DefaultColor}`;

        previousSpectatedPlayer = null; // Reset the previous spectated player
        return; // Exit early since there is no target to update
      }
    }
    if (parsed.event === "game:podium_start") {
      console.log("Podium Started");
      console.log(latestGameState);

      const PostGameOverlay = document.querySelector(".PostGameData");
      PostGameOverlay.style.opacity = 1;
      // Show the post-game scoreboard
      PostGameScoreboard.style.opacity = 1;
      PodiumStartVideo.play();

      // Adjust font size for team names
      function adjustTeamFontSize(element, name) {
        const maxFontSize = 80;
        const minFontSize = 68;
        const maxNameLength = 11;

        if (name.length > maxNameLength) {
          element.style.fontSize = `${minFontSize}px`;
        } else {
          element.style.fontSize = `${maxFontSize}px`;
        }
      }

      // Adjust font size for player names
      function adjustPlayerFontSize(element, name) {
        const maxFontSize = 50;
        const minFontSize = 40;
        const maxNameLength = 9;

        if (name.length > maxNameLength) {
          element.style.fontSize = `${minFontSize}px`;
        } else {
          element.style.fontSize = `${maxFontSize}px`;
        }
      }

      // Set team names and scores
      function setTeamNames(teams) {
        const blueNameElement = document.getElementById("BlueTeamName");
        const orangeNameElement = document.getElementById("OrangeTeamName");

        blueNameElement.innerHTML = teams[0].name;
        orangeNameElement.innerHTML = teams[1].name;

        adjustTeamFontSize(blueNameElement, teams[0].name);
        adjustTeamFontSize(orangeNameElement, teams[1].name);

        const blueScoreElement = document.getElementById("BlueScore");
        const orangeScoreElement = document.getElementById("OrangeScore");

        blueScoreElement.innerHTML = teams[0].score;
        orangeScoreElement.innerHTML = teams[1].score;
      }

      setTeamNames(latestGameState.game.teams);

      // Set player names and stats
      const BlueTeamPlayers = Object.values(latestGameState.players).filter(
        (player) => player.team === 0
      );
      const OrangeTeamPlayers = Object.values(latestGameState.players).filter(
        (player) => player.team === 1
      );

      // Update stat bars comparing team stats
      function updateStatBars() {
        function calculateTeamStatTotal(players, stat) {
          return players.reduce((sum, player) => sum + (player[stat] || 0), 0);
        }

        const blueStats = {
          goals: calculateTeamStatTotal(BlueTeamPlayers, "goals"),
          assists: calculateTeamStatTotal(BlueTeamPlayers, "assists"),
          saves: calculateTeamStatTotal(BlueTeamPlayers, "saves"),
          shots: calculateTeamStatTotal(BlueTeamPlayers, "shots"),
          demos: calculateTeamStatTotal(BlueTeamPlayers, "demos"),
        };

        const orangeStats = {
          goals: calculateTeamStatTotal(OrangeTeamPlayers, "goals"),
          assists: calculateTeamStatTotal(OrangeTeamPlayers, "assists"),
          saves: calculateTeamStatTotal(OrangeTeamPlayers, "saves"),
          shots: calculateTeamStatTotal(OrangeTeamPlayers, "shots"),
          demos: calculateTeamStatTotal(OrangeTeamPlayers, "demos"),
        };

        // Helper to calculate bar percentages
        function setBarWidths(statName, blueValue, orangeValue) {
          const total = blueValue + orangeValue;
          const bluePercent = total > 0 ? (blueValue / total) * 100 : 0;
          const orangePercent = total > 0 ? (orangeValue / total) * 100 : 0;

          const blueBar = document.getElementById(`Blue${statName}Bar`);
          const orangeBar = document.getElementById(`Orange${statName}Bar`);

          blueBar.style.width = `${bluePercent}%`;
          orangeBar.style.width = `${orangePercent}%`;
        }

        setBarWidths("Goals", blueStats.goals, orangeStats.goals);
        setBarWidths("Assists", blueStats.assists, orangeStats.assists);
        setBarWidths("Saves", blueStats.saves, orangeStats.saves);
        setBarWidths("Shots", blueStats.shots, orangeStats.shots);
        setBarWidths("Demos", blueStats.demos, orangeStats.demos);
      }

      // Set player names and stats dynamically
      function setPlayerNamesAndStats() {
        // Blue Team
        BlueTeamPlayers.forEach((player, index) => {
          const playerElement = document.getElementById(
            `BluePlayer${index + 1}`
          );
          playerElement.innerHTML = player.name;
          adjustPlayerFontSize(playerElement, player.name);

          const playerStatsElement = document.getElementById(
            `BluePlayer${index + 1}-stats`
          );
          playerStatsElement.innerHTML = `
          ${player.goals}<br>
          ${player.assists}<br>
          ${player.saves}<br>
          ${player.shots}<br>
          ${player.demos}
        `;
        });

        // Orange Team
        OrangeTeamPlayers.forEach((player, index) => {
          const playerElement = document.getElementById(
            `OrangePlayer${index + 1}`
          );
          playerElement.innerHTML = player.name;
          adjustPlayerFontSize(playerElement, player.name);

          const playerStatsElement = document.getElementById(
            `OrangePlayer${index + 1}-stats`
          );
          playerStatsElement.innerHTML = `
          ${player.goals}<br>
          ${player.assists}<br>
          ${player.saves}<br>
          ${player.shots}<br>
          ${player.demos}
        `;
        });

        // Update stat comparison bars
        updateStatBars();
      }

      setPlayerNamesAndStats();
    }

    if (parsed.event === "game:match_destroyed") {
      gameEnd.style.opacity = 1;
      gameEnd.play();
      PostGameScoreboard.style.opacity = 0;
      PostGameOverlay.style.opacity = 0;
    }

    if (parsed.event === "game:initialized") {
      console.log("Match initialized");
      gameStart.style.opacity = 1;
      gameStart.play();

      gameEnd.style.opacity = 0;
      const elements = {
        scorebug: document.querySelector(".scorebug"),
        teamLeftMeters: document.querySelector(".TeamLeftBoostMeters"),
        teamRightMeters: document.querySelector(".TeamRightBoostMeters"),
        blueTeamName: document.querySelector("#blue-team-name"),
        orangeTeamName: document.querySelector("#orange-team-name"),
        overtimeLogo: document.querySelector("#overtime-logo"),
        SeriesText: document.getElementById("Series-Container-bg"),
        SeriesBlue1: document.getElementById("blue-win-1"),
        SeriesBlue2: document.getElementById("blue-win-2"),
        SeriesBlue3: document.getElementById("blue-win-3"),
        SeriesBlue4: document.getElementById("blue-win-4"),
        SeriesOrange1: document.getElementById("orange-wins-1"),
        SeriesOrange2: document.getElementById("orange-wins-2"),
        SeriesOrange3: document.getElementById("orange-wins-3"),
        SeriesOrange4: document.getElementById("orange-wins-4"),
      };

      // Function to set opacity of all elements
      function setElementsOpacity(opacityValue) {
        Object.values(elements).forEach((element) => {
          if (element) {
            element.style.opacity = opacityValue;
          }
        });
      }

      // Set opacity to 0 when the match is created
      setElementsOpacity(0);
    }
  };
});

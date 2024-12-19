export const setPlayerNamesPG = (
  PlayerNamesPG = {
    BluePlayer1: "",
    BluePlayer2: "",
    BluePlayer3: "",
    OrangePlayer1: "",
    OrangePlayer2: "",
    OrangePlayer3: "",
  }
) => {
  document.querySelector("#BluePlayer1").innerHTML = PlayerNamesPG.BluePlayer1;
  document.querySelector("#BluePlayer2").innerHTML = PlayerNamesPG.BluePlayer2;
  document.querySelector("#BluePlayer3").innerHTML = PlayerNamesPG.BluePlayer3;
  document.querySelector("#OrangePlayer1").innerHTML =
    PlayerNamesPG.OrangePlayer1;
  document.querySelector("#OrangePlayer2").innerHTML =
    PlayerNamesPG.OrangePlayer2;
  document.querySelector("#OrangePlayer3").innerHTML =
    PlayerNamesPG.OrangePlayer3;
};

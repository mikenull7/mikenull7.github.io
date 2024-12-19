export const setBoostNumbers = (BoostNumber = { blue: "", orange: "" }) => {
  document.querySelector("#bluenumbers").innerHTML = BoostNumber.blue
    .split(",")
    .join("<br/>");
  document.querySelector("#orangenumbers").innerHTML = BoostNumber.orange
    .split(",")
    .join("<br/>");
};

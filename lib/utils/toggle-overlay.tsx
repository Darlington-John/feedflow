export const toggleOverlay = () => {
  const overlayElement = document.getElementById("overlay");
  if (!overlayElement) {
    return;
  }
  if (overlayElement.style.transform === "translateY(0%)") {
    overlayElement.style.transform = "translateY(-100%)";
  } else {
    overlayElement.style.transform = "translateY(0%)";
  }
};

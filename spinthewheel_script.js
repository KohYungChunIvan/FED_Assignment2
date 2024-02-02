// First Game (Spin the Wheel)

document.addEventListener('DOMContentLoaded', function () {
  let spinWheel = document.querySelector('.wheel');
  let triggerButton = document.querySelector('.spinBtn');
  let rotationDegrees = 0;
  let wheelInMotion = false; // A flag to determine if the wheel is spinning
  const segmentsTotal = 8; // The number of segments on the wheel

  triggerButton.onclick = function () {
    if (!wheelInMotion) { // Check if the wheel is already spinning
      wheelInMotion = true; // Set the flag to true to indicate spinning has started
      rotationDegrees += Math.floor(500 + Math.random() * 3100); // Ensures a full rotation
      spinWheel.style.transition = 'transform 4s ease-out';
      spinWheel.style.transform = `rotate(${rotationDegrees}deg)`;

      setTimeout(function () {
        const segmentAngle = 360 / segmentsTotal; // degrees for each segment
        const middleOffset = segmentAngle / 2; // offset to point to the middle of a segment
        const normalizedDegree = (rotationDegrees % 360 + middleOffset) % 360;
        let segmentIndex = Math.ceil((360 - normalizedDegree) / segmentAngle) + 1;

        // The index should not exceed segmentsTotal, if it does, reset to 1 (the first segment)
        if (segmentIndex > segmentsTotal) {
          segmentIndex = 1;
        }

        // Get the selected prize amount based on the index
        const prizeValue = spinWheel.querySelector(`.number:nth-child(${segmentIndex}) span`).textContent;

        // Show an alert with the selected prize
        alert(`Congratulations! You won: ${prizeValue}`);

        wheelInMotion = false; // Reset the flag to allow spinning again
      }, 4000);
    }
  };
});

  
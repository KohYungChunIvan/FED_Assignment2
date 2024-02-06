// (Spin the Wheel)

document.addEventListener('DOMContentLoaded', function () {
  let spinWheel = document.querySelector('.wheel'); // Get the wheel element
  let triggerButton = document.querySelector('.spinBtn'); // Get the spin button element
  let rotationDegrees = 0; // Initialize the initial rotation degree of the wheel
  let wheelInMotion = false; // A flag to determine if the wheel is spinning
  const segmentsTotal = 8; // The number of segments on the wheel

  triggerButton.onclick = function () {
    if (!wheelInMotion) { // Check if the wheel is already spinning
      wheelInMotion = true; // Set the flag to true to indicate spinning has started
      rotationDegrees += Math.floor(500 + Math.random() * 3100); // Calculate the rotation degree to ensure a full rotation
      spinWheel.style.transition = 'transform 4s ease-out'; // Apply CSS transition for smooth rotation
      spinWheel.style.transform = `rotate(${rotationDegrees}deg)`; // Rotate the wheel

      setTimeout(async function () {
        const segmentAngle = 360 / segmentsTotal; // Calculate the degrees for each segment
        const middleOffset = segmentAngle / 2; // Calculate the offset to point to the middle of a segment
        const normalizedDegree = (rotationDegrees % 360 + middleOffset) % 360; // Normalize the degree to [0, 360)
        let segmentIndex = Math.ceil((360 - normalizedDegree) / segmentAngle) + 1; // Calculate the index of the selected segment

        // The index should not exceed segmentsTotal, if it does, reset to 1 (the first segment)
        if (segmentIndex > segmentsTotal) {
          segmentIndex = 1;
        }

        // Get the selected prize amount based on the index and parse it as an integer
        const prizeValue = parseInt(spinWheel.querySelector(`.number:nth-child(${segmentIndex}) span`).textContent, 10);

        // Display an alert to inform the user about the prize
        alert(`Congratulations! You won: ${prizeValue} points.`);

        // Update the user's points with the prize value
        try {
          await updateUserPoints(prizeValue); // Assuming this function correctly handles numbers
          displayUserPoints(); // Update the UI with the new points
          // Redirect to rewards page if needed
          window.location.href = 'rewards.html';
        } catch (error) {
          console.error('Error updating points:', error);
        }

        wheelInMotion = false; // Reset the flag to allow spinning again
      }, 4000); // Wait for 4 seconds before determining the prize
    }
  };
});

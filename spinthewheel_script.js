// First Game (Spin the Wheel)
document.addEventListener('DOMContentLoaded', function () {
    let wheel = document.querySelector('.wheel');
    let spinBtn = document.querySelector('.spinBtn');
    let deg = 0;
    let isSpinning = false; // A flag to determine if the wheel is spinning
    const maxPrizes = 8; // The number of segments on the wheel
  
    spinBtn.onclick = function () {
      if (!isSpinning) { // Check if the wheel is already spinning
        isSpinning = true; // Set the flag to true to indicate spinning has started
        deg += Math.floor(500 + Math.random() * 3100); // Ensures a full rotation
        wheel.style.transition = 'transform 4s ease-out';
        wheel.style.transform = `rotate(${deg}deg)`;
  
        setTimeout(function () {
          const singleSlice = 360 / maxPrizes; // degrees for each segment
          const offset = singleSlice / 2; // offset to point to the middle of a segment
          const degreeNormalized = (deg % 360 + offset) % 360;
          let prizeIndex = Math.ceil((360 - degreeNormalized) / singleSlice) + 1;
        
          // The index should not exceed maxPrizes, if it does, reset to 1 (the first prize)
          if (prizeIndex > maxPrizes) {
            prizeIndex = 1;
          }
        
          // Get the selected prize amount based on the index
          const prizeAmount = wheel.querySelector(`.number:nth-child(${prizeIndex}) span`).textContent;
        
          // Show an alert with the selected prize
          alert(`Congratulations! You won: ${prizeAmount}`);
        
          isSpinning = false; // Reset the flag to allow spinning again
        }, 4000);
      }
    };
});
  
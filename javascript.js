// DONE BY: Koh Yung Chun Ivan, S10262491

var cards = document.querySelectorAll('.product-box');


[...cards].forEach((card)=>{
    card.addEventListener('mouseover', function(){
        card.classList.add('is-hover');
    })
    card.addEventListener('mouseleave', function(){
        card.classList.remove('is-hover');
    })
})

document.addEventListener("DOMContentLoaded", function() {
    var videoElement = document.querySelector('video');
    videoElement.playbackRate = 0.75;
    var observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      });
    }, { threshold: 0.25 }); // 0.25 means 25% of the item is in view
  
    observer.observe(videoElement);
    // Load cart from local storage
    loadCartFromLocalStorage();

   
    
});

document.addEventListener('DOMContentLoaded', function () {
  var cartPopup = document.querySelector('.cart-popup');
  var cartLink = document.querySelector('.open-cart'); // Make sure to assign the proper class

  cartLink.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior

      // Toggle the right property of the cart-popup
      var currentRight = parseInt(cartPopup.style.right) || 0;
      var newRight = (currentRight === 0) ? -500 : 0;
      cartPopup.style.right = newRight + 'px';
  });
});

// Function to toggle the visibility of the cart popup
function toggleCart() {
  const cartPopup = document.querySelector('.cart-popup');
  cartPopup.style.right = cartPopup.style.right === '0px' ? '-500px' : '0px';
}
function showNotificationBanner(message) {
  var notificationBanner = document.getElementById('notification-banner');
  if (!notificationBanner) {
    // Create the banner if it does not exist
    notificationBanner = document.createElement('div');
    notificationBanner.id = 'notification-banner';
    notificationBanner.className = 'notification-banner';
    document.body.insertBefore(notificationBanner, document.body.firstChild); // Add it at the top of the body
  }
  
  // Set the message and make the banner visible
  notificationBanner.textContent = message;
  notificationBanner.style.display = 'block';
  notificationBanner.style.opacity = '1';
  
  // Use setTimeout to hide the banner after 3 seconds
  setTimeout(function() {
    notificationBanner.style.opacity = '0';
    // Set another timeout to hide the banner after the fade out transition
    setTimeout(function() {
      notificationBanner.style.display = 'none';
    }, 500); // This should match the transition time in the CSS
  }, 1200);
}

// Function to add items to the cart
function addToCart(productName, productPrice, productImage) {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  
  // Create a new cart item element
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  // Add the data-price attribute to the cart item
  cartItem.setAttribute('data-price', productPrice);

  // Create a delete button for the cart item
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart-delete-button');
  deleteButton.innerHTML = '&#10006;'; // Cross symbol
  deleteButton.addEventListener('click', function () {
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    // Remove the cart item when the delete button is clicked
    cartPopupContent.removeChild(cartItem);

    // Update the cart total by deducting the price of the deleted item
    const currentTotal = calculateTotalPrice();
    const newTotal = Math.max(0, currentTotal - productPrice); // Ensure the total doesn't go below 0
    updateCartTotal(newTotal);
    updateCartItemCount()
    updateCheckoutButtonVisibility()
    // Check if the cart is empty and show/hide the "Your Cart is Empty" message
    checkEmptyCart();
  });

  // Create an image element for the product
  const productImg = document.createElement('img');
  productImg.src = productImage;
  productImg.classList.add('cart-item-image'); // Add this class
  cartItem.appendChild(deleteButton); // Add the delete button before the image
  cartItem.appendChild(productImg);

  // Create a div for product details
  const productDetails = document.createElement('div');
  productDetails.classList.add('product-details');

  // Create a heading for the product name
  const productNameHeading = document.createElement('h6');
  productNameHeading.textContent = productName;

  // Create a span for the product price
  const productPriceSpan = document.createElement('span');
  productPriceSpan.textContent = `$${productPrice}`;

  

  productDetails.appendChild(productNameHeading);
  productDetails.appendChild(productPriceSpan);
  cartItem.appendChild(productDetails);

  // Add the cart item to the cart pop-up
  cartPopupContent.appendChild(cartItem);
  

  // Show notification banner
  showNotificationBanner('Shop the latest trends and timeless classics all in one place.');

  // Check if the cart has items and hide the "Your Cart is Empty" message
  checkEmptyCart();
  updateCartItemCount();
  // Update the cart total
  updateCartTotal();
  updateCheckoutButtonVisibility();
  saveCartToLocalStorage();
}
// Function to save cart data to local storage
function saveCartToLocalStorage() {
  const cartItems = document.querySelectorAll('.cart-item');
  const cartData = [];

  cartItems.forEach((cartItem) => {
    const itemName = cartItem.querySelector('.product-details h6').textContent;
    const itemPrice = parseFloat(cartItem.getAttribute('data-price'));
    const itemImage = cartItem.querySelector('.cart-item-image').src;

    const item = {
      name: itemName,
      price: itemPrice,
      image: itemImage,
    };

    cartData.push(item);
  });

  // Save cart data to local storage
  localStorage.setItem('cartData', JSON.stringify(cartData));
}
// Function to load cart data from local storage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cartData');
  if (cartData) {
    const parsedCartData = JSON.parse(cartData);

    // Clear existing cart items
    const cartPopupContent = document.querySelector('.cart-popup-content');
    cartPopupContent.innerHTML = '';

    // Add each item from local storage to the cart
    parsedCartData.forEach((item) => {
      addToCart(item.name, item.price, item.image);
    });

    // Update cart total and item count
    updateCartTotal();
    updateCartItemCount();
  }
}

// Call loadCartFromLocalStorage on page load
window.addEventListener('load', loadCartFromLocalStorage);
// Call saveCartToLocalStorage when removing items from the cart
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('cart-delete-button')) {
    removeFromCart(event.target.closest('.cart-item'));
  }
});
// Function to check if the cart is empty and show/hide the "Your Cart is Empty" message
function checkEmptyCart() {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  if (cartPopupContent.children.length === 0) {
    emptyCartMessage.style.display = 'block'; // Show the message if the cart is empty
  } else {
    emptyCartMessage.style.display = 'none'; // Hide the message if the cart has items
  }
}


function calculateTotalPrice() {
  const cartItems = document.querySelectorAll('.cart-item');
  let total = 0;

  cartItems.forEach((cartItem) => {
    const productPrice = parseFloat(cartItem.getAttribute('data-price'));
    total += productPrice;
  });

  return total;
}


// Function to update the cart total in the popup
function updateCartTotal() {
  const cartTotalElement = document.querySelector('.cart-total');
  const total = calculateTotalPrice();
  
  // Update the content of the total-amount span
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = total.toFixed(2);

  // Show or hide the cart-total based on the total value
  cartTotalElement.style.display = total > 0 ? 'block' : 'none';

  // Update the "Total" text (optional)
  //cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to remove items from the cart
function removeFromCart(cartItem) {
  cartItem.remove();
  
  // Save updated cart data to local storage
  saveCartToLocalStorage();
  
  // Update the cart total
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();
  updateCheckoutButtonVisibility()

  // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  const cartItems = document.querySelectorAll('.cart-item');
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block';
  } else {
    emptyCartMessage.style.display = 'none';
  }
}

function updateCartItemCount() {
  const cartItemCount = document.getElementById('cart-item-count');
  const cartItems = document.querySelectorAll('.cart-item');
  cartItemCount.textContent = cartItems.length;
}
function updateCheckoutButtonVisibility() {
  const checkoutButton = document.getElementById('checkout-button');
  const cartItems = document.querySelectorAll('.cart-item');
  
  // If there are items in the cart, show the checkout button; otherwise, hide it
  checkoutButton.style.display = cartItems.length > 0 ? 'block' : 'none';
}

/*
function checkout() {
  //Checkout
  alert("Proceeding to checkout!");

  const cartItems = document.querySelectorAll('.cart-item');
  const checkoutButton = document.getElementById('checkout-button')
  // Remove all items from local storage
  localStorage.removeItem('cartData');
  // Remove each cart item
  cartItems.forEach((cartItem) => {
    cartItem.remove();
  });
  // Close the checkout button
  checkoutButton.style.display = 'none';
  // Reset the cart total to 0
  const totalAmountSpan = document.getElementById('total-amount');
  totalAmountSpan.textContent = '0.00';

  // Hide the cart total
  const cartTotalElement = document.querySelector('.cart-total');
  cartTotalElement.style.display = 'none';

  // Check if the cart is empty and show/hide the "Your Cart is Empty" message
  const emptyCartMessage = document.querySelector('.empty-cart-title');
  if (cartItems.length === 0) {
    emptyCartMessage.style.display = 'block';
  } else {
    emptyCartMessage.style.display = 'none';
  }

  const totalAmount = calculateTotalPrice();
  const pointsEarned = totalAmount;
  console.log('Points to be earned from checkout:', pointsEarned);
  // Make sure this logs the correct value
  updateUserPoints(pointsEarned).then(() => {
    // Code here will run after updateUserPoints has finished.
    // This is where you should read the updated points from local storage
    // and update the UI accordingly.
    displayUserPoints();
  });
  

  // Update the cart total, item count, and check if the cart is empty
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();
  toggleCart();


  
}
*/

// Revised checkout function
async function checkout() {
  alert("Proceeding to checkout!");
  const cartItems = document.querySelectorAll('.cart-item');
  const totalAmount = calculateTotalPrice();
  const pointsEarned = totalAmount;

  try {
    // Ensure this function completes successfully
    await updateUserPoints(pointsEarned);

    // Clearing the cart and local storage
    localStorage.removeItem('cartData');
    cartItems.forEach(cartItem => cartItem.remove());

    // UI updates
    document.getElementById('checkout-button').style.display = 'none';
    document.getElementById('total-amount').textContent = '0.00';
    document.querySelector('.cart-total').style.display = 'none';
    document.querySelector('.empty-cart-title').style.display = 'block';
    updateCartItemCount();
    updateCartTotal();
    toggleCart();
  } catch (error) {
    console.error('Error during checkout:', error);
    alert("There was an issue during the checkout process. Please try again.");
  }
}

// Revised updateUserPoints function
async function updateUserPoints(pointsEarned) {
  const APIKEY = "65ab507be8b7cb2cc9ce52f9";
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    console.error('User is not logged in.');
    return;
  }

  const queryURL = `https://fedassignment2-7f7e.restdb.io/rest/mori-user?q={"user-name": "${loggedInUser}"}`;

  try {
    const getUserResponse = await fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY
      }
    });

    const users = await getUserResponse.json();

    if (users.length > 0) {
      const user = users[0];
      const updatedPoints = (user.points || 0) + pointsEarned;
      const updateURL = `https://fedassignment2-7f7e.restdb.io/rest/mori-user/${user._id}`;

      const updateResponse = await fetch(updateURL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY
        },
        body: JSON.stringify({ "points": updatedPoints }) // This should match your database field
      });

      if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

      const updatedUser = await updateResponse.json();
      console.log("Points updated:", updatedUser);

      // Ensure local storage is updated here
      localStorage.setItem('userPoints', updatedUser.points);
      displayUserPoints();
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error('Error updating points:', error);
    // Handle errors appropriately
  }
}



function displayUserPoints() {
  const points = localStorage.getItem('userPoints');
  const pointsDisplayElement = document.getElementById('user-points');
  
  if (pointsDisplayElement && points) {
    pointsDisplayElement.textContent = `Your Points: ${points}`;
  } else {
    console.log('Points display element or points not found.');
  }
}

// Call this function on page load to display points
document.addEventListener("DOMContentLoaded", function () {
  displayUserPoints();
});


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




// API

document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65ab507be8b7cb2cc9ce52f9";
  adjustCartCountPosition();
  // Check if the sign-up form exists on the current page
  const signUpButton = document.getElementById("contact-submit");
  if (signUpButton) {
      signUpButton.addEventListener("click", function (e) {
          e.preventDefault();

          let userName = document.getElementById("user-name").value;
          let userEmail = document.getElementById("user-email").value;
          let userPwd = document.getElementById("user-pwd").value;
          
          let jsondata = {
              "user-name": userName,
              "user-email": userEmail,
              "user-pwd": userPwd,
              "points": 0 // Explicitly set to 0 for new users
          };
      
          let settings = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "x-apikey": APIKEY,
                  "Cache-Control": "no-cache"
              },
              body: JSON.stringify(jsondata)
          };

          fetch("https://fedassignment2-7f7e.restdb.io/rest/mori-user", settings)
              .then(response => response.json())
              .then(data => {
                  console.log(data);
                  // Check if points exist in response
                  const points = data.points !== undefined ? data.points : 0;
                  localStorage.setItem('loggedInUser', userName);
                  localStorage.setItem('userPoints', points); // Set to 0 if undefined
                  updateUserDisplay(userName);
                  displayUserPoints(points); // Display the points
                  document.getElementById("add-contact-form").reset();
                  window.location.href = 'index.html';
              })
              .catch(error => {
                  console.error('Error creating account:', error);
              });
      });
  }

  // Check if the login form exists on the current page
  const loginButton = document.getElementById("login-submit");

  if (loginButton) {
    loginButton.addEventListener("click", function (e) {
      e.preventDefault();

      let loginEmail = document.getElementById("user-email").value.trim();
      let loginPassword = document.getElementById("user-pwd").value.trim();

      if (!loginEmail || !loginPassword) {
        alert("Please enter both email and password.");
        return;
      }

      let queryURL = `https://fedassignment2-7f7e.restdb.io/rest/mori-user?q={"user-email": "${loginEmail}", "user-pwd": "${loginPassword}"}`;

      fetch(queryURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": APIKEY,
        }
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed. Please check your credentials.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const user = data[0];
          localStorage.setItem("loggedInUser", user["user-name"]);
          // Assume the server sends back the points in the response
          localStorage.setItem("userPoints", user.points); 
          updateUserDisplay(user["user-name"]);
          // Update the points display with the retrieved points
          displayUserPoints(user.points);
          document.getElementById("login-contact-form").reset();
          window.location.href = 'index.html';
        } else {
          alert("No user found with these credentials.");
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert(error.message);
      });
    });
  }

  function adjustCartCountPosition() {
    const cartItemCount = document.getElementById('cart-item-count');
    if (!cartItemCount) return; // Exit if cart item count doesn't exist

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // User is logged in, adjust the position of the cart count
        cartItemCount.classList.add('user-logged-in');
    } else {
        // User is not logged in, set the position back to default
        cartItemCount.classList.remove('user-logged-in');
    }
  }
  
  

  function updateUserDisplay(userName) {
    const userDisplayElement = document.getElementById('user-display');
    const loginButton = document.getElementById('login-button');
    const signUpButton = document.getElementById('signup-button');
    const cartItemCount = document.getElementById('cart-item-count');
    const logoutDropdown = document.querySelector('.dropdown'); // Make sure this selector matches your dropdown


    if (!userName) {
      userDisplayElement.style.display = 'none';
      loginButton.style.display = 'block';
      signUpButton.style.display = 'block';
      cartItemCount.classList.remove('user-logged-in');
      logoutDropdown.style.display = 'none'; // Hide the logout dropdown
    } else {
      userDisplayElement.textContent = `Welcome, ${userName}`;
      userDisplayElement.style.display = 'block';
      loginButton.style.display = 'none';
      signUpButton.style.display = 'none';
      cartItemCount.classList.add('user-logged-in');
      logoutDropdown.style.display = 'block'; // Show the logout dropdown
    }
  }

  function handleLogout() {
    // Clear all user-specific information from localStorage
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userPoints'); // Make sure to remove the points
    
    // Update UI to reflect the user is logged out
    updateUserDisplay(null); // Reset the user display
    displayUserPoints(); // Reset the points display
    adjustCartCountPosition(); // Adjust the cart count position if necessary
    
    // Optionally, reload the page to ensure all user data is cleared from the UI
    window.location.reload();
  }


  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
      logoutButton.addEventListener('click', handleLogout); // Just pass the function reference here
  }

  // Check if user is logged in when the page loads
  const loggedInUser = localStorage.getItem('loggedInUser');
  updateUserDisplay(loggedInUser); // This will set the correct UI state on page load

});



// Second game (Snake game)
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

const gameOverSound = new Audio('photos/gameover.mp3'); // Make sure the path is correct

gameOverSound.load(); // Preload the game over sound

const eatSoundPath = 'photos/eatsound.mp3'; // Make sure the path is correct



let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const eat = () => {
  let soundToPlay = new Audio(eatSoundPath);
  soundToPlay.play();
};

const handleGameOver = () => {
    gameOverSound.currentTime = 0; // Rewind to the start
    gameOverSound.play();
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        eat();
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);

/*
// Second game (Snake game)
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// Load sound files
const eatSound = new Audio('photos/eatsound.mp3'); // Make sure the path is correct
const gameOverSound = new Audio('photos/gameover.mp3'); // Make sure the path is correct
eatSound.load(); // Preload the eating sound
gameOverSound.load(); // Preload the game over sound
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[5, 5]]; // Initialize the snake body with one segment
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const eat = () => {
    eatSound.currentTime = 0;
    eatSound.play();
};

const handleGameOver = () => {
    gameOverSound.currentTime = 0; // Rewind to the start
    gameOverSound.play();
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

document.addEventListener("keydown", changeDirection);

const initGame = () => {
  if (gameOver) {
      handleGameOver();
  } else {
      if (snakeX === foodX && snakeY === foodY) {
          eat();
          // Determine the new segment position based on the last segment in the snakeBody
          const lastSegment = snakeBody[snakeBody.length - 1];
          const newSegment = [lastSegment[0] - velocityX, lastSegment[1] - velocityY];
          snakeBody.push(newSegment); // Add the new segment to the snake's body
          score++;
          updateFoodPosition(); // Update food position after snake has grown
          highScore = Math.max(score, highScore);
          localStorage.setItem("high-score", highScore);
          scoreElement.innerText = `Score: ${score}`;
          highScoreElement.innerText = `High Score: ${highScore}`;
      }

      // Move snake body
      for (let i = snakeBody.length - 1; i > 0; i--) {
          snakeBody[i] = [...snakeBody[i - 1]];
      }
      
      // Update the head position
      snakeX += velocityX;
      snakeY += velocityY;
      snakeBody[0] = [snakeX, snakeY];

      // Check for collision with the walls
      if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
          gameOver = true;
          return;
      }

      // Check for self collision
      for (let i = 1; i < snakeBody.length; i++) {
          if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
              gameOver = true;
              return;
          }
      }

      // Render the snake and food
      playBoard.innerHTML = '';
      // Render the snake body
      snakeBody.forEach((segment, index) => {
          const snakeElement = document.createElement('div');
          snakeElement.style.gridArea = `${segment[1]} / ${segment[0]}`;
          snakeElement.classList.add(index === 0 ? 'head' : 'body');
          playBoard.appendChild(snakeElement);
      });

      // Render the food
      const foodElement = document.createElement('div');
      foodElement.style.gridArea = `${foodY} / ${foodX}`;
      foodElement.classList.add('food');
      playBoard.appendChild(foodElement);
  }
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
*/
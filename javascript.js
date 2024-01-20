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

// Function to add items to the cart
function addToCart(productName, productPrice, productImage) {
  const cartPopupContent = document.querySelector('.cart-popup-content');
  
  // Create a new cart item element
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');

  // Create a delete button for the cart item
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('cart-delete-button');
  deleteButton.innerHTML = '&#10006;'; // Cross symbol
  deleteButton.addEventListener('click', function () {
    // Remove the cart item when the delete button is clicked
    cartPopupContent.removeChild(cartItem);
    updateCartItemCount()
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

  // Show the cart pop-up
  const cartPopup = document.querySelector('.cart-popup');
  cartPopup.style.right = '0px';

  // Check if the cart has items and hide the "Your Cart is Empty" message
  checkEmptyCart();
  updateCartItemCount();
  // Update the cart total
  updateCartTotal();
}

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

  // Update the "Total" text (optional)
  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
}

// Function to remove items from the cart
function removeFromCart(cartItem) {
  cartItem.remove();
  
  // Update the cart total
  updateCartTotal();
  updateCartItemCount();
  checkEmptyCart();

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






// FOR API
document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65ab507be8b7cb2cc9ce52f9";
  getContacts();
  document.getElementById("update-contact-container").style.display = "none";
  document.getElementById("add-update-msg").style.display = "none";

  //[STEP 1]: Create our submit form listener
  document.getElementById("contact-submit").addEventListener("click", function (e) {
    // Prevent default action of the button 
    e.preventDefault();

    let userName = document.getElementById("user-name").value;
    let userEmail = document.getElementById("user-email").value;
    let userPwd = document.getElementById("user-pwd").value;
    

    //[STEP 3]: Get form values when the user clicks on send
    // Adapted from restdb API
    let jsondata = {
      "user-name": userName,
      "user-email": userEmail,
      "user-pwd": userPwd,
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      method: "POST", //[cher] we will use post to send info
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(jsondata),
      beforeSend: function () {
        //@TODO use loading bar instead
        // Disable our button or show loading bar
        document.getElementById("contact-submit").disabled = true;
        
      }
    }

    //[STEP 5]: Send our AJAX request over to the DB and print response of the RESTDB storage to console.
    fetch("https://fedassignment2-7f7e.restdb.io/rest/mori-user", settings)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        document.getElementById("contact-submit").disabled = false;
        //@TODO update frontend UI 
        document.getElementById("add-update-msg").style.display = "block";
        setTimeout(function () {
          document.getElementById("add-update-msg").style.display = "none";
        }, 3000);
        // Update our table 
        getContacts();
        // Clear our form using the form ID and triggering its reset feature
        document.getElementById("add-contact-form").reset();
      });
  });

  //[STEP] 6
  // Let's create a function to allow you to retrieve all the information in your contacts
  // By default, we only retrieve 10 results
  function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      method: "GET", //[cher] we will use GET to retrieve info
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    // Once we get the response, we modify our table content by creating the content internally. We run a loop to continuously add on data
    // RESTDb/NoSql always adds in a unique id for each data; we tap on it to have our data and place it into our links 
    fetch("https://fedassignment2-7f7e.restdb.io/rest/mori-user", settings)
      .then(response => response.json())
      .then(response => {
        let content = "";

        for (var i = 0; i < response.length && i < limit; i++) {
          //console.log(response[i]);
          //[METHOD 1]
          // Let's run our loop and slowly append content
          // We can use the normal string append += method
          /*
          content += "<tr><td>" + response[i].name + "</td>" +
            "<td>" + response[i].email + "</td>" +
            "<td>" + response[i].message + "</td>
            "<td>Del</td><td>Update</td</tr>";
          */

          //[METHOD 2]
          // Using our template literal method using backticks
          // Take note that we can't use += for template literal strings
          // We use ${content} because -> content += content 
          // We want to add on previous content at the same time
          content = `${content}<tr id='${response[i]._id}'>
          <td>${response[i].userName}</td>
          <td>${response[i].userEmail}</td>
          <td>${response[i].userPwd}</td>
          <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td>
          <td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-name='${response[i].userName}' data-sID='${response[i].userEmail}' data-sMentor='${response[i].userPwd}'>Update</a></td></tr>`;

        }

        //[STEP 9]: Update our HTML content
        // Let's dump the content into our table body
        document.getElementById("contact-list").getElementsByTagName("tbody")[0].innerHTML = content;

        document.getElementById("total-contacts").innerHTML = response.length;
      });
  }




});

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
    videoElement.playbackRate = 0.8;
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
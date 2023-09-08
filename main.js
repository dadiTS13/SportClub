const myWrapper = document.querySelector(".my-wrapper");
const myCarousel = document.querySelector(".my-carousel");
const firstMyCardWidth = myCarousel.querySelector(".my-card").offsetWidth;
const myArrowBtns = document.querySelectorAll(".my-wrapper i");
const myCarouselChildrens = [...myCarousel.children];

let isMyDragging = false,
 isMyAutoPlay = true,
  startMyX,
   startMyScrollLeft,
    timeoutMyId;

// Get the number of cards that can fit in the carousel at once
let myCardPerView = Math.round(myCarousel.offsetWidth / firstMyCardWidth);

// Insert copies of the last few cards to the beginning of carousel for infinite scrolling
myCarouselChildrens.slice(-myCardPerView).reverse().forEach(card => {
    myCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to the end of carousel for infinite scrolling
myCarouselChildrens.slice(0, myCardPerView).forEach(card => {
    myCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at the appropriate position to hide first few duplicate cards on Firefox
myCarousel.classList.add("no-transition");
myCarousel.scrollLeft = myCarousel.offsetWidth;
myCarousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
myArrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        myCarousel.scrollLeft += btn.id == "my-left" ? -firstMyCardWidth : firstMyCardWidth;
    });
});

const myDragStart = (e) => {
    isMyDragging = true;
    myCarousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startMyX = e.pageX;
    startMyScrollLeft = myCarousel.scrollLeft;
}

const myDragging = (e) => {
    if (!isMyDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    myCarousel.scrollLeft = startMyScrollLeft - (e.pageX - startMyX);
}

const myDragStop = () => {
    isMyDragging = false;
    myCarousel.classList.remove("dragging");
}

const myInfiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (myCarousel.scrollLeft === 0) {
        myCarousel.classList.add("no-transition");
        myCarousel.scrollLeft = myCarousel.scrollWidth - (2 * myCarousel.offsetWidth);
        myCarousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (Math.ceil(myCarousel.scrollLeft) === myCarousel.scrollWidth - myCarousel.offsetWidth) {
        myCarousel.classList.add("no-transition");
        myCarousel.scrollLeft = myCarousel.offsetWidth;
        myCarousel.classList.remove("no-transition");
    }

    // Clear the existing timeout & start autoplay if the mouse is not hovering over the carousel
    clearTimeout(timeoutMyId);
    if (!myWrapper.matches(":hover")) myAutoPlay();
}

const myAutoPlay = () => {
    if (window.innerWidth < 800 || !isMyAutoPlay) return; // Return if the window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutMyId = setTimeout(() => myCarousel.scrollLeft += firstMyCardWidth, 2500);
}
myAutoPlay();

myCarousel.addEventListener("mousedown", myDragStart);
myCarousel.addEventListener("mousemove", myDragging);
document.addEventListener("mouseup", myDragStop);
myCarousel.addEventListener("scroll", myInfiniteScroll);
myWrapper.addEventListener("mouseenter", () => clearTimeout(timeoutMyId));
myWrapper.addEventListener("mouseleave", myAutoPlay);

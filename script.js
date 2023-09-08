const customWrapper = document.querySelector(".custom-wrapper");
const customCarousel = document.querySelector(".custom-carousel");
const firstCustomCardWidth = customCarousel.querySelector(".custom-card").offsetWidth;
const customArrowBtns = document.querySelectorAll(".custom-wrapper i");
const customCarouselChildren = [...customCarousel.children];

let isCustomDragging = false,
    isCustomAutoPlay = true,
    startCustomX,
    startCustomScrollLeft,
    timeoutCustomId;

// Get the number of cards that can fit in the carousel at once
let customCardsPerView = Math.round(customCarousel.offsetWidth / firstCustomCardWidth);

// Insert copies of the last few cards to the beginning of carousel for infinite scrolling
customCarouselChildren.slice(-customCardsPerView).reverse().forEach(card => {
    customCarousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to the end of carousel for infinite scrolling
customCarouselChildren.slice(0, customCardsPerView).forEach(card => {
    customCarousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at the appropriate position to hide first few duplicate cards on Firefox
customCarousel.classList.add("no-transition");
customCarousel.scrollLeft = customCarousel.offsetWidth;
customCarousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
customArrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        customCarousel.scrollLeft += btn.id == "custom-left" ? -firstCustomCardWidth : firstCustomCardWidth;
    });
});

const customDragStart = (e) => {
    isCustomDragging = true;
    customCarousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startCustomX = e.pageX;
    startCustomScrollLeft = customCarousel.scrollLeft;
}

const customDragging = (e) => {
    if (!isCustomDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    customCarousel.scrollLeft = startCustomScrollLeft - (e.pageX - startCustomX);
}

const customDragStop = () => {
    isCustomDragging = false;
    customCarousel.classList.remove("dragging");
}

const customInfiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (customCarousel.scrollLeft === 0) {
        customCarousel.classList.add("no-transition");
        customCarousel.scrollLeft = customCarousel.scrollWidth - (2 * customCarousel.offsetWidth);
        customCarousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (Math.ceil(customCarousel.scrollLeft) === customCarousel.scrollWidth - customCarousel.offsetWidth) {
        customCarousel.classList.add("no-transition");
        customCarousel.scrollLeft = customCarousel.offsetWidth;
        customCarousel.classList.remove("no-transition");
    }

    // Clear the existing timeout & start autoplay if the mouse is not hovering over the carousel
    clearTimeout(timeoutCustomId);
    if (!customWrapper.matches(":hover")) customAutoPlay();
}

const customAutoPlay = () => {
    if (window.innerWidth < 800 || !isCustomAutoPlay) return; // Return if the window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutCustomId = setTimeout(() => customCarousel.scrollLeft += firstCustomCardWidth, 2500);
}
customAutoPlay();

customCarousel.addEventListener("mousedown", customDragStart);
customCarousel.addEventListener("mousemove", customDragging);
document.addEventListener("mouseup", customDragStop);
customCarousel.addEventListener("scroll", customInfiniteScroll);
customWrapper.addEventListener("mouseenter", () => clearTimeout(timeoutCustomId));
customWrapper.addEventListener("mouseleave", customAutoPlay);

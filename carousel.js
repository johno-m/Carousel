const carousel = document.getElementById("carousel")

let slide1, slide2, imageList, currentSlide = 0, newSlide, oldSlide, dotsContainer

/** Initial function */
function loadCarousel(page = 0, per_page = 20){
    carousel.innerHTML = ''
    // load images from Pexels API
    getData(`https://api.pexels.com/v1/curated/?page=${page}&per_page=${per_page}`)
        .then(data => {
            imageList = data.photos
            console.log(imageList)
            imageList.forEach(image => {
                preloadImage(image.url.original)
            })
            // build carousel
            constructCarousel(carousel)
        });
}

function constructCarousel(target){
    // Create elements
    const cont = document.createElement('div')
    slide1 = document.createElement('div') // global variable
    slide2 = document.createElement('div') // global variable
    const prevBtn = document.createElement('div')
    const nextBtn = document.createElement('div')
    const controlsButtons = document.createElement('div')
    const sliderControls = document.createElement('div')
    const controlsTop = document.createElement('div')
    const controlsBottom = document.createElement('div')
    dotsContainer = document.createElement('div') // global variable

    // Set classes
    cont.classList.add("carousel-container")
    slide1.classList.add("carousel-slide", "cover")
    slide2.classList.add("carousel-slide", "cover")
    prevBtn.classList.add("slide-btn")
    nextBtn.classList.add("slide-btn")
    controlsButtons.classList.add("controls-btns")
    controlsTop.classList.add("controls-top", "controls-narrow")
    controlsBottom.classList.add("controls-bottom", "controls-narrow")
    dotsContainer.classList.add("dots-container")

    // Set IDs
    sliderControls.id = "slider-controls"
    slide1.id = "slide-1"
    slide2.id = "slide-2"
    prevBtn.id = "prev-btn"
    nextBtn.id = "next-btn"

    slide1.style.backgroundImage = `url('${imageList[currentSlide].src.large}')`
    prevBtn.innerHTML = addButton('prev') // addButton() returns an SVG
    nextBtn.innerHTML = addButton('next') // addButton() returns an SVG

    // Append to DOM
    cont.appendChild(slide1)
    cont.appendChild(slide2)
    sliderControls.appendChild(controlsTop)
    controlsButtons.appendChild(prevBtn)
    controlsButtons.appendChild(nextBtn)
    controlsBottom.appendChild(dotsContainer)
    sliderControls.appendChild(controlsButtons)
    sliderControls.appendChild(controlsBottom)
    carousel.appendChild(cont)
    cont.appendChild(sliderControls)

    // update listed slides for obscelecense referencers
    newSlide = slide1
    oldSlide = slide2


    addDots()
    setActiveDot()
    
    // add click listeners
    nextBtn.addEventListener('click', function(){ slideButtonClick('next') }, false)
    prevBtn.addEventListener('click', function(){ slideButtonClick('prev') }, false)
}

/** Function to cycle through the dots to set correct classes */
function setActiveDot(){
    let dots = document.getElementsByClassName("dot")
    for(let i = 0; i < dots.length; i++){
        if(currentSlide == i){
            dots[i].classList.add("activeDot")
        } else {
            dots[i].classList.remove("activeDot")
        }
        
    }
}

/** Function to add the dots to the DOM */
function addDots(){
    imageList.forEach((image, index) => {
        let dot = document.createElement('div')
        dot.classList.add("dot")
        dot.id = "dot-"+index
        dotsContainer.appendChild(dot)
    })
}

function addButton(option){
    if(option == "next"){
        return `<svg width="3.5em" height="3.5em" viewBox="0 0 16 16" class="bi bi-arrow-right-circle-fill" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-11.5.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5z"/>
      </svg>`
    } else if(option == "prev"){
        return `<svg width="3.5em" height="3.5em" viewBox="0 0 16 16" class="bi bi-arrow-left-circle-fill" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5.5a.5.5 0 0 0 0-1H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5z"/>
      </svg>`
    } else {
        return false
    }
}

/** Click handling function */
function slideButtonClick(direction){
    let imageWidth = carousel.offsetWidth
    /** To x for outgoing slide */
    let to
    // slide out
    if(direction == 'prev'){
        to = imageWidth * -1
        currentSlide--
        if(currentSlide < 0) {
            currentSlide = imageList.length - 1 
        }
        slide2.style.left = imageWidth+'px'
        from = imageWidth+'px'
    } else {
        to = imageWidth
        currentSlide++
        if(currentSlide >= imageList.length) {
            currentSlide = 0 
        }
        slide2.style.left = 0 - imageWidth+'px'
        from = (0 - imageWidth)+'px'
    }

    if(newSlide == slide1){
        newSlide = slide2
        oldSlide = slide1
    } else {
        newSlide = slide1
        oldSlide = slide2
    }
    
    console.log(currentSlide)
    console.log("next image is "+imageList[currentSlide].url)
    setActiveDot()   
    animateSlides(direction)
}

/** Load 20 images from Pexels API */ 
async function getData(url = '') {
    if(url != ''){
        const response = await fetch(url, { headers: { 'Authorization': '563492ad6f9170000100000102f36ff4c6454d1f81efc01679d1083d' } });
        return response.json();
    }
}

/** Function to deal with slide animations */
function animateSlides(direction){
    let imageWidth = carousel.offsetWidth
    let from
    let oldTo

    if(direction == "prev"){
        from = imageWidth + 'px'
        oldTo = (0 - imageWidth) + 'px'
    } else {
        from = (0 - imageWidth) + 'px'
        oldTo = imageWidth + 'px'
    }

    newSlide.style.backgroundImage = `url('${imageList[currentSlide].src.large}')`
    
    doAnimation(oldSlide, from, oldTo)
    doAnimation(newSlide, from, '0px')

    function doAnimation(target, start, end){
        target.style.left = end
        target.animate([
            { transform: 'translateX('+start+')' }, 
            { transform: 'translateX(0px)' }
        ], { 
        // timing options
            duration: 400,
            easing: 'ease-in-out'
        });
    }
}

/** Function to preload images before they are called to increase UX */
function preloadImage(url)
{
    var img=new Image();
    img.src=url;
}


// Load the carousel

loadCarousel()
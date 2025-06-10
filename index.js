// Global Variables

let fullsizeBG = document.getElementById("fullsize-bg");
let fullsizeImage = document.getElementById("full-img");
let fullsizeVideo = document.getElementById("full-vid");


// Navigation 

let galleryEntries = document.querySelectorAll('.entry')


let exitFullsize = function (){
    fullsizeBG.classList.add("hidden");

    fullsizeImage.classList.add("hidden");
    fullsizeVideo.classList.add("hidden");
    fullsizeVideo.muted = true;
}


let fullsizeIndex = -1;

let galleryNext = function() {
    if (fullsizeIndex + 1 >= galleryEntries.length) return;
    fullsizeIndex++;

    let galleryEntry = galleryEntries[fullsizeIndex];
    galleryEntry.onclick();
}

let galleryPrev = function() {
    if (fullsizeIndex - 1 < 0) return;
    fullsizeIndex--;

    let galleryEntry = galleryEntries[fullsizeIndex];
    galleryEntry.onclick();
}

fullsizeBG.onclick = exitFullsize;

document.body.addEventListener('keydown', function(event) {
    if (fullsizeBG.classList.contains("hidden")) return;
    
    if (event.key == "Escape")
        exitFullsize();
    else if (event.key == "ArrowLeft")
        galleryPrev();
    else if (event.key == "ArrowRight" || event.key == " ")
        galleryNext();
    
    event.preventDefault();
});


// Gallery Entry Connections

galleryEntries.forEach(
    (galleryEntry, idx) =>{

        let vid = galleryEntry.querySelector('video')
        if (vid){  // Set every video's mute, autoplay, and loop attribute.
            vid.muted = true;
            vid.autoplay = true;
            vid.loop = true;
            vid.play();
        }

        galleryEntry.onclick = () =>{  // show fullsize
            fullsizeBG.classList.remove("hidden");
            
            fullsizeImage.classList.add("hidden");
            fullsizeVideo.classList.add("hidden");

            setTimeout(
                ()=>{
                    let img = galleryEntry.querySelector('img');
                    if (img){
                        fullsizeImage.src = img.src;
                        fullsizeImage.classList.remove("hidden");
                    }
                    else if (vid){
                        fullsizeVideo.src = vid.src;
                        fullsizeVideo.classList.remove("hidden");
                    }

                    fullsizeIndex = idx;
                }, 
            140)
        }
    }
);

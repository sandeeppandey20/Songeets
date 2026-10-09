
console.log("Welcome to Songeets!");

// ELEMENTS
let audioElement = document.getElementById('myAudio');
let MasterPlay = document.getElementById('MasterPlay');
let PlayIcon = document.getElementById('PlayIcon');
let PauseIcon = document.getElementById('PauseIcon');
let MyProgressBar = document.getElementById('MyProgressBar');
let gif = document.getElementById('gif');
let SongTitle = document.getElementById('SongTitle');
let CurrentTime = document.getElementById('CurrentTime');
let Duration = document.getElementById('Duration');
let Previous = document.getElementById('Previous');
let Next = document.getElementById('Next');

let SongItems = Array.from(document.querySelectorAll('.SongItem'));

// SONG LIST
let Songs = [
    { SongName: "Perfect", FilePath: "Audios/1mp3.mp3", CoverPath: "Images/1Cover.jpg" },
    { SongName: "End of Beginning", FilePath: "Audios/2mp3.mp3", CoverPath: "Images/2Cover.jpg" },
    { SongName: "Snowman", FilePath: "Audios/3mp3.mp3", CoverPath: "Images/3Cover.jpg" },
    { SongName: "CO2", FilePath: "Audios/4mp3.mp3", CoverPath: "Images/4Cover.jpg" },
    { SongName: "I think they call this love", FilePath: "Audios/5mp3.mp3", CoverPath: "Images/5Cover.jpg" },
    { SongName: "Sailor song", FilePath: "Audios/6mp3.mp3", CoverPath: "Images/6Cover.jpg" }
];

let SongIndex = 0;

// FORMAT TIME
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return minutes + ":" + String(secs).padStart(2, "0");
}

// UPDATE BOTTOM PLAY BUTTON AND GIF
function updatePlayUI(isPlaying) {
    PlayIcon.style.display = isPlaying ? "none" : "inline";
    PauseIcon.style.display = isPlaying ? "inline" : "none";

    gif.style.opacity = isPlaying ? "1" : "0";
    SongTitle.style.opacity = isPlaying ? "1" : "0";
}

// UPDATE ALL SIX SONG-ROW ICONS
function updateSongIcons() {
    SongItems.forEach(function(item, index) {
        let play = item.querySelector(".RowPlayIcon");
        let pause = item.querySelector(".RowPauseIcon");

        if (!play || !pause) return;

        let isCurrentPlaying = index === SongIndex && !audioElement.paused;

        play.style.display = isCurrentPlaying ? "none" : "inline";
        pause.style.display = isCurrentPlaying ? "inline" : "none";
    });
}

// LOAD AND PLAY A SONG
function playSong(index) {
    SongIndex = (index + Songs.length) % Songs.length;

    audioElement.src = Songs[SongIndex].FilePath;
    audioElement.load();

    SongTitle.textContent = Songs[SongIndex].SongName;
    CurrentTime.textContent = "0:00";
    Duration.textContent = "0:00";
    MyProgressBar.value = 0;

    updateSongIcons();

    audioElement.play().catch(function(error) {
        console.error("Playback error:", error);
    });
}

// BOTTOM PLAY / PAUSE
MasterPlay.addEventListener("click", function() {
    if (audioElement.paused) {
        audioElement.play().catch(function(error) {
            console.error("Playback error:", error);
        });
    } else {
        audioElement.pause();
    }
});

// PREVIOUS SONG: only ONE listener
Previous.addEventListener("click", function() {
    playSong(SongIndex - 1);
});

// NEXT SONG: only ONE listener
Next.addEventListener("click", function() {
    playSong(SongIndex + 1);
});

// INDIVIDUAL SONG PLAY / PAUSE
SongItems.forEach(function(item, index) {
    let songControl = item.querySelector(".timestamp");

    if (!songControl) return;

    songControl.style.cursor = "pointer";

    songControl.addEventListener("click", function() {
        if (SongIndex === index) {
            if (audioElement.paused) {
                audioElement.play().catch(function(error) {
                    console.error("Playback error:", error);
                });
            } else {
                audioElement.pause();
            }
        } else {
            playSong(index);
        }
    });
});

// KEEP BOTH SETS OF ICONS SYNCHRONISED
audioElement.addEventListener("play", function() {
    updatePlayUI(true);
    updateSongIcons();
});

audioElement.addEventListener("pause", function() {
    updatePlayUI(false);
    updateSongIcons();
});

// UPDATE DURATION
audioElement.addEventListener("loadedmetadata", function() {
    Duration.textContent = formatTime(audioElement.duration);
});

// UPDATE CURRENT TIME AND SEEKBAR
audioElement.addEventListener("timeupdate", function() {
    CurrentTime.textContent = formatTime(audioElement.currentTime);

    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
        MyProgressBar.value =
            (audioElement.currentTime / audioElement.duration) * 100;
    }
});

// DRAG SEEKBAR TO SEEK
MyProgressBar.addEventListener("input", function() {
    if (Number.isFinite(audioElement.duration) && audioElement.duration > 0) {
        audioElement.currentTime =
            (Number(MyProgressBar.value) / 100) * audioElement.duration;
    }
});

// AUTOMATICALLY PLAY NEXT SONG AT THE END
audioElement.addEventListener("ended", function() {
    playSong(SongIndex + 1);
});

// INITIAL STATE
updatePlayUI(false);
updateSongIcons();

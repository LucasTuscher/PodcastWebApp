// Definiere die Audio-Instanz außerhalb der Funktion
let audioPlayer = new Audio();
// Speichert den aktuellen Player und dessen Play/Pause-Status
let currentPlayer = null;
let isPlaying = false;
// Neue Variable zum Speichern des aktuellen Podcasts
let currentPodcastData = null;
let podcastDataForwardAndBackward;
// Funktion zum Rendern der Episoden
function renderEpisodes(podcastData) {
    podcastDataForwardAndBackward = podcastData;
    const container = document.querySelector('.podcastdetail-episode-list-content');
    if (!container) {
        console.error('Container-Element nicht gefunden');
        return;
    }
    let content = '';
    const encodedPodcastData = base64EncodeUnicode(JSON.stringify(podcastData));
    podcastData.episodes.episodes.forEach((episode, index)=>{
        const episodeClass = index % 2 === 0 ? 'episode-even' : 'episode-odd';
        content += `
            <div class="podcastdetail-episode main-container ${episodeClass}" id="episode-${index}">
                <div class="left-container-episode-number"> 
                    <h1>${index + 1}</h1>
                </div>
                <div class="left-container">
                    <div class="left-content">
                        <h1>${episode.title}</h1>
                    </div>
                </div>
                <div class="right-container">
                    <div class="right-content">
                        <p>${episode.duration_string}</p>
                        <button class="play-button" 
                                data-index="${index}"
                                data-podcast="${encodedPodcastData}"
                                data-episode-mp3="${episode.enclosure}">Play</button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = content;
    container.addEventListener('click', function(event) {
        if (event.target.classList.contains('play-button')) {
            const index = event.target.dataset.index;
            const encodedPodcastData = event.target.dataset.podcast;
            const podcastData = JSON.parse(base64DecodeUnicode(encodedPodcastData));
            const episodeMP3 = event.target.dataset.episodeMp3;
            playEpisode(index, podcastData, episodeMP3);
        }
    });
    const playFirstEpisodeButton = document.querySelector('.content-playbutton');
    if (playFirstEpisodeButton) playFirstEpisodeButton.addEventListener('click', function() {
        playEpisode(0, podcastData, podcastData.episodes.episodes[0].enclosure);
    });
}
document.addEventListener('DOMContentLoaded', function() {
    const sliderEl = document.querySelector("#fullscreen-player-range-js");
    const volumeIcon = document.querySelector('.player-fullscreen-inner-volume-icon');
    if (sliderEl) {
        const initialVolume = sliderEl.value / 50;
        audioPlayer.volume = initialVolume;
        updateSliderBackground(sliderEl);
        updateVolumeIcon(initialVolume);
        sliderEl.addEventListener("input", (event)=>{
            const tempSliderValue = event.target.value;
            updateSliderBackground(sliderEl);
            if (currentPlayer) {
                currentPlayer.volume = tempSliderValue / 50;
                updateVolumeIcon(currentPlayer.volume);
            }
        });
        function updateSliderBackground(slider) {
            const progress = slider.value / slider.max * 100;
            slider.style.background = `linear-gradient(to right, #79b4c9 ${progress}%, #161c25 ${progress}%)`;
        }
        function updateVolumeIcon(volume) {
            if (volumeIcon) {
                if (volume === 0) {
                    volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
                    volumeIcon.classList.add('fa-volume-off');
                } else if (volume <= 0.5) {
                    volumeIcon.classList.remove('fa-volume-off', 'fa-volume-up');
                    volumeIcon.classList.add('fa-volume-down');
                } else {
                    volumeIcon.classList.remove('fa-volume-off', 'fa-volume-down');
                    volumeIcon.classList.add('fa-volume-up');
                }
            }
        }
    }
});
function playEpisode(index, podcastData, episodeMP3) {
    const episode = podcastData.episodes.episodes[index];
    updatePlayer(episode);
    setAudioSourceAndPlay(episodeMP3);
    currentPlayer = audioPlayer;
    const sliderEl = document.querySelector("#fullscreen-player-range-js");
    if (sliderEl) currentPlayer.volume = sliderEl.value / 50;
    // Aktualisiere das aktuelle PodcastData
    currentPodcastData = podcastData;
    podcastDataForwardAndBackward = podcastData;
    updatePlayButton(true);
    monitorPlayback();
}
function updatePlayer(episode) {
    const playerImage = document.getElementById('player-image');
    const playerTitle = document.getElementById('player-title');
    const playerImagePodcastIcon = document.querySelector('.podcast-player-image-icon');
    const playerNoActiveTitle = document.getElementById('player-not-active');
    playerImage.src = episode.imgURL;
    playerTitle.textContent = episode.title;
    playerImage.style.display = 'block';
    playerTitle.style.display = '-webkit-box';
    playerNoActiveTitle.style.display = 'none';
    playerImagePodcastIcon.style.display = 'none';
    const fullscreenPlayerImage = document.getElementById('fullscreen-player-image');
    const fullscreenStandartIcon = document.querySelector(".player-fullscreen-inner-musik_icon");
    fullscreenPlayerImage.src = episode.imgURL;
    fullscreenPlayerImage.style.display = 'block';
    fullscreenStandartIcon.style.display = 'none';
}
function setAudioSourceAndPlay(source) {
    audioPlayer.src = source;
    audioPlayer.play();
    isPlaying = true;
    monitorPlayback();
}
document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.querySelector('.podcast-player-play');
    if (playButton) playButton.addEventListener('click', togglePlay);
    const fullscreenPlayButton = document.querySelector('.fullscreen-podcast-player-play');
    if (fullscreenPlayButton) fullscreenPlayButton.addEventListener('click', togglePlay);
});
function togglePlay() {
    if (currentPlayer) {
        if (currentPlayer.paused) {
            currentPlayer.play();
            isPlaying = true;
            setTimeRangeDisabled(false);
        } else {
            currentPlayer.pause();
            isPlaying = false;
            setTimeRangeDisabled(true);
        }
        updatePlayButton(isPlaying);
    }
}
function updatePlayButton(isPlaying) {
    const playButton = document.querySelector('.podcast-player-play');
    if (!playButton) return;
    const fullscreenPlayButton = document.querySelector('.fullscreen-podcast-player-play');
    if (!fullscreenPlayButton) return;
    const fullscreenPlayIcon = fullscreenPlayButton.querySelector('.player-fullscreen-inner-play_system-icon.fa-solid.fa-play');
    const fullscreenStopIcon = fullscreenPlayButton.querySelector('.player-fullscreen-inner-play_system-icon.fa-solid.fa-pause');
    const playIcon = playButton.querySelector('.fa-play');
    const stopIcon = playButton.querySelector('.fa-pause');
    if (isPlaying) {
        playIcon.style.display = 'none';
        stopIcon.style.display = 'inline';
        fullscreenPlayIcon.style.display = 'none';
        fullscreenStopIcon.style.display = 'inline';
    } else {
        playIcon.style.display = 'inline';
        stopIcon.style.display = 'none';
        fullscreenPlayIcon.style.display = 'inline';
        fullscreenStopIcon.style.display = 'none';
    }
}
function playNextEpisode() {
    if (currentPlayer && currentPodcastData) {
        let currentEpisodeIndex = getCurrentEpisodeIndex();
        if (currentEpisodeIndex < currentPodcastData.episodes.episodes.length - 1) playEpisode(currentEpisodeIndex + 1, currentPodcastData, currentPodcastData.episodes.episodes[currentEpisodeIndex + 1].enclosure);
    }
}
function playPreviousEpisode() {
    if (currentPlayer && currentPodcastData) {
        let currentEpisodeIndex = getCurrentEpisodeIndex();
        if (currentEpisodeIndex > 0) playEpisode(currentEpisodeIndex - 1, currentPodcastData, currentPodcastData.episodes.episodes[currentEpisodeIndex - 1].enclosure);
    }
}
function getCurrentEpisodeIndex() {
    const currentSrc = audioPlayer.src;
    return currentPodcastData.episodes.episodes.findIndex((episode)=>episode.enclosure === currentSrc);
}
document.addEventListener('DOMContentLoaded', function() {
    const forwardButton = document.querySelector('.podcast-player-forward');
    const backwardButton = document.querySelector('.podcast-player-backward');
    const fullscreenForwardButton = document.querySelector('.player-fullscreen-inner-play_system-icon.fa-solid.fa-forward');
    const fullscreenBackwardButton = document.querySelector('.player-fullscreen-inner-play_system-icon.fa-solid.fa-backward');
    if (forwardButton) forwardButton.addEventListener('click', playNextEpisode);
    if (backwardButton) backwardButton.addEventListener('click', playPreviousEpisode);
    if (fullscreenForwardButton) fullscreenForwardButton.addEventListener('click', playNextEpisode);
    if (fullscreenBackwardButton) fullscreenBackwardButton.addEventListener('click', playPreviousEpisode);
});
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
function updateTimeSliderBackground() {
    const timeRange = document.getElementById('fullscreen-player-time-range');
    if (timeRange && currentPlayer) {
        const progress = currentPlayer.currentTime / currentPlayer.duration * 100;
        timeRange.style.background = `linear-gradient(to right, #79b4c9 ${progress}%, #161c25 ${progress}%)`;
    }
}
function setTimeRangeDisabled(disabled) {
    const timeRange = document.getElementById('fullscreen-player-time-range');
    if (timeRange) timeRange.disabled = disabled;
}
function updateTimeDisplay() {
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const timeRange = document.getElementById('fullscreen-player-time-range');
    if (currentPlayer && !currentPlayer.paused && !currentPlayer.ended) {
        const currentTime = currentPlayer.currentTime;
        const duration = currentPlayer.duration;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
        if (!timeRange.hasAttribute('data-user-interaction')) {
            timeRange.value = currentTime / duration * 100;
            updateTimeSliderBackground();
        }
    }
}
function monitorPlayback() {
    if (currentPlayer) {
        currentPlayer.addEventListener('timeupdate', updateTimeDisplay);
        currentPlayer.addEventListener('loadedmetadata', updateTimeDisplay);
        currentPlayer.addEventListener('play', ()=>{
            setTimeRangeDisabled(false);
        });
        currentPlayer.addEventListener('pause', ()=>{
            setTimeRangeDisabled(true);
        });
        currentPlayer.addEventListener('ended', ()=>{
            setTimeRangeDisabled(true);
        });
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const timeRange = document.getElementById('fullscreen-player-time-range');
    if (timeRange) {
        timeRange.addEventListener('input', handleTimeRangeInput);
        timeRange.addEventListener('mousedown', function() {
            timeRange.setAttribute('data-user-interaction', 'true');
        });
        timeRange.addEventListener('mouseup', function() {
            timeRange.removeAttribute('data-user-interaction');
        });
        timeRange.addEventListener('change', function() {
            const newTime = timeRange.value / 100 * currentPlayer.duration;
            currentPlayer.currentTime = newTime;
            updateTimeDisplay();
        });
    }
});
function handleTimeRangeInput(event) {
    if (!currentPlayer) return;
    const timeRange = event.target;
    const newTime = timeRange.value / 100 * currentPlayer.duration;
    currentPlayer.currentTime = newTime;
    updateTimeDisplay();
}
// DOM für die Zurück gehen Funktion des Player wenn Musik abgespielt wird
document.addEventListener('DOMContentLoaded', function() {
    const backPodcastButton = document.querySelector('.podcast-player-back-podcast');
    if (backPodcastButton) backPodcastButton.addEventListener('click', async function() {
        if (currentPodcastData) try {
            // Rufe die Details des aktuellen Podcasts ab und navigiere zur Detailseite
            await loadPodcastDetailsAndNavigate(currentPodcastData);
        } catch (error) {
            console.error('Fehler beim Navigieren zu den Podcast-Details:', error);
        }
        else console.log('Kein Podcast ist geladen.');
    });
});

//# sourceMappingURL=public.a6803ea3.js.map

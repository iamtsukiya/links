/* =========================================
   1. CORE INTERACTIVITY (Overlay & Audio)
   ========================================= */
const overlay = document.getElementById('overlay');
const video = document.getElementById('bg-video');
const audio = document.getElementById('bg-audio');
const card = document.getElementById('content-card');
const muteBtn = document.getElementById('mute-btn');

// Start volume low
audio.volume = 0.3;

overlay.addEventListener('click', () => {
    // 1. Hide Overlay
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none'; // Pass clicks through

    // 2. Play Media
    video.play();
    audio.play();

    // 3. Show Profile Card
    card.style.opacity = '1';
});

// Mute Toggle Logic
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (audio.muted) {
            audio.muted = false;
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            audio.muted = true;
            muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });
}

/* =========================================
   2. LAST.FM INTEGRATION
   ========================================= */
const lastFmUsername = "iamtsukiya"; 
const lastFmApiKey = "e24726c8331fbea24769718c32029b45";

async function fetchLastFmStats() {
    try {
        const userInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json`;
        const recentTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${lastFmApiKey}&limit=1&format=json`;

        const [userInfoRes, recentTracksRes] = await Promise.all([
            fetch(userInfoUrl),
            fetch(recentTracksUrl)
        ]);

        const userData = await userInfoRes.json();
        const tracksData = await recentTracksRes.json();

        // Update User Stats
        if (userData.user) {
            const imgUrl = userData.user.image[2]['#text']; 
            if (imgUrl) document.getElementById('lf-avatar').src = imgUrl;
            
            const scrobbles = parseInt(userData.user.playcount).toLocaleString();
            document.getElementById('lf-stats').innerText = `${scrobbles} Scrobbles`;
        }

        // Update Now Playing
        const track = tracksData.recenttracks.track[0];
        const actionBtn = document.getElementById('lf-action');
        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

        if (isPlaying) {
            // NEW: No substring math. Just the full name wrapped in our CSS class.
            actionBtn.innerHTML = `<i class="fa-solid fa-music"></i> <span class="song-name-text">${track.name}</span>`;
            actionBtn.style.color = "#43b581"; // Green
        } else {
            // DEFAULT: Plain text, no special class needed
            actionBtn.innerHTML = `View Profile`;
            actionBtn.style.color = "#b90000"; // Red
        }

    } catch (error) {
        console.error("Last.fm Error:", error);
        document.getElementById('lf-stats').innerText = "Offline";
    }
}

fetchLastFmStats();
setInterval(fetchLastFmStats, 10000);

/* =========================================
   3. DISCORD STATUS (Lanyard API)
   ========================================= */
const discordID = "278137133183795201"; 

// Global variables to track state for the timer
let activeStartTimestamp = null;
let timerInterval = null;

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordID}`);
        const data = await response.json();

        if (data.success) {
            const discordData = data.data;
            
            // 1. Avatar & Dot
            const avatarHash = discordData.discord_user.avatar;
            document.querySelector('.card-avatar').src = `https://cdn.discordapp.com/avatars/${discordID}/${avatarHash}.png`;
            document.getElementById('discord-status-dot').className = `status-dot ${discordData.discord_status}`; 

            // 2. Text Elements
            const username = document.getElementById('discord-username');
            const activityName = document.getElementById('discord-activity');
            const details = document.getElementById('discord-details');
            const state = document.getElementById('discord-state');
            const timer = document.getElementById('discord-timer');
            username.innerText = discordData.discord_user.global_name || discordData.discord_user.username;
            
            // 3. Asset Elements
            const assetWrapper = document.getElementById('discord-asset-wrapper');
            const largeImg = document.getElementById('discord-large-image');
            const smallImg = document.getElementById('discord-small-image');

            // 4. Filter Activities
            const validActivities = discordData.activities.filter(a => a.type !== 4);
            const topActivity = validActivities[0];

            if (topActivity) {
                // --- SETUP FOR TIMER ---
                if (topActivity.timestamps && topActivity.timestamps.start) {
                    activeStartTimestamp = topActivity.timestamps.start;
                } else {
                    activeStartTimestamp = null;
                    timer.innerText = "";
                }

                // --- A. SPOTIFY ---
                if (topActivity.type === 2 && discordData.spotify) {
                    activityName.innerText = "Listening to Spotify";
                    details.innerText = discordData.spotify.song;
                    state.innerText = `by ${discordData.spotify.artist}`;
                    
                    // Spotify Art
                    largeImg.src = discordData.spotify.album_art_url;
                    smallImg.style.display = 'none'; // No small icon for Spotify usually
                    assetWrapper.style.display = 'block';
                } 
                // --- B. GAME / APP (VS Code, osu!, etc) ---
                else {
                    activityName.innerText = topActivity.name;
                    details.innerText = topActivity.details || "";
                    state.innerText = topActivity.state || "";
                    
                    // --- ASSETS LOGIC ---
                    if (topActivity.assets) {
                        assetWrapper.style.display = 'block';
                        
                        // 1. Large Image
                        if (topActivity.assets.large_image) {
                            let assetId = topActivity.assets.large_image;
                            if (assetId.startsWith("spotify:")) assetId = assetId.replace("spotify:", "");
                            largeImg.src = `https://cdn.discordapp.com/app-assets/${topActivity.application_id}/${assetId}.png`;
                            largeImg.style.display = 'block';
                        } else {
                            largeImg.style.display = 'none';
                        }

                        // 2. Small Image (The Circular Overlay)
                        if (topActivity.assets.small_image) {
                            let assetId = topActivity.assets.small_image;
                            smallImg.src = `https://cdn.discordapp.com/app-assets/${topActivity.application_id}/${assetId}.png`;
                            smallImg.style.display = 'block';
                        } else {
                            smallImg.style.display = 'none';
                        }
                    } else {
                        assetWrapper.style.display = 'none';
                    }
                }
            } else {
                // --- C. IDLE ---
                activityName.innerText = discordData.discord_status === 'dnd' ? "Do Not Disturb" : discordData.discord_status;
                activityName.style.textTransform = 'capitalize';
                
                details.innerText = "";
                state.innerText = "";
                timer.innerText = "";
                assetWrapper.style.display = 'none';
                activeStartTimestamp = null;
            }
        }
    } catch (error) {
        console.error("Lanyard Error:", error);
    }
}

/* --- DEDICATED TIMER LOOP --- */
// Runs every 1 second to update the clock smoothly
setInterval(() => {
    const timerEl = document.getElementById('discord-timer');
    if (activeStartTimestamp && timerEl) {
        const now = Date.now();
        const diff = now - activeStartTimestamp;
        
        // Convert to HH:MM:SS
        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 60 * 60)));

        const pad = (num) => num.toString().padStart(2, '0');
        
        if (hours > 0) {
            timerEl.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} elapsed`;
        } else {
            timerEl.innerText = `${pad(minutes)}:${pad(seconds)} elapsed`;
        }
    }
}, 1000);

// Run Fetch immediately and every 5s
fetchDiscordStatus();
setInterval(fetchDiscordStatus, 5000);
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

            // 2. Content Elements
            const title = document.getElementById('discord-username');
            const detail = document.getElementById('discord-activity');
            const subtext = document.getElementById('discord-subtext');
            const assetImg = document.getElementById('discord-asset');

            // 3. Filter Activities
            const validActivities = discordData.activities.filter(a => a.type !== 4);
            const topActivity = validActivities[0];

            if (topActivity) {
                // --- A. SPOTIFY ---
                if (topActivity.type === 2 && discordData.spotify) {
                    detail.innerText = discordData.spotify.song;
                    subtext.innerText = `by ${discordData.spotify.artist}`;
                    
                    // Show Album Art
                    assetImg.src = discordData.spotify.album_art_url;
                    assetImg.style.display = 'block';
                } 
                // --- B. GAME / APP ---
                else {
                    detail.innerText = topActivity.name;
                    subtext.innerText = topActivity.state || topActivity.details || "Playing";
                    
                    // Try to fetch Game Asset (Large Image)
                    if (topActivity.assets && topActivity.assets.large_image) {
                        // Construct Lanyard Asset URL
                        let assetId = topActivity.assets.large_image;
                        // Handle special 'spotify:' prefixes if they sneak in
                        if (assetId.startsWith("spotify:")) assetId = assetId.replace("spotify:", "");
                        
                        assetImg.src = `https://cdn.discordapp.com/app-assets/${topActivity.application_id}/${assetId}.png`;
                        assetImg.style.display = 'block';
                    } else {
                        // No image available? Hide the img tag
                        assetImg.style.display = 'none';
                    }
                }
            } else {
                // --- C. IDLE ---
                // Reset to default
                detail.innerText = discordData.discord_status === 'dnd' ? "Do Not Disturb" : discordData.discord_status;
                subtext.innerText = "";
                assetImg.style.display = 'none';
                
                // Capitalize status
                detail.style.textTransform = 'capitalize';
            }
        }
    } catch (error) {
        console.error("Lanyard Error:", error);
    }
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 10000);
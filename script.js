/* =========================================
   CONFIGURATION & GLOBALS
   ========================================= */
if (typeof CONFIG === 'undefined') {
    console.error("Config file not found! Make sure config.js is linked in index.html");
}

// Global State
let activeStartTimestamp = null;

/* =========================================
   1. UI INTERACTIONS
   ========================================= */
const overlay = document.getElementById('overlay');
const video = document.getElementById('bg-video');
const audio = document.getElementById('bg-audio');
const card = document.getElementById('content-card');
const muteBtn = document.getElementById('mute-btn');

// Init Volume
if (audio) audio.volume = 0.3;

// Overlay
if (overlay) {
    const enterTextEl = document.getElementById('enter-text');
    if (enterTextEl && CONFIG.entertext) enterTextEl.textContent = CONFIG.entertext;

    const hideOverlay = () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        if (video) video.play();
        if (audio) audio.play();
        if (card) card.style.opacity = '1';
    };

    overlay.addEventListener('click', hideOverlay);
    document.addEventListener('keydown', (e) => {
        if (overlay.style.opacity !== '0' && (e.key === 'Enter' || e.key === ' ')) {
            hideOverlay();
        }
    });
}

// Mute Toggle
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

// Set Location
    if (CONFIG.location) {
        const locEl = document.getElementById('location-display');
        if (locEl) {
            locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${CONFIG.location}`;
            locEl.style.display = 'flex'; // Make visible
        }
    }

/* =========================================
   2. LAST.FM WIDGET
   ========================================= */
async function fetchLastFmStats() {
    try {
        const userUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${CONFIG.lastFmUser}&api_key=${CONFIG.lastFmKey}&format=json`;
        const trackUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.lastFmUser}&api_key=${CONFIG.lastFmKey}&limit=1&format=json`;

        const [userRes, trackRes] = await Promise.all([fetch(userUrl), fetch(trackUrl)]);
        const userData = await userRes.json();
        const trackData = await trackRes.json();

        // User Stats
        if (userData.user) {
            const imgUrl = userData.user.image[2]['#text'];
            const avatar = document.getElementById('lf-avatar');
            if (imgUrl && avatar) avatar.src = imgUrl;
            
            const stats = document.getElementById('lf-stats');
            if (stats) stats.innerText = `${parseInt(userData.user.playcount).toLocaleString()} Scrobbles`;
        }

        // Now Playing
        const track = trackData.recenttracks.track[0];
        const actionBtn = document.getElementById('lf-action');
        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

        if (isPlaying) {
            actionBtn.innerHTML = `<i class="fa-solid fa-music"></i> <span class="song-name-text">${track.name}</span>`;
            actionBtn.style.color = "#43b581";
        } else {
            actionBtn.innerHTML = `View Profile`;
            actionBtn.style.color = "#b90000";
        }

    } catch (e) { console.error("Last.fm Error:", e); }
}

/* =========================================
   3. DISCORD RICH PRESENCE (Lanyard)
   ========================================= */
async function fetchDiscordStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordID}`);
        const json = await res.json();
        if (!json.success) return;

        const data = json.data;
        
        // Identity
        const avatarUrl = `https://cdn.discordapp.com/avatars/${CONFIG.discordID}/${data.discord_user.avatar}.png`;
        document.querySelector('.card-avatar').src = avatarUrl;
        
        // Decoration
        const decorationImg = document.getElementById('discord-decoration');
        if (data.discord_user.avatar_decoration_data) {
            const decoHash = data.discord_user.avatar_decoration_data.asset;
            decorationImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${decoHash}.png`;
            decorationImg.style.display = 'block';
        } else {
            decorationImg.style.display = 'none';
        }

        document.getElementById('discord-status-dot').className = `status-dot ${data.discord_status}`;
        document.getElementById('discord-username').innerText = data.discord_user.global_name || data.discord_user.username;

        // Activity Logic
        const validActivities = data.activities.filter(a => a.type !== 4);
        
        // Priority: Game/App > Spotify
        let activity = validActivities.find(a => a.type === 0 || a.type === 1 || a.type === 3);
        if (!activity) activity = validActivities.find(a => a.type === 2);

        const ui = {
            name: document.getElementById('discord-activity'),
            details: document.getElementById('discord-details'),
            state: document.getElementById('discord-state'),
            timer: document.getElementById('discord-timer'),
            assets: document.getElementById('discord-asset-wrapper'),
            lImg: document.getElementById('discord-large-image'),
            sImg: document.getElementById('discord-small-image')
        };

        if (activity) {
            activeStartTimestamp = (activity.timestamps && activity.timestamps.start) ? activity.timestamps.start : null;
            if (!activeStartTimestamp) ui.timer.innerText = "";

            if (activity.type === 2 && data.spotify) {
                // Spotify
                ui.name.innerText = "Listening to Spotify";
                ui.details.innerText = data.spotify.song;
                ui.state.innerText = `by ${data.spotify.artist}`;
                ui.lImg.src = data.spotify.album_art_url;
                ui.sImg.style.display = 'none';
                ui.assets.style.display = 'block';
            } else {
                // Game
                ui.name.innerText = activity.name;
                ui.details.innerText = activity.details || "";
                ui.state.innerText = activity.state || "";

                if (activity.assets) {
                    ui.assets.style.display = 'block';
                    if (activity.assets.large_image) {
                        let assetId = activity.assets.large_image.replace("spotify:", "");
                        ui.lImg.src = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assetId}.png`;
                        ui.lImg.style.display = 'block';
                    } else ui.lImg.style.display = 'none';

                    if (activity.assets.small_image) {
                        let assetId = activity.assets.small_image.replace("spotify:", "");
                        ui.sImg.src = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assetId}.png`;
                        ui.sImg.style.display = 'block';
                    } else ui.sImg.style.display = 'none';
                } else {
                    ui.assets.style.display = 'none';
                }
            }
        } else {
            // Idle
            ui.name.innerText = data.discord_status === 'dnd' ? "Do Not Disturb" : data.discord_status;
            ui.name.style.textTransform = 'capitalize';
            ui.details.innerText = "";
            ui.state.innerText = "";
            ui.timer.innerText = "";
            ui.assets.style.display = 'none';
            activeStartTimestamp = null;
        }

    } catch (e) { console.error("Lanyard Error:", e); }
}

/* =========================================
   4. TIMER LOOP (1s Tick)
   ========================================= */
setInterval(() => {
    const timerEl = document.getElementById('discord-timer');
    if (activeStartTimestamp && timerEl) {
        const diff = Date.now() - activeStartTimestamp;
        if (diff < 0) return;

        const sec = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
        const min = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
        const hrs = Math.floor((diff / (1000 * 60 * 60)));

        timerEl.innerText = hrs > 0 ? `${hrs}:${min}:${sec} elapsed` : `${min}:${sec} elapsed`;
    }
}, 1000);

/* =========================================
   5. STATIC CONTENT & LINKS
   ========================================= */
function updateStaticContent() {
    // Page Title & Header
    if (CONFIG.name) {
        document.title = `@${CONFIG.name}`;
        const nameHeader = document.querySelector('.username');
        if (nameHeader) nameHeader.innerText = CONFIG.name;
    }

    // Bio
    if (CONFIG.description) {
        const bioEl = document.getElementById('profile-bio');
        if (bioEl) bioEl.innerText = CONFIG.description;
    }

    // Widget Links
    const discordCard = document.querySelector('.discord-hero');
    if (discordCard && CONFIG.discordID) discordCard.href = `https://discord.com/users/${CONFIG.discordID}`;

    const lastFmCard = document.querySelector('.lastfm-card');
    if (lastFmCard && CONFIG.lastFmUser) {
        lastFmCard.href = `https://www.last.fm/user/${CONFIG.lastFmUser}`;
        const lfTitle = lastFmCard.querySelector('.card-title');
        if (lfTitle) lfTitle.innerText = CONFIG.lastFmUser;
    }

    // Generate Links
    const container = document.getElementById('links-container');
    if (container && CONFIG.links) {
        container.innerHTML = '';
        CONFIG.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = "_blank";
            a.className = "link-item";
            a.title = link.title;
            const i = document.createElement('i');
            i.className = link.icon;
            a.appendChild(i);
            container.appendChild(a);
        });
    }
}

/* =========================================
   6. TIME ALIVE COUNTER (Total Hours)
   ========================================= */
function updateAliveTimer() {
    const timerEl = document.getElementById('alive-timer-el');
    if (!timerEl || !CONFIG.birthdate) return;

    const birth = new Date(CONFIG.birthdate).getTime();
    const now = Date.now();
    const diff = now - birth;

    // Calculate Time
    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    // Formatting
    const pSec = seconds.toString().padStart(2, '0');
    const pMin = minutes.toString().padStart(2, '0');

    // Get Lablel from Config (Default to empty if missing)
    const label = CONFIG.aliveText || "";

    // Render: "I have been alive for hhhh:mm:ss"
    timerEl.innerText = `${label}${hours}:${pMin}:${pSec}`;
}

// Run
updateStaticContent();
fetchLastFmStats();
fetchDiscordStatus();
setInterval(updateAliveTimer, 1000);
updateAliveTimer();
setInterval(fetchLastFmStats, 10000);
setInterval(fetchDiscordStatus, 5000);
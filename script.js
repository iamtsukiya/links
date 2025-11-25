/* =========================================
   CONFIGURATION & GLOBALS
   ========================================= */
if (typeof CONFIG === 'undefined') {
    console.error("Config file not found! Make sure config.js is linked in index.html");
}

// Global State
let activeStartTimestamp = null;

/* =========================================
   1. UI INTERACTIONS (Overlay & Volume)
   ========================================= */
const overlay = document.getElementById('overlay');
const video = document.getElementById('bg-video');
const audio = document.getElementById('bg-audio');
const card = document.getElementById('content-card');

// --- VOLUME CONTROL ELEMENTS ---
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('mute-btn');
const volumeIcon = volumeBtn ? volumeBtn.querySelector('i') : null;
let lastVolume = 0.3; 

// 1. Set Initial Volume
if (audio) {
    audio.volume = 0.3; 
    if (volumeSlider) {
        volumeSlider.value = 0.3;
        updateSliderVisual(0.3);
    }
}

// 2. Overlay Click Logic
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

// 3. Volume Slider Logic
if (volumeSlider && audio) {
    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.volume = val;
        audio.muted = false; 
        if (val > 0) lastVolume = val;
        updateVolumeIcon(val);
        updateSliderVisual(val);
    });
}

// 4. Mute/Unmute Click Logic
if (volumeBtn && audio) {
    volumeBtn.addEventListener('click', () => {
        if (audio.muted || audio.volume === 0) {
            audio.muted = false;
            audio.volume = lastVolume > 0 ? lastVolume : 0.3;
            if (volumeSlider) {
                volumeSlider.value = audio.volume;
                updateSliderVisual(audio.volume);
            }
        } else {
            if (audio.volume > 0) lastVolume = audio.volume;
            audio.muted = true;
            if (volumeSlider) {
                volumeSlider.value = 0;
                updateSliderVisual(0);
            }
        }
        updateVolumeIcon(audio.muted ? 0 : audio.volume);
    });
}

function updateVolumeIcon(val) {
    if (!volumeIcon) return;
    if (audio.muted || val == 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (val < 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}

function updateSliderVisual(val) {
    if (!volumeSlider) return;
    const percentage = val * 100;
    volumeSlider.style.background = `linear-gradient(to right, #ffffff ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
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

        if (userData.user) {
            const imgUrl = userData.user.image[2]['#text'];
            const avatar = document.getElementById('lf-avatar');
            if (imgUrl && avatar) avatar.src = imgUrl;
            
            const stats = document.getElementById('lf-stats');
            if (stats) stats.innerText = `${parseInt(userData.user.playcount).toLocaleString()} Scrobbles`;
        }

        const track = trackData.recenttracks.track[0];
        const actionBtn = document.getElementById('lf-action');
        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

        if (isPlaying) {
            actionBtn.innerHTML = `<i class="fa-solid fa-music"></i> <span class="song-name-text">${track.name}</span>`;
            actionBtn.style.color = "#23a559";
        } else {
            actionBtn.innerHTML = `View Profile`;
            actionBtn.style.color = "#c5eaf4";
            actionBtn.style.fontFamily = "'JetBrains Mono', monospace";
            actionBtn.style.fontSize = '0.5rem';
            actionBtn.style.fontWeight = '600';
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
        
        const avatarUrl = `https://cdn.discordapp.com/avatars/${CONFIG.discordID}/${data.discord_user.avatar}.png`;
        document.querySelector('.card-avatar').src = avatarUrl;
        
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

        const allActivities = data.activities.filter(a => a.type !== 4);
        let activity = allActivities.find(a => a.type === 0 || a.type === 1 || a.type === 3);
        if (!activity) activity = allActivities.find(a => a.type === 2);

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
                ui.name.innerText = "Listening to Spotify";
                ui.details.innerText = data.spotify.song;
                ui.state.innerText = `by ${data.spotify.artist}`;
                ui.lImg.src = data.spotify.album_art_url;
                ui.sImg.style.display = 'none';
                ui.assets.style.display = 'block';
            } else {
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
    if (CONFIG.name) {
        document.title = `@${CONFIG.name}`;
        const nameHeader = document.querySelector('.username');
        if (nameHeader) nameHeader.innerText = CONFIG.name;
    }

    if (CONFIG.description) {
        const bioEl = document.getElementById('profile-bio');
        if (bioEl) bioEl.innerText = CONFIG.description;
    }

    // Location
    if (CONFIG.location) {
        const locEl = document.getElementById('location-display');
        if (locEl) {
            locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${CONFIG.location}`;
            locEl.style.display = 'flex'; 
        }
    }

    // Version
    if (CONFIG.version) {
        const verEl = document.getElementById('version-text');
        if (verEl) verEl.innerText = CONFIG.version;
    }

    // Widget Links (Basic)
    const discordCard = document.querySelector('.discord-hero');
    if (discordCard && CONFIG.discordID) discordCard.href = `https://discord.com/users/${CONFIG.discordID}`;

    const lastFmCard = document.querySelector('.lastfm-card');
    if (lastFmCard && CONFIG.lastFmUser) {
        lastFmCard.href = `https://www.last.fm/user/${CONFIG.lastFmUser}`;
        const lfTitle = lastFmCard.querySelector('.card-title');
        if (lfTitle) lfTitle.innerText = CONFIG.lastFmUser;
    }

    // Link Generator
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
   6. TIME ALIVE COUNTER
   ========================================= */
function updateAliveTimer() {
    const timerEl = document.getElementById('alive-timer-el');
    if (!timerEl || !CONFIG.birthdate) return;

    const birth = new Date(CONFIG.birthdate).getTime();
    const now = Date.now();
    const diff = now - birth;

    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const pSec = seconds.toString().padStart(2, '0');
    const pMin = minutes.toString().padStart(2, '0');
    const label = CONFIG.aliveText || "";

    timerEl.innerText = `${label}${hours}:${pMin}:${pSec}`;
}

/* =========================================
   7. INITIALIZATION & SAFETY CHECKS
   ========================================= */
function initWidgets() {
    const discordCard = document.querySelector('.discord-hero');
    const lastFmCard = document.querySelector('.lastfm-card');
    const grid = document.querySelector('.grid-row');

    let discordActive = false;
    let lastFmActive = false;

    // 1. Discord Check
    if (CONFIG.discordID && CONFIG.discordID !== "") {
        discordActive = true;
        fetchDiscordStatus();
        setInterval(fetchDiscordStatus, 5000);
    } else {
        if (discordCard) discordCard.style.display = 'none';
    }

    // 2. Last.fm Check
    if (CONFIG.lastFmUser && CONFIG.lastFmKey && CONFIG.lastFmUser !== "") {
        lastFmActive = true;
        fetchLastFmStats();
        setInterval(fetchLastFmStats, 10000);
    } else {
        if (lastFmCard) lastFmCard.style.display = 'none';
    }

    // 3. Layout Fixes
    if (!discordActive && !lastFmActive) {
        if (grid) grid.style.display = 'none';
    } else if (!discordActive || !lastFmActive) {
        if (grid) grid.style.gridTemplateColumns = '1fr';
    }
}

// --- RUN ---
updateStaticContent();
initWidgets();
setInterval(updateAliveTimer, 1000);
updateAliveTimer();
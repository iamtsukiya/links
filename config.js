/**
 * =================================================================
 * PROJECT CONFIGURATION: 'links' Bio Page
 * -----------------------------------------------------------------
 * This file contains all dynamic data, IDs, and API keys.
 * A user only needs to edit this file to customize the entire site.
 * =================================================================
 */

const CONFIG = {
    // ------------------------------------
    // 1. CORE IDENTITY & USERNAME
    // ------------------------------------
    
    // The main display name shown in the page header.
    name: "tsukiya",

    // ------------------------------------
    // 2. DISCORD & LANYARD API
    // ------------------------------------
    
    // Your 18-digit Discord User ID.
    // Lanyard uses this to fetch your live status and activity.
    discordID: "278137133183795201",

    // ------------------------------------
    // 3. LAST.FM WIDGET
    // ------------------------------------

    // Your Last.fm username (used to fetch playcounts and currently playing song).
    lastFmUser: "iamtsukiya",
    
    // Last.fm Read-Only API Key (Public key for fetching data).
    // Get this from: https://www.last.fm/api/account/create
    lastFmKey: "6a078360c2807a6b8c802f24e7b032d4", 

    // ------------------------------------
    // 4. SOCIAL LINKS (ICON ROW GENERATOR)
    // ------------------------------------
    
    // List of objects used to generate the clickable icon row automatically.
    // 'icon': FontAwesome class (e.g., 'fab fa-discord' or 'fas fa-music').
    // 'url': Full HTTPS link.
    // 'title': Text shown on hover.
    links: [
        { icon: "fab fa-discord", url: "https://discord.com/users/278137133183795201", title: "Discord" },
        { icon: "fab fa-youtube", url: "https://youtube.com/@iamtsukiya", title: "YouTube" },
        { icon: "fab fa-spotify", url: "https://open.spotify.com/user/31ohtwyzxgce7krfnmehklwfxii4", title: "Spotify" },
        { icon: "fab fa-instagram", url: "https://instagram.com/hujervojtech", title: "Instagram" },
        { icon: "fab fa-x-twitter", url: "https://x.com/iamtsukiya", title: "X (Twitter)" },
        { icon: "fab fa-soundcloud", url: "https://soundcloud.com/iamtsukiya", title: "SoundCloud" },
        { icon: "fab fa-twitch", url: "https://twitch.tv/iamtsukiya", title: "Twitch" },
        { icon: "fab fa-steam", url: "https://steamcommunity.com/id/iamtsukiya", title: "Steam" },
        { icon: "fab fa-github", url: "https://github.com/iamtsukiya", title: "GitHub" },
        { icon: "fas fa-music", url: "https://osu.ppy.sh/users/15894115", title: "osu!" },
    ]
};
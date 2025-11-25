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
    name: "YOUR_DISPLAY_NAME_HERE",

    // ------------------------------------
    // 2. DISCORD & LANYARD API
    // ------------------------------------
    
    // Your 18-digit Discord User ID.
    // Lanyard uses this to fetch your live status and activity.
    discordID: "YOUR_DISCORD_USER_ID",

    // ------------------------------------
    // 3. LAST.FM WIDGET
    // ------------------------------------

    // Your Last.fm username (used to fetch playcounts and currently playing song).
    lastFmUser: "YOUR_LASTFM_USERNAME",
    
    // Last.fm Read-Only API Key (Public key for fetching data).
    // Get this from: https://www.last.fm/api/account/create
    lastFmKey: "YOUR_LASTFM_API_KEY", 

    // ------------------------------------
    // 4. SOCIAL LINKS (ICON ROW GENERATOR)
    // ------------------------------------
    
    // List of objects used to generate the clickable icon row automatically.
    // 'icon': FontAwesome class (e.g., 'fab fa-discord' or 'fas fa-music').
    // 'url': Full HTTPS link.
    // 'title': Text shown on hover.
    links: [
        { icon: "fab fa-discord", url: "https://discord.com/users/YOUR_DISCORD_USER_ID", title: "Discord" },
        { icon: "fab fa-youtube", url: "https://youtube.com/@YOUR_CHANNEL", title: "YouTube" },
    ]
};
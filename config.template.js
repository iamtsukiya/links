/**
 * =================================================================
 * PROJECT CONFIGURATION: 'links' Bio Page
 * -----------------------------------------------------------------
 * This file contains all dynamic data, IDs, and API keys.
 * A user only needs to edit this file to customize the entire site.
 * =================================================================
 */

const CONFIG = {
    // 1. PROFILE INFO
    name: "YOUR_DISPLAY_NAME_HERE",
    description: "YOUR_DESCRIPTION_HERE",
    aliveText: "I have been alive for",
    birthdate: "YYYY-MM-DD", // YYYY-MM-DD format
    location: "City, Country",

    // 2. API KEYS & IDS
    discordID: "YOUR_DISCORD_USER_ID",
    lastFmUser: "YOUR_LASTFM_USERNAME",
    lastFmKey: "YOUR_LASTFM_API_KEY", 
    
    // 3. UI SETTINGS
    entertext: "click to enter",
    version : "v1.0",

    // 4. SOCIAL LINKS
    // --------------------------------------------------------------------------------
    // HOW TO ADD A LINK:
    // 1. Copy an existing line
    // 2. Paste it below the last link
    // 3. Change the URL and Title
    //
    // HOW TO FIND ICONS:
    // Go to: https://fontawesome.com/icons
    // - For brands (Twitter, Instagram), use "fab fa-brandname"
    // - For standard icons (Home, Globe), use "fas fa-iconname"
    // --------------------------------------------------------------------------------
    links: [
        { icon: "fab fa-discord", url: "https://discord.com/users/YOUR_DISCORD_USER_ID", title: "Discord" },
        { icon: "fas fa-globe", url: "https://YOUR_WEBSITE_URL", title: "Website" },
    ]
};
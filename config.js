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
    name: "tsukiya",
    description: "Civil Eng Student @ VUT. Majoring in Procrastination and osu! Sometimes I race RC cars.",
    aliveText: "Gooning streak: ",
    birthdate: "2006-01-16", // YYYY-MM-DD format
    
    // 2. API KEYS & IDS
    discordID: "278137133183795201",
    lastFmUser: "iamtsukiya",
    lastFmKey: "6a078360c2807a6b8c802f24e7b032d4", 
    
    // 3. UI SETTINGS
    entertext: "click to enter",

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
        { icon: "fab fa-discord", url: "https://discord.com/users/278137133183795201", title: "Discord" },
        { icon: "fab fa-youtube", url: "https://youtube.com/@iamtsukiya", title: "YouTube" },
        { icon: "fas fa-globe", url: "https://osu.ppy.sh/users/15894115", title: "osu! Profile" },
    ]
};
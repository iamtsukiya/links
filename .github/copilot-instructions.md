# Copilot Instructions for `mylinks` Project

## Project Overview
This is a simple static personal links page built with HTML and CSS. It displays a profile image, username, bio, and a set of external links. The design is minimal and developer-centric, using JetBrains Mono font and a dark theme.

## Key Files
- `index.html`: Main HTML structure. Contains profile, bio, and links.
- `style.css`: All styling, including layout, colors, and responsive design.
- `assets/`: Reserved for images or other static assets (currently unused).

## Patterns & Conventions
- **Font:** Uses JetBrains Mono from Google Fonts for a developer aesthetic.
- **Profile Image:** Uses a GitHub identicon as a placeholder.
- **Links:** Each link is a styled block. Add new links by duplicating `<a class="link-item">` in the `.links` div.
- **Responsiveness:** Layout is centered and constrained to 400px max-width for desktop and mobile friendliness.
- **Styling:** All styles are in `style.css`. No inline styles or JavaScript.
- **Icons:** To add icons, use Font Awesome via CDN. Example usage:
  ```html
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <a href="https://github.com" class="link-item"><i class="fab fa-github"></i> GitHub</a>
  ```

## Developer Workflows
- No build or test steps; edit HTML/CSS directly and refresh browser to view changes.
- No external dependencies except Google Fonts and (optionally) Font Awesome via CDN.
- No JavaScript or frameworks.

## Customization
- Update profile image, username, and bio in `index.html`.
- Add/remove links by editing the `.links` section.
- For icons, wrap link text with `<i class="fa ..."></i>` as shown above.

## Example: Adding Font Awesome
1. Add the CDN link to `<head>` in `index.html`:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
   ```
2. Use icons in links:
   ```html
   <a href="https://github.com" class="link-item"><i class="fab fa-github"></i> GitHub</a>
   ```

## Summary
- Keep everything simple and static.
- Use CDN for fonts and icons.
- No build tools, just edit and refresh.

---
If any conventions or patterns are unclear, please ask for clarification or provide feedback to improve these instructions.
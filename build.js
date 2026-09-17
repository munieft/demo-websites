const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, "websites.json");

// Files/folders that should never be treated as websites
const IGNORE = new Set([
    ".git",
    ".github",
    "node_modules",
    "build.js",
    "index.html",
    "websites.json"
]);

const entries = fs.readdirSync(ROOT, { withFileTypes: true });

const websites = entries
    .filter(entry => entry.isDirectory())
    .filter(entry => !IGNORE.has(entry.name))
    .filter(entry => {
        const indexPath = path.join(ROOT, entry.name, "index.html");
        return fs.existsSync(indexPath);
    })
    .map(entry => {
        const folder = entry.name;

        return {
            name: folder
                .replace(/[-_]+/g, " ")
                .replace(/\b\w/g, char => char.toUpperCase()),

            folder: folder,

            url: `/${folder}/`
        };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(
    OUTPUT,
    JSON.stringify(websites, null, 2),
    "utf8"
);

console.log(`Found ${websites.length} websites.`);

websites.forEach(site => {
    console.log(`  ✓ ${site.name} -> ${site.url}`);
});

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const IGNORE = new Set([
    ".git",
    ".github",
    "node_modules",
    "build.js",
    "index.html",
    "websites.json"
]);

const websites = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .filter(entry => !IGNORE.has(entry.name))
    .filter(entry => {
        return fs.existsSync(
            path.join(ROOT, entry.name, "index.html")
        );
    })
    .map(entry => ({
        name: entry.name
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase()),

        folder: entry.name,

        url: `/${entry.name}/`
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

const output = path.join(ROOT, "websites.json");

fs.writeFileSync(
    output,
    JSON.stringify(websites, null, 2)
);

console.log("");
console.log("=================================");
console.log(" Website Portfolio Build");
console.log("=================================");
console.log("");
console.log(`Found ${websites.length} websites.`);
console.log("");

websites.forEach((site, index) => {
    console.log(
        `${index + 1}. ${site.name} -> ${site.url}`
    );
});

console.log("");
console.log(`Generated: ${output}`);
console.log("");

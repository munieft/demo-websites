Vegan Garden London website

Pages: index.html (home), menu.html, visit.html

PREVIEWING THE FOUR LOOKS
Open any page and use the "Look" button in the bottom-left corner.
The chosen look carries across pages. You can also send a direct link:
  index.html                 Market garden (cream, olive, beetroot)
  index.html?theme=blush     Bunting blush (pastel pink, beetroot, green)
  index.html?theme=evening   Evening market (deep green, mustard)
  index.html?theme=fresh     Fresh & bright (white, tomato red, bold type)

GOING LIVE WITH ONE LOOK
In index.html, menu.html and visit.html:
  1. Change  <html lang="en-GB" data-theme="garden" data-preview>
     to      <html lang="en-GB" data-theme="blush">   (use the chosen look name)
  2. Delete the line  <script src="js/theme-preview.js" defer></script>
Then js/theme-preview.js can be deleted too.

All colours, fonts and corner shapes for each look are at the top of css/style.css.
Animations switch off automatically for visitors who turn on "reduce motion".

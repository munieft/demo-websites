/* Snack Bar Dagenham — menu (items taken from the in-store menu board, window signage and the café's own photos) */
window.SB_ICONS = {
  plate: '<svg viewBox="0 0 64 64"><path d="M32 10a22 22 0 1 0 0 44 22 22 0 0 0 0-44zm0 38a16 16 0 1 1 0-32 16 16 0 0 1 0 32z"/><circle cx="27" cy="29" r="5"/><ellipse cx="37" cy="36" rx="6" ry="3.4"/><path d="M4 12h3v14a3 3 0 0 1-3 3zM60 12v40h-3V30h-2V16c0-2 2-4 5-4z"/></svg>',
  cup: '<svg viewBox="0 0 64 64"><path d="M10 26h36v10a16 16 0 0 1-16 16h-4A16 16 0 0 1 10 36zm36 4h4a7 7 0 0 1 0 14h-5.6a19 19 0 0 0 1.6-4H50a3 3 0 0 0 0-6h-4zM6 56h44v3H6z"/><path d="M20 8c-3 4 3 6 0 12M28 6c-3 4 3 7 0 14M36 8c-3 4 3 6 0 12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  sandwich: '<svg viewBox="0 0 64 64"><path d="M6 30 32 12l26 18v4H6zM8 38h48v4c-6 3-10-1-16 2s-10-1-16 2-10-1-16 0zM6 48h52v6H6z"/></svg>',
  glass: '<svg viewBox="0 0 64 64"><path d="M16 18h32l-4 40H20zM38 4l3 1-4 13h-3z"/><path d="M14 14h36v4H14z"/></svg>',
  cake: '<svg viewBox="0 0 64 64"><path d="M8 40 56 26v8L8 48zM8 48l48-14v18H8z"/><circle cx="44" cy="20" r="6"/><path d="M44 10c2 0 3 2 3 3" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
};

window.SB_MENU = [
  {
    id: "breakfast", name: "All Day Breakfast", kicker: "Served 7am till close", icon: "plate",
    blurb: "The reason Heathway queues at 7am. Proper fry-ups cooked to order, served all day, eat in or takeaway.",
    items: [
      { name: "The Full English", img: "full-breakfast", desc: "Sausage, bacon, fried egg, baked beans, grilled tomato, mushrooms and chips, with buttered toast on the side.", tags: ["Favourite", "Hot"] },
      { name: "The Big Fry-Up", img: "fry-up", desc: "Plump sausage, thick back bacon, a sunny fried egg, two slices of black pudding and a heap of buttery mushrooms.", tags: ["Hearty", "Hot"] },
      { name: "Build Your Own Breakfast", desc: "Pick your favourites — sausage, bacon, eggs your way, black pudding, mushrooms, beans, tomato, chips and toast.", tags: ["Your way", "Veggie option"] },
      { name: "Breakfast To Go", img: "takeaway-breakfast", desc: "Your breakfast boxed up hot with beans on the side and a Snack Bar coffee — perfect for the walk to Heathway station.", tags: ["Takeaway"] },
      { name: "Buttered Toast", desc: "Thick, golden toast with real butter. The perfect partner for a cuppa or a side for any plate.", tags: ["Vegetarian"] }
    ]
  },
  {
    id: "hot-meals", name: "Hot Meals & Homemade Dinners", kicker: "Lunch · Dinner", icon: "plate",
    blurb: "Freshly homemade, generous and good value — big plates of grilled meats, rice, curry and crisp salad.",
    items: [
      { name: "Grilled Chicken, Rice & Salad", img: "chicken-rice", desc: "Chargrilled chicken pieces on fluffy rice with creamy coleslaw, red cabbage, onion and fresh salad.", tags: ["Favourite", "Hot"] },
      { name: "Mixed Grill Plate", img: "mixed-grill", desc: "Chargrilled chicken with a seasoned grilled kofte, rice, coleslaw, red cabbage and sliced tomatoes.", tags: ["Hearty", "Hot"] },
      { name: "Grill Platter with Pitta & Chips", img: "kebab-platter", desc: "A feast of grilled chicken and kofte with warm pitta, golden chips and salad — made for sharing (or not).", tags: ["Sharing", "Hot"] },
      { name: "Chicken Curry & Rice", img: "curry-rice", desc: "Homemade curry with tender chicken in a rich, warming sauce, served with rice, coleslaw and salad.", tags: ["Homemade", "Hot"] },
      { name: "Breaded Fish, Rice & Coleslaw", img: "fish-rice", desc: "Golden breaded fish fillet topped with a creamy peppercorn sauce, served with buttery rice and coleslaw.", tags: ["Homemade"] },
      { name: "Fresh Folded Flatbread", img: "flatbread", desc: "Hand-rolled dough, filled, folded and cooked on the griddle until crisp and golden. Cut into wedges to share.", tags: ["Freshly made"] }
    ]
  },
  {
    id: "sandwiches", name: "Sandwiches, Rolls & Jackets", kicker: "Quick bites", icon: "sandwich",
    blurb: "Made to order while you wait — grab one with a hot drink on your way to work or sit in and take your time.",
    items: [
      { name: "Toasted Sandwiches", img: "toasties", desc: "Crisp, golden pressed toasties with melting fillings, served with a fresh side salad.", tags: ["Favourite"] },
      { name: "Breakfast Rolls", desc: "Soft rolls stuffed with your choice of sausage, bacon or egg — the classic morning grab-and-go.", tags: ["Takeaway", "Hot"] },
      { name: "Fresh Sandwiches", desc: "Made fresh to order with your choice of filling on white or brown bread. Eat in or takeaway.", tags: ["Made to order"] },
      { name: "Jacket Potatoes", desc: "Oven-baked jackets, fluffy inside with crispy skin, loaded with your choice of filling — just ask the team.", tags: ["Veggie option"] }
    ]
  },
  {
    id: "hot-drinks", name: "Tea & Coffee", kicker: "The kettle's always on", icon: "cup",
    blurb: "Barista coffee and a proper builder's brew. Every hot drink is made fresh — eat in mugs or our red takeaway cups.",
    items: [
      { name: "Tea", img: "regular-cuppa", desc: "A proper British cuppa, brewed strong or weak — however you like it.", tags: ["Classic"] },
      { name: "Herbal Tea", desc: "A calming selection of herbal infusions.", tags: ["Caffeine-free"] },
      { name: "Coffee", img: "cup-dining-room", desc: "Our house black or white coffee, freshly made.", tags: ["Classic"] },
      { name: "Cappuccino", img: "cappuccino-table", desc: "Espresso with silky foamed milk and a generous dusting of chocolate.", tags: ["Favourite"] },
      { name: "Latte", img: "latte-glass", desc: "Smooth espresso and steamed milk served in a tall glass — with latte art when you eat in.", tags: ["Barista"] },
      { name: "Espresso (Single)", desc: "A short, rich shot for a quick pick-me-up.", tags: ["Barista"] },
      { name: "All Milk Coffee", desc: "Coffee made entirely with hot milk for an extra creamy cup.", tags: ["Creamy"] },
      { name: "Hot Chocolate", desc: "Rich, velvety hot chocolate to warm you up on a grey Dagenham morning.", tags: ["Classic"] },
      { name: "Hot Chocolate with Cream", img: "hot-choc-duo", desc: "Our hot chocolate crowned with a swirl of whipped cream.", tags: ["Treat"] }
    ]
  },
  {
    id: "cold-drinks", name: "Cold & Fun Drinks", kicker: "Iced · Frappé · Slush", icon: "glass",
    blurb: "Colourful, chilled and very Instagrammable — from iced lattes and matcha to our famous two-tone slush.",
    items: [
      { name: "Iced Latte", img: "iced-latte", desc: "Espresso poured over cold milk and ice for that gorgeous layered look.", tags: ["Favourite"] },
      { name: "Iced Matcha", img: "matcha-cup", desc: "Vibrant green matcha over milk and ice, served in a Snack Bar cup.", tags: ["New-wave"] },
      { name: "Frappé", img: "frappe", desc: "Blended ice-cold coffee frappé topped with whipped cream and a dusting of cinnamon.", tags: ["Treat"] },
      { name: "Mocha Frappé", img: "frappe-mocha", desc: "Chocolatey iced coffee blended thick and smooth, finished with cream.", tags: ["Treat"] },
      { name: "Slush", img: "slush-glass", desc: "Ice-cold slush in bright flavours — mix the red and blue for the full effect.", tags: ["Kids love it"] },
      { name: "Orange or Apple Juice", desc: "Chilled fruit juice — a fresh partner to any breakfast.", tags: ["Classic"] },
      { name: "Ribena Carton", desc: "The blackcurrant classic.", tags: ["Classic"] },
      { name: "Cans & Bottles", desc: "Coca-Cola, Fanta, Sprite, Dr Pepper and more, plus 500ml bottles and water from the chiller.", tags: ["Grab & go"] }
    ]
  },
  {
    id: "sweet", name: "Homemade Cheesecakes & Cakes", kicker: "Sweet treats", icon: "cake",
    blurb: "Our cheesecakes have a fan club. Flavours rotate, so ask what's on the counter today — some sell out fast.",
    items: [
      { name: "Strawberry Cheesecake", img: "strawberry-cheesecake", desc: "Light, creamy vanilla cheesecake on a buttery biscuit base, smothered in glossy strawberry topping.", tags: ["Favourite", "Homemade"] },
      { name: "Mixed Berry Cheesecake", img: "berry-cheesecake", desc: "Cloud-soft cheesecake crowned with blackberries and a deep berry coulis.", tags: ["Homemade"] },
      { name: "Biscoff Cheesecake", img: "biscoff-cheesecake", desc: "Caramelised biscuit crumb, a Biscoff swirl and a thick, creamy filling. Dangerously moreish.", tags: ["Homemade"] },
      { name: "Fruits of the Forest Cheesecake", img: "berry-tart", desc: "A whole-cake showstopper loaded with forest fruit compote — perfect with a cappuccino.", tags: ["Homemade"] }
    ]
  }
];

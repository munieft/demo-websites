/* Masala Mart — default catalogue & settings.
   This is the seed data. The admin panel (admin.html) edits a copy kept in the browser;
   swap MM.Store's load/save for API calls to turn this into a live online store. */
window.MM_DEFAULTS = {
  version: 3,
  settings: {
    storeName: 'Masala Mart',
    tagline: 'Your One Stop Indian Grocery Store',
    phone: '07512 345114',
    whatsapp: '447512345114',
    instagram: 'masalamartuk',
    address: '189–191 High Street, Barnet, EN5 5SU',
    announcement: 'Winter greens are in — fresh Saag, Mooli, Green Garlic & Toover Dana ✦ Yippee noodles 7 for £1 ✦ Veg Puffs Buy 1 Get 1 Free ✦ MM Card members save more',
    hours: { 0: ['09:30', '16:00'], 1: ['09:30', '19:00'], 2: ['09:30', '19:00'], 3: ['09:30', '19:00'], 4: ['09:30', '19:00'], 5: ['09:30', '19:00'], 6: ['09:30', '19:00'] },
    deliveryFee: 3.99, freeDeliveryOver: 40, minDelivery: 20,
    deliveryAreas: ['EN4', 'EN5', 'EN6', 'N2', 'N3', 'N11', 'N12', 'N14', 'N20'],
    adminPin: '1234'
  },
  categories: [
    { id: 'fresh', name: 'Fresh Vegetables', icon: '🥬', hue: 130 },
    { id: 'spices', name: 'Spices & Masalas', icon: '🌶️', hue: 8 },
    { id: 'flour', name: 'Atta, Flour & Grains', icon: '🌾', hue: 40 },
    { id: 'rice', name: 'Rice & Poha', icon: '🍚', hue: 50 },
    { id: 'dal', name: 'Dal & Pulses', icon: '🫘', hue: 28 },
    { id: 'snacks', name: 'Namkeen & Snacks', icon: '🥨', hue: 34 },
    { id: 'sweets', name: 'Mithai & Sweets', icon: '🍬', hue: 330 },
    { id: 'hot', name: 'Hot Counter', icon: '🥟', hue: 22 },
    { id: 'frozen', name: 'Frozen', icon: '❄️', hue: 200 },
    { id: 'chilled', name: 'Dairy & Chilled', icon: '🧈', hue: 48 },
    { id: 'pantry', name: 'Noodles, Sauces & Pickles', icon: '🍜', hue: 0 },
    { id: 'tea', name: 'Tea & Biscuits', icon: '☕', hue: 20 },
    { id: 'pooja', name: 'Pooja & Festive', icon: '🪔', hue: 42 }
  ],
  products: [
    // Fresh
    { id: 'p001', name: 'Green Garlic', cat: 'fresh', price: 1.49, unit: 'bunch', img: 'assets/img/products/green-garlic.jpg', badge: 'Seasonal', desc: 'Tender lilu lasan — fragrant, mild and full of flavour. Winter essential for undhiyu, thepla and garlic chutney.', stock: 40, featured: true },
    { id: 'p002', name: 'Toover Dana (Fresh Pigeon Peas)', cat: 'fresh', price: 2.49, unit: '250g', img: 'assets/img/products/toover-dana.jpg', badge: 'Just Arrived', desc: 'Freshly shelled green toover — sweet, plump and perfect for kachori, undhiyu and toover ringan.', stock: 30, featured: true },
    { id: 'p003', name: 'Saag Leaves (Mustard Greens)', cat: 'fresh', price: 1.99, unit: 'bunch', img: 'assets/img/products/saag.jpg', badge: 'Seasonal', desc: 'Crisp leafy sarson for slow-cooked sarson ka saag with makki di roti.', stock: 35, featured: true },
    { id: 'p004', name: 'Mooli (White Radish)', cat: 'fresh', price: 1.29, unit: 'each', img: 'assets/img/products/mooli.jpg', badge: 'Fresh', desc: 'Crunchy winter mooli with leaves — for mooli paratha, salad and sambar.', stock: 45, featured: true },
    { id: 'p005', name: 'Okra (Bhindi)', cat: 'fresh', price: 2.29, unit: '500g', desc: 'Young, tender bhindi — ideal for bhindi masala and kurkuri bhindi.', stock: 30 },
    { id: 'p006', name: 'Fresh Methi', cat: 'fresh', price: 0.99, unit: 'bunch', desc: 'Fenugreek leaves for thepla, methi muthia and aloo methi.', stock: 50 },
    { id: 'p007', name: 'Fresh Coriander', cat: 'fresh', price: 0.69, unit: 'bunch', desc: 'Generous bunches of dhania, cut fresh every morning.', stock: 80 },
    { id: 'p008', name: 'Green Chillies', cat: 'fresh', price: 0.99, unit: '200g', desc: 'Fiery Indian green chillies.', stock: 60 },
    { id: 'p009', name: 'Tindora (Ivy Gourd)', cat: 'fresh', price: 2.49, unit: '500g', desc: 'Crisp tindora for a quick Gujarati shaak.', stock: 25 },
    { id: 'p010', name: 'Surti Papdi', cat: 'fresh', price: 3.49, unit: '500g', badge: 'Undhiyu', desc: 'Flat Surti beans — the heart of a proper undhiyu.', stock: 20 },
    { id: 'p011', name: 'Fresh Curry Leaves', cat: 'fresh', price: 0.99, unit: 'pack', desc: 'Aromatic kadi patta for tadka.', stock: 50 },
    { id: 'p012', name: 'Fresh Ginger', cat: 'fresh', price: 0.99, unit: '250g', desc: 'Juicy adrak for chai, curries and pickles.', stock: 60 },
    // Spices
    { id: 'p020', name: 'Turmeric Powder (Haldi)', cat: 'spices', price: 2.99, unit: '400g', desc: 'Bright, earthy haldi.', stock: 40 },
    { id: 'p021', name: 'Kashmiri Chilli Powder', cat: 'spices', price: 3.99, unit: '400g', desc: 'Vivid colour, gentle heat.', stock: 35 },
    { id: 'p022', name: 'Garam Masala', cat: 'spices', price: 1.99, unit: '100g', desc: 'Warm, aromatic blend for finishing curries.', stock: 50 },
    { id: 'p023', name: 'Cumin Seeds (Jeera)', cat: 'spices', price: 3.49, unit: '400g', desc: 'Whole jeera for tadka and jeera rice.', stock: 40 },
    { id: 'p024', name: 'Coriander Powder (Dhania)', cat: 'spices', price: 2.79, unit: '400g', desc: 'Freshly ground dhania powder.', stock: 40 },
    { id: 'p025', name: 'Black Mustard Seeds (Rai)', cat: 'spices', price: 1.79, unit: '300g', desc: 'For every Gujarati and South Indian tadka.', stock: 40 },
    { id: 'p026', name: 'Hing (Asafoetida)', cat: 'spices', price: 2.49, unit: '100g', desc: 'Strong compounded hing — a pinch goes a long way.', stock: 30 },
    { id: 'p027', name: 'Chaat Masala', cat: 'spices', price: 1.79, unit: '100g', desc: 'Tangy, salty sprinkle for fruit, chaat and raita.', stock: 40 },
    { id: 'p028', name: 'Green Cardamom (Elaichi)', cat: 'spices', price: 4.99, unit: '100g', desc: 'Bold green pods for chai and mithai.', stock: 25 },
    { id: 'p029', name: 'Kasuri Methi', cat: 'spices', price: 1.29, unit: '50g', desc: 'Dried fenugreek leaves for paneer and dal makhani.', stock: 40 },
    // Flour
    { id: 'p030', name: 'Chakki Atta (Whole Wheat)', cat: 'flour', price: 9.99, unit: '10kg', badge: 'Bestseller', desc: 'Stone-ground for soft, puffy rotlis.', stock: 25 },
    { id: 'p031', name: 'Besan (Gram Flour)', cat: 'flour', price: 4.49, unit: '2kg', desc: 'Fine besan for pakora, dhokla and kadhi.', stock: 30 },
    { id: 'p032', name: 'Top-Op Semolina Coarse', cat: 'flour', price: 2.79, mm: 2.49, unit: '1.5kg', img: 'assets/img/products/semolina.jpg', badge: 'MM Card Price', desc: 'Coarse sooji for upma, halwa and handvo. MM Card price £2.49.', stock: 40, featured: true },
    { id: 'p033', name: 'Jumbo Oats', cat: 'flour', price: 2.49, unit: '1kg', img: 'assets/img/products/jumbo-oats.jpg', offer: { qty: 2, price: 2.49, label: 'Buy 1 Get 1 Free' }, badge: 'BOGOF', desc: 'The original favourite — hearty jumbo rolled oats. Buy one, get one free.', stock: 50, featured: true },
    { id: 'p034', name: 'Bajra Flour', cat: 'flour', price: 2.29, unit: '1kg', desc: 'Pearl millet flour for winter bajra rotla.', stock: 20 },
    { id: 'p035', name: 'Rice Flour', cat: 'flour', price: 2.49, unit: '1.5kg', desc: 'For khichu, chakri and crispy dosa.', stock: 25 },
    // Rice
    { id: 'p040', name: 'Extra Long Basmati Rice', cat: 'rice', price: 11.99, unit: '5kg', badge: 'Bestseller', desc: 'Aged basmati — long, fragrant, fluffy grains.', stock: 30 },
    { id: 'p041', name: 'Sona Masoori Rice', cat: 'rice', price: 9.49, unit: '5kg', desc: 'Light, everyday South Indian rice.', stock: 25 },
    { id: 'p042', name: 'Kolam Rice', cat: 'rice', price: 8.99, unit: '5kg', desc: 'Soft short-grain rice, perfect with dal.', stock: 20 },
    { id: 'p043', name: 'Thick Poha', cat: 'rice', price: 2.19, unit: '1kg', desc: 'Flattened rice for kanda poha and chevdo.', stock: 35 },
    // Dal
    { id: 'p050', name: 'Toor Dal', cat: 'dal', price: 5.99, unit: '2kg', badge: 'Bestseller', desc: 'Split pigeon peas — the everyday Gujarati dal.', stock: 40 },
    { id: 'p051', name: 'Moong Dal', cat: 'dal', price: 5.49, unit: '2kg', desc: 'Yellow split moong for khichdi and dal.', stock: 35 },
    { id: 'p052', name: 'Chana Dal', cat: 'dal', price: 4.29, unit: '2kg', desc: 'Nutty split chickpeas.', stock: 35 },
    { id: 'p053', name: 'Urad Dal', cat: 'dal', price: 5.79, unit: '2kg', desc: 'For dosa batter, idli and dal makhani.', stock: 30 },
    { id: 'p054', name: 'Masoor Dal', cat: 'dal', price: 4.49, unit: '2kg', desc: 'Quick-cooking red lentils.', stock: 30 },
    { id: 'p055', name: 'Kabuli Chana', cat: 'dal', price: 4.99, unit: '2kg', desc: 'Large white chickpeas for chole.', stock: 30 },
    { id: 'p056', name: 'Red Kidney Beans (Rajma)', cat: 'dal', price: 3.49, unit: '1kg', desc: 'For Sunday rajma chawal.', stock: 25 },
    // Snacks
    { id: 'p060', name: 'Bhavnagri Gathia', cat: 'snacks', price: 2.99, unit: '400g', desc: 'Soft, crunchy besan gathiya — best with chai and papaya sambharo.', stock: 30 },
    { id: 'p061', name: 'Sev Mamra', cat: 'snacks', price: 2.49, unit: '400g', desc: 'Light puffed rice and sev mix.', stock: 30 },
    { id: 'p062', name: 'Khatta Meetha Mix', cat: 'snacks', price: 2.49, unit: '400g', desc: 'Sweet, tangy and spicy namkeen.', stock: 30 },
    { id: 'p063', name: 'Bhakarwadi', cat: 'snacks', price: 2.29, unit: '285g', desc: 'Spiced spiral snack with a sweet-sour kick.', stock: 25 },
    { id: 'p064', name: 'Masala Khakhra', cat: 'snacks', price: 1.99, unit: '200g', desc: 'Roasted, crisp Gujarati khakhra.', stock: 30 },
    { id: 'p065', name: 'Kerala Banana Chips', cat: 'snacks', price: 2.99, unit: '400g', desc: 'Thin, crisp, fried in coconut oil.', stock: 25 },
    // Sweets
    { id: 'p070', name: 'Dussehra Special Combo', cat: 'sweets', price: 6.99, unit: 'combo', img: 'assets/img/products/dussehra-combo.jpg', badge: 'Festive Combo', desc: 'Fresh jalebi, Bhavnagri gathia and papaya sambharo — the classic Dussehra trio in one combo.', stock: 15, featured: true },
    { id: 'p071', name: 'Fresh Jalebi', cat: 'sweets', price: 4.49, unit: '500g', desc: 'Crisp, syrupy spirals made fresh.', stock: 20 },
    { id: 'p072', name: 'Kaju Katli', cat: 'sweets', price: 9.99, unit: '500g', badge: 'Gift', desc: 'Silver-leaf cashew fudge — the perfect gift box.', stock: 20 },
    { id: 'p073', name: 'Motichoor Ladoo', cat: 'sweets', price: 5.99, unit: '500g', desc: 'Melt-in-the-mouth boondi ladoo.', stock: 20 },
    { id: 'p074', name: 'Soan Papdi', cat: 'sweets', price: 2.49, unit: '250g', desc: 'Flaky, ghee-rich classic.', stock: 30 },
    { id: 'p075', name: 'Gulab Jamun', cat: 'sweets', price: 3.99, unit: '1kg tin', desc: 'Soft khoya dumplings in rose syrup.', stock: 25 },
    // Hot counter
    { id: 'p080', name: 'Veg Puff', cat: 'hot', price: 2.50, unit: 'each', img: 'assets/img/products/veg-puff.jpg', offer: { qty: 2, price: 2.50, label: 'Buy 1 Get 1 Free' }, badge: 'BOGOF', desc: 'Golden, flaky puff pastry filled with spiced potato and peas, baked fresh. Buy 1 get 1 free.', stock: 40, featured: true },
    { id: 'p081', name: 'Punjabi Samosa', cat: 'hot', price: 1.99, unit: '2 pcs', desc: 'Crisp pastry, spiced potato and peas.', stock: 40 },
    { id: 'p082', name: 'Khasta Kachori', cat: 'hot', price: 2.49, unit: '4 pcs', desc: 'Flaky moong-dal kachori.', stock: 30 },
    { id: 'p083', name: 'Khaman Dhokla', cat: 'hot', price: 3.49, unit: '400g', desc: 'Soft, spongy besan dhokla with mustard tadka.', stock: 20 },
    // Frozen
    { id: 'p090', name: 'Frozen Undhiyu Mix', cat: 'frozen', price: 4.99, unit: '1kg', badge: 'Winter Special', desc: 'Prepped Surti undhiyu vegetables — just add muthia and masala.', stock: 20 },
    { id: 'p091', name: 'Malabar Paratha', cat: 'frozen', price: 2.49, unit: '5 pcs', desc: 'Flaky layered parathas — straight from freezer to tawa.', stock: 30 },
    { id: 'p092', name: 'Aloo Paratha', cat: 'frozen', price: 2.99, unit: '4 pcs', desc: 'Stuffed potato parathas.', stock: 30 },
    { id: 'p093', name: 'Frozen Grated Coconut', cat: 'frozen', price: 1.99, unit: '400g', desc: 'Freshly grated, frozen for convenience.', stock: 25 },
    // Chilled
    { id: 'p100', name: 'Fresh Paneer Block', cat: 'chilled', price: 9.99, unit: '1kg', desc: 'Soft malai paneer.', stock: 20 },
    { id: 'p101', name: 'Pure Cow Ghee', cat: 'chilled', price: 11.99, unit: '1kg', desc: 'Rich, granular desi ghee.', stock: 20 },
    { id: 'p102', name: 'Set Dahi (Yoghurt)', cat: 'chilled', price: 3.99, unit: '2kg', desc: 'Thick, creamy homestyle dahi.', stock: 20 },
    { id: 'p103', name: 'Methi Thepla', cat: 'chilled', price: 3.49, unit: '10 pcs', desc: 'Soft travel-friendly theplas.', stock: 20 },
    // Pantry
    { id: 'p110', name: 'Yippee! Magic Masala Noodles', cat: 'pantry', price: 0.39, unit: '65g', img: 'assets/img/products/yippee.jpg', offer: { qty: 7, price: 1.00, label: '7 for £1' }, badge: '7 for £1', desc: 'Small noodles, big happiness — 39p each or 7 for £1.', stock: 200, featured: true },
    { id: 'p111', name: 'Maggi Sauces (Tamarind / Hot & Sweet / Masala Chilli)', cat: 'pantry', price: 2.49, mm: 1.99, unit: '500g', img: 'assets/img/products/maggi-sauces.jpg', badge: 'MM Card £1.99', desc: 'Same great taste for less — MM Card price £1.99 (was £2.49).', stock: 60, featured: true },
    { id: 'p112', name: 'Mango Pickle', cat: 'pantry', price: 2.79, unit: '500g', desc: 'Punjabi-style aam ka achaar.', stock: 30 },
    { id: 'p113', name: 'Lime Pickle', cat: 'pantry', price: 2.79, unit: '500g', desc: 'Tangy, spicy nimbu achaar.', stock: 30 },
    { id: 'p114', name: 'Mustard Oil', cat: 'pantry', price: 4.49, unit: '1L', desc: 'Pungent kachi ghani mustard oil.', stock: 25 },
    // Tea
    { id: 'p120', name: 'Strong CTC Tea', cat: 'tea', price: 6.49, unit: '1kg', desc: 'Robust Assam CTC for kadak masala chai.', stock: 30 },
    { id: 'p121', name: 'Elaichi Rusk', cat: 'tea', price: 1.49, unit: '200g', desc: 'Crunchy cardamom toast — chai’s best friend.', stock: 40 },
    { id: 'p122', name: 'Glucose Biscuits', cat: 'tea', price: 0.99, unit: '250g', desc: 'The nostalgic classic.', stock: 50 },
    { id: 'p123', name: 'Rose Sharbat', cat: 'tea', price: 3.49, unit: '750ml', desc: 'Cooling rose syrup for milk and falooda.', stock: 20 },
    // Pooja
    { id: 'p130', name: 'Fresh Mango Leaves', cat: 'pooja', price: 1.49, unit: 'bunch', img: 'assets/img/products/mango-leaves.jpg', badge: 'Puja', desc: 'For toran, kalash and every auspicious beginning.', stock: 30, featured: true },
    { id: 'p131', name: 'Durva Grass', cat: 'pooja', price: 0.99, unit: 'bunch', img: 'assets/img/products/durva.jpg', badge: 'Puja', desc: 'Sacred durva — Lord Ganesha’s favourite offering.', stock: 30 },
    { id: 'p132', name: 'Puja Samagri Kit', cat: 'pooja', price: 4.99, unit: 'kit', img: 'assets/img/products/puja-samagri.jpg', desc: 'Kumkum, haldi, akshat, kapoor, wicks, janoi and more — everything for a complete puja.', stock: 25, featured: true },
    { id: 'p133', name: 'Dandiya Sticks', cat: 'pooja', price: 0.50, unit: 'pair', img: 'assets/img/products/dandiya.jpg', badge: 'Only 50p', desc: 'Colourful dandiya for Navratri raas-garba nights.', stock: 100 },
    { id: 'p134', name: 'Clay Diyas', cat: 'pooja', price: 2.99, unit: '12 pcs', desc: 'Hand-shaped terracotta diyas.', stock: 40 },
    { id: 'p135', name: 'Cotton Wicks (Vati)', cat: 'pooja', price: 0.99, unit: '100 pcs', desc: 'Round cotton wicks for diya and aarti.', stock: 50 },
    { id: 'p136', name: 'Agarbatti (Incense)', cat: 'pooja', price: 1.49, unit: '100g', desc: 'Sandalwood and rose incense sticks.', stock: 40 },
    { id: 'p137', name: 'Whole Coconut (Shriphal)', cat: 'pooja', price: 0.89, unit: 'each', desc: 'For puja, chutney and prasad.', stock: 40 }
  ]
};

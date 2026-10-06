/* Meow Tea Moment — menu data, taken from the in-store menu board.
   Prices are for a Regular cup, in pounds. Edit this file to update the site. */
window.MEOW = {
  extras: { large: 0.5, warm: 0.5, dairy: 0.6 },
  levels: [
    { id: "none", label: "None", pct: 0 },
    { id: "little", label: "Little", pct: 30 },
    { id: "half", label: "Half", pct: 50 },
    { id: "standard", label: "Standard", pct: 100 },
    { id: "max", label: "Max", pct: 120 }
  ],
  dairy: ["Fresh Milk", "Soya Milk"],
  addons: [
    { name: "Pearl", price: 0.5, color: "#3b2219", kind: "pearl" },
    { name: "White Pearl", price: 0.5, color: "#fff6e6", kind: "pearl" },
    { name: "Aloe", price: 0.5, color: "#e4f3d2", kind: "cube" },
    { name: "Coconut Jelly", price: 0.5, color: "#fffdf4", kind: "cube" },
    { name: "Grass Jelly", price: 0.5, color: "#2c2622", kind: "cube" },
    { name: "Coffee Jelly", price: 0.5, color: "#5b3a26", kind: "cube" },
    { name: "Pudding", price: 0.5, color: "#f7d776", kind: "cube" },
    { name: "Oreo", price: 0.5, color: "#3a3231", kind: "crumb" },
    { name: "Red Bean", price: 0.8, color: "#8e3b3b", kind: "bean" },
    { name: "Cherry Popping", price: 0.8, color: "#d5283f", kind: "pop" },
    { name: "Passionfruit Popping", price: 0.8, color: "#f6a821", kind: "pop" },
    { name: "Apple Green Popping", price: 0.8, color: "#8fd43f", kind: "pop" },
    { name: "Lychee Popping", price: 0.8, color: "#f1ebe6", kind: "pop" },
    { name: "Strawberry Popping", price: 0.8, color: "#f0524f", kind: "pop" },
    { name: "Mango Popping", price: 0.8, color: "#ffc533", kind: "pop" },
    { name: "Mango Star Coconut Jelly", price: 0.8, color: "#ffd75e", kind: "star" }
  ],
  categories: [
    {
      id: "topping", name: "Topping Milk Tea", note: "Milk tea with the topping already in the cup.",
      items: [
        ["Pearl Milk Tea", "珍珠奶茶", 4.3], ["White Pearl Milk Tea", "白珍珠奶茶", 4.3],
        ["Pearl-Mixed Milk Tea", "黑白珍珠奶茶", 4.3], ["Coconut Jelly Milk Tea", "椰果奶茶", 4.3],
        ["Grass Jelly Milk Tea", "仙草奶茶", 4.3], ["Pudding Milk Tea", "布丁奶茶", 4.3],
        ["Oreo Cookie Milk Tea", "Oreo曲奇奶茶", 4.3], ["Coffee Jelly Milk Tea", "咖啡凍奶茶", 4.3],
        ["Red Bean Milk Tea", "紅豆奶茶", 4.8], ["Fresh Taro Milk Tea", "鮮芋奶茶", 4.8]
      ]
    },
    {
      id: "foam", name: "Creamy Milk Foam", note: "Tea under a thick cap of salted milk foam.",
      items: [
        ["Creamy Green Tea", "綠茶奶蓋", 4.3], ["Creamy Earl Grey Tea", "紅茶奶蓋", 4.3],
        ["Creamy Roasted Oolong", "炭培烏龍奶蓋", 4.3], ["Creamy Chocolate", "朱古力奶蓋", 4.5],
        ["Creamy Taro", "香芋奶蓋", 4.5], ["Creamy Uji Matcha", "宇治抹茶奶蓋", 5.0]
      ]
    },
    {
      id: "classic", name: "Classic Milk Tea", note: "The plain ones. Add a topping if you like.",
      items: [
        ["Jasmine Green Milk Tea", "茉香奶茶", 4.0], ["Earl Grey Milk Tea", "佰爵奶茶", 4.0],
        ["Roasted Oolong Milk Tea", "炭培烏龍奶茶", 4.0], ["Taro Milk Tea", "香芋奶茶", 4.3],
        ["Rose Milk Tea", "玫瑰奶茶", 4.3], ["Chocolate Milk Tea", "朱古力奶茶", 4.3],
        ["Strawberry Milk Tea", "士多啤梨奶茶", 4.3], ["Uji Matcha", "宇治抹茶", 4.8],
        ["Uji Hojicha", "宇治培茶", 4.8]
      ]
    },
    {
      id: "brown", name: "Brown Sugar Series", note: "Warm brown sugar syrup streaked down the cup.",
      items: [
        ["Brown Sugar Pearl Milk Tea", "黑糖珍珠奶茶", 4.5],
        ["Brown Sugar Pearl Fresh Milk Tea", "黑糖珍珠鮮奶", 4.8],
        ["Brown Sugar Uji Matcha", "黑糖宇治抹茶", 5.0]
      ]
    },
    {
      id: "fruit", name: "Meow Fruit-tea", note: "Caffeine-free fruit tea is available, good for kids.",
      items: [
        ["Mango Green Tea", "芒果綠茶", 3.8], ["Lychee Black Tea", "荔枝紅茶", 3.8],
        ["Strawberry Black Tea", "士多啤梨紅茶", 3.8], ["Passionfruit Green Tea", "百香果綠茶", 3.8],
        ["Honey Peach Green Tea", "水蜜桃綠茶", 3.8], ["Honey Aloe", "蜂蜜蘆薈", 3.8],
        ["Honey Green Tea", "蜂蜜綠茶", 3.8], ["Rose Green Tea", "玫瑰綠茶", 3.8],
        ["Apple Green Tea", "青蘋果綠茶", 3.8], ["Lemon Green Tea", "檸檬綠茶", 3.8]
      ]
    },
    {
      id: "cold", name: "Cold & Cool Series", note: "Milkshakes and blended ice. Served cold only.", coldOnly: true,
      items: [
        ["Taro Milkshake", "鮮芋冰奶昔", 4.5], ["Red Bean Milkshake", "紅豆冰奶昔", 4.8],
        ["Oreo Coco Milkshake", "Oreo可可奶昔", 4.8], ["Strawberry Milkshake", "士多啤梨冰奶昔", 4.5],
        ["Passionfruit Smoothie", "百香果沙冰", 4.5], ["Chocolate Smoothie", "朱古力沙冰", 4.5],
        ["Lemon Aloe Smoothie", "檸檬蘆薈沙冰", 4.5], ["Lychee Aloe Smoothie", "荔枝蘆薈沙冰", 4.5]
      ]
    },
    {
      id: "pure", name: "Pure Tea Series", note: "Just tea, and winter melon three ways.",
      items: [
        ["Earl Grey Tea", "佰爵純茶", 2.8], ["Jasmine Green Tea", "茉香純茶", 2.8],
        ["Roasted Oolong Tea", "炭培烏龍純茶", 2.8], ["Winter Melon Tea", "冬瓜茶", 3.5],
        ["Winter Melon Lemon", "冬瓜檸檬", 3.8], ["Winter Melon Milk Tea", "冬瓜鮮奶", 3.8]
      ]
    },
    {
      id: "coffee", name: "Coffee Series", note: "Hong Kong yuenyeung: coffee and milk tea in one cup.",
      items: [
        ["Meow Coffee with Milk Tea", "港式鴛鴦", 4.8],
        ["Meow Coffee with Brown Sugar Milk Tea", "黑糖鴛鴦", 5.0]
      ]
    }
  ],
  /* Opening hours in London time, 24h. 0 = Sunday. null = closed. */
  hours: [
    ["12:00", "20:00"], ["12:00", "20:00"], null, ["12:00", "20:00"],
    ["12:00", "20:00"], ["12:00", "20:00"], ["12:00", "20:00"]
  ],
  /* One-off closures. The notice bar and "open now" badge follow these automatically. */
  closures: [
    {
      from: "2026-09-28T00:00:00+01:00", until: "2026-10-09T14:00:00+01:00",
      message: "We are taking a short break. Closed 28 Sept to 8 Oct, back Friday 9 October from 2pm."
    }
  ]
};

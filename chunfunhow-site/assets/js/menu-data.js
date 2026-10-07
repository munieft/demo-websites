/* Chun Fun How London Victoria — in-store menu.
   Edit prices and items here; the menu page and the drink builder both read this file.
   flags: r = shop recommendation 店長推薦, h = can be served hot, c = caffeine free,
          f = fixed sweetness, v = cheese foam suggested
   tone:  colour used for the tea in the drink builder */
window.CFH = {
  whatsapp: "447443884258",
  orderUrl: "https://orders.embargoapp.com/chunfunhow/home",
  /* 0 = Sunday. Times are London time, 24h. */
  hours: [
    ["11:30", "19:30"], ["11:30", "19:30"], ["11:30", "19:30"], ["11:30", "19:30"],
    ["11:30", "20:00"], ["11:30", "20:00"], ["11:00", "20:00"]
  ],
  top8: [
    { en: "Lychee Jade Tea with Aloe Vera", zh: "玉荷青蘆薈蜜", price: 5.7, img: "p14.jpg" },
    { en: "Osmanthus Oolong Tea Latte with Pearls", zh: "桂花珍珠烏龍鮮奶茶", price: 6.1, img: "p13.jpg" },
    { en: "Grape & Lychee Jade Tea with Aloe Vera", zh: "葡萄玉荷青蘆薈蜜", price: 5.8, img: "p41.jpg" },
    { en: "Nilgiris Black Milk Tea with Pearls", zh: "尼爾吉爾莊園珍珠奶茶", price: 5.7, img: "p27.jpg" },
    { en: "Brown Sugar Milk Tea with Pearls", zh: "黑糖珍珠奶茶", price: 6.1, img: "p11.jpg" },
    { en: "Golden Honey Milk Tea with Pearls", zh: "黃金蜂蜜珍珠奶茶", price: 5.9, img: "p29.jpg" },
    { en: "Passion Fruit & Orange Green Tea with Pineapple Jelly", zh: "柳橙百香綠配鳳梨椰果", price: 5.8, img: "best7.jpg" },
    { en: "Peach & Grapefruit Green Tea with Aloe Vera", zh: "柚見蜜桃配蘆薈", price: 5.7, img: "p26.jpg" }
  ],
  categories: [
    { id: "osmanthus", en: "Osmanthus & Rose", zh: "桂花玫瑰系列", note: "Hot drink available", items: [
      { en: "Osmanthus Oolong Tea", zh: "桂花烏龍", price: 4.8, flags: "h", tone: "#C98F3C" },
      { en: "Osmanthus Oolong / Jasmine Tea Latte", zh: "桂花烏龍／茉香鮮奶茶", price: 5.2, flags: "rh", tone: "#D9B88C" },
      { en: "Rose Oolong Tea Latte", zh: "玫瑰烏龍鮮奶茶", price: 5.2, flags: "h", tone: "#E2B7A6" },
      { en: "Osmanthus Fresh Milk", zh: "桂花鮮奶", price: 4.8, flags: "hc", tone: "#F3E7CB" }
    ]},
    { id: "milk-tea", en: "Milk Tea", zh: "奶茶系列", note: "Hot drink available", items: [
      { en: "Nilgiris Black Milk Tea", zh: "尼爾吉爾莊園奶茶", price: 4.8, flags: "rh", tone: "#C9A27E" },
      { en: "Jasmine Green Milk Tea", zh: "茉香奶茶", price: 4.8, flags: "rh", tone: "#DCCB9F" },
      { en: "Oolong Milk Tea", zh: "烏龍奶茶", price: 4.8, flags: "h", tone: "#C6A074" },
      { en: "Golden Honey Milk Tea", zh: "黃金蜂蜜奶茶", price: 5.0, flags: "h", tone: "#DDB67F" }
    ]},
    { id: "brown-sugar", en: "Brown Sugar", zh: "黑糖系列", note: "Fixed sweetness", items: [
      { en: "Nilgiris Brown Sugar Milk Tea", zh: "尼爾吉爾莊園黑糖奶茶", price: 5.2, flags: "rhf", tone: "#B98A5E" },
      { en: "Brown Sugar Fresh Milk", zh: "黑糖鮮奶", price: 4.9, flags: "hcf", tone: "#E9D8BD" },
      { en: "Brown Sugar Coffee Latte", zh: "黑糖咖啡拿鐵", price: 5.2, flags: "f", tone: "#9C7250" }
    ]},
    { id: "special", en: "Chun Fun Specials", zh: "春芳特調", note: "Hot drink available", items: [
      { en: "Matcha Latte", zh: "抹茶拿鐵", price: 5.2, flags: "hv", tone: "#A9C77E" },
      { en: "Cocoa Milk Tea / Cocoa Latte", zh: "可可奶茶／可可拿鐵", price: 5.0, flags: "rhv", tone: "#8E5E44" },
      { en: "Hazelnut Cocoa Milk Tea", zh: "金莎奶茶", price: 5.2, flags: "h", tone: "#9A6A4C" },
      { en: "Taro Fresh Milk / Taro Green Milk Tea", zh: "芋頭鮮奶／芋香奶茶", price: 5.2, flags: "h", tone: "#CDB7DA" }
    ]},
    { id: "lychee", en: "Lychee", zh: "荔枝系列", items: [
      { en: "Lychee Jade / Oolong Tea", zh: "玉荷青／烏龍", price: 4.8, flags: "r", tone: "#EED58A" },
      { en: "Lychee & Guava Green Tea", zh: "荔枝芭樂綠茶", price: 4.8, flags: "", tone: "#F2C7A0" },
      { en: "Rose & Lychee Jade Tea", zh: "玫瑰玉荷青", price: 4.9, flags: "", tone: "#F0B7B0" },
      { en: "Grape & Lychee Jade Tea", zh: "葡萄玉荷青", price: 4.9, flags: "r", tone: "#C8475A" }
    ]},
    { id: "peach", en: "Peach", zh: "水蜜桃系列", items: [
      { en: "Peach Jade Tea", zh: "水蜜桃青", price: 4.8, flags: "", tone: "#F3BE8E" },
      { en: "Peach & Lychee Jade Tea", zh: "水蜜桃荔枝青茶", price: 4.8, flags: "r", tone: "#F4C79C" },
      { en: "Peach & Grapefruit Green Tea", zh: "柚見蜜桃", price: 4.8, flags: "", tone: "#F29A6B" },
      { en: "Peach & Guava Green Tea", zh: "桃氣樂芭", price: 4.8, flags: "", tone: "#F3AE93" }
    ]},
    { id: "tropical", en: "Tropical", zh: "熱帶風味", items: [
      { en: "Passion Fruit Jade Tea", zh: "百香果青", price: 4.9, flags: "", tone: "#F1B94A" },
      { en: "Passion Fruit & Orange Green Tea", zh: "柳橙百香綠", price: 4.9, flags: "r", tone: "#F2A93B" },
      { en: "Passion Fruit & Lychee Jade Tea", zh: "百香荔枝青茶", price: 4.9, flags: "", tone: "#F0C56A" },
      { en: "Mango & Peach Green Tea", zh: "芒果水蜜桃玉露", price: 4.9, flags: "", tone: "#F4B33F" },
      { en: "Pineapple & Lychee Green Tea", zh: "鳳梨玉荷綠", price: 4.9, flags: "rf", tone: "#F2D26B" }
    ]},
    { id: "yakult", en: "Yakult & Cheese Foam", zh: "多多／芝士奶蓋", items: [
      { en: "Peach Yakult / Grape Yakult", zh: "水蜜桃多多／葡萄多多", price: 5.3, flags: "r", tone: "#F3B9A6" },
      { en: "Passion Fruit & Lychee Yakult", zh: "百香荔枝多多", price: 5.3, flags: "", tone: "#F3D08A" },
      { en: "Jasmine Tea Yakult", zh: "綠茶多多", price: 4.9, flags: "", tone: "#E7E2A6" },
      { en: "Oolong / Jade Tea with Cheese Foam", zh: "朵朵烏龍／朵朵四季春", price: 5.3, flags: "r", tone: "#C99A4B", foam: true },
      { en: "Lychee / Grape Jade Tea with Cheese Foam", zh: "朵朵玉荷青／朵朵葡萄青", price: 5.9, flags: "", tone: "#E7C777", foam: true }
    ]},
    { id: "honey", en: "Fruit Tea & Honey", zh: "水果茶及蜂蜜系列", items: [
      { en: "Honey Citrus Jade Tea", zh: "黃金蜜柚青", price: 4.8, flags: "r", tone: "#EFCB62" },
      { en: "Honey Orange / Grapefruit Green Tea", zh: "黃金蜜柳橙綠／葡萄柚綠", price: 4.8, flags: "", tone: "#F3A55C" },
      { en: "Honey Black / Oolong / Green Tea", zh: "黃金蜜紅／烏龍／綠", price: 4.8, flags: "h", tone: "#C9862F" }
    ]},
    { id: "winter-melon", en: "Winter Melon", zh: "冬瓜茶系列", note: "Fixed sweetness · hot drink available", items: [
      { en: "Winter Melon Oolong Tea", zh: "冬瓜烏龍", price: 4.8, flags: "rhf", tone: "#B4722C" },
      { en: "Winter Melon Fresh Milk / Juice", zh: "冬瓜鮮奶／冬瓜茶", price: 4.8, flags: "hcfv", tone: "#D8B88A" }
    ]},
    { id: "fresh-tea", en: "Fresh Tea", zh: "純茶系列", note: "Hot drink available", items: [
      { en: "Four Seasons Jade / Jasmine Green Tea", zh: "四季春青茶／茉莉綠茶", price: 4.2, flags: "h", tone: "#D9C56A" },
      { en: "Nilgiris Black / Narcissus Oolong Tea", zh: "尼爾吉爾莊園紅茶／水仙烏龍茶", price: 4.2, flags: "h", tone: "#A85A28" }
    ]}
  ],
  toppings: [
    { id: "pearls", en: "Pearls", zh: "珍珠", price: 0.9 },
    { id: "aloe", en: "Aloe Vera", zh: "蘆薈", price: 0.9 },
    { id: "coconut", en: "Coconut Jelly", zh: "椰果", price: 0.9, detail: "Original or pineapple" },
    { id: "pudding", en: "Caramel Pudding", zh: "焦糖布丁", price: 0.9 },
    { id: "grass", en: "Grass Jelly", zh: "仙草凍", price: 0.9 },
    { id: "popping", en: "Popping Pearls", zh: "爆爆珠", price: 0.9, detail: "Mango, lychee or strawberry" },
    { id: "foam", en: "Cheese Foam", zh: "芝士奶蓋", price: 1.1 }
  ],
  sweetness: [["Regular", "全糖", 100], ["Less", "少糖", 80], ["Half", "半糖", 50], ["Slight", "微糖", 30], ["No sugar", "無糖", 0]],
  ice: [["Regular ice", "全冰", 4], ["Half ice", "半冰", 3], ["Slight ice", "微冰", 1], ["No ice", "去冰", 0]]
};

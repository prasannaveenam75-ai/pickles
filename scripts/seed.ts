import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/devi-pickles";

const PX = (id: number) => `/images/products/${id}.jpg`;

const categories = [
  { name: "Veg Pickles", slug: "veg-pickles", description: "Traditional vegetarian pickles made with authentic home recipes, sun-cured spices and the finest ingredients.", image: PX(35267279), displayOrder: 1, active: true, seoTitle: "Veg Pickles | Buy Online", seoDescription: "Shop authentic homemade vegetarian pickles - mango, gongura, lemon, tomato, garlic, amla and more." },
  { name: "Non-Veg Pickles", slug: "non-veg-pickles", description: "Rich, flavourful non-vegetarian pickles prepared the traditional way with slow-cooked spices.", image: PX(35532821), displayOrder: 2, active: true, seoTitle: "Non-Veg Pickles | Buy Online", seoDescription: "Authentic chicken, mutton, prawn and fish pickles made with traditional Andhra-style recipes." },
  { name: "Powders", slug: "powders", description: "Authentic spice powders and podis crafted by dry-roasting whole spices the traditional way.", image: PX(7208238), displayOrder: 3, active: true, seoTitle: "Powders & Podis | Buy Online", seoDescription: "Traditional Andhra spice powder, idli podi and curry leaf powder made from hand-roasted spices." },
];

type VariantSeed = { name: string; weight: string; weightInGrams: number; price: number; compareAtPrice: number; stock: number };

interface ProductSeed {
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  images: string[];
  variants: VariantSeed[];
  ingredients: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  shelfLife: string;
  storageInstructions: string;
  featured: boolean;
  bestSeller: boolean;
  seoTitle: string;
  seoDescription: string;
}

const V = (name: string, weight: string, grams: number, price: number, compareAt: number, stock = 50): VariantSeed => ({ name, weight, weightInGrams: grams, price, compareAtPrice: compareAt, stock });

const products: ProductSeed[] = [
  {
    name: "Andhra Mango Pickle",
    slug: "andhra-mango-pickle",
    category: "Veg Pickles",
    subcategory: "Mango Pickle",
    shortDescription: "Our signature raw mango pickle, hand-cut and cured with traditional Andhra spices.",
    description: "The crown jewel of the Devi Pickles range. Plump raw mangoes are hand-cut, sun-cured and tossed with our family masala - freshly ground red chillies, mustard, fenugreek and a generous pour of gingelly oil. The result is a pickle that is simultaneously tangy, fiery and deeply satisfying.\n\nEach batch is prepared in small quantities the way our grandmothers made it, then left to mature in ceramic jars for the spices to bloom. Serve it with hot rice and ghee, or alongside your favourite dal - this is the taste of an Andhra home.",
    images: [PX(35267279), PX(7812134)],
    variants: [V("250g", "250g", 250, 299, 349), V("500g", "500g", 500, 569, 649, 30)],
    ingredients: ["Raw Mango", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Garlic", "Rock Salt", "Turmeric"],
    tags: ["veg", "mango", "avakaya", "andhra", "signature", "spicy"],
    rating: 4.9,
    reviewCount: 128,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Andhra Mango Pickle (250g) | Devi Pickles",
    seoDescription: "Buy authentic Andhra mango pickle online. Hand-cut raw mangoes in traditional spices. 250g at Rs 299.",
  },
  {
    name: "Gongura Pickle",
    slug: "gongura-pickle",
    category: "Veg Pickles",
    subcategory: "Leafy Pickle",
    shortDescription: "Signature Andhra pickle made from tangy gongura (sorrel) leaves.",
    description: "Gongura is the soul of Andhra cuisine, and our Gongura Pickle is the perfect tribute to it. Fresh sorrel leaves are steamed, purred and slowly cooked with garlic, red chilli and a tempering of mustard and fenugreek to create a pickle that is unmistakably tangy and absolutely addictive.\n\nThe leaves bring a natural sourness that pairs beautifully with spicy rice and ghee. Once you taste it, a simple meal quietly becomes a feast.",
    images: [PX(38521742), PX(38521741)],
    variants: [V("250g", "250g", 250, 329, 379), V("500g", "500g", 500, 629, 719, 30)],
    ingredients: ["Gongura Leaves", "Red Chilli", "Garlic", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "gongura", "andhra", "tangy", "leafy"],
    rating: 4.8,
    reviewCount: 96,
    shelfLife: "9 months from date of manufacture",
    storageInstructions: "Refrigerate for best taste after opening. Always use a clean, dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Gongura Pickle (250g) | Devi Pickles",
    seoDescription: "Buy authentic Andhra gongura pickle online. Tangy sorrel leaf pickle, 250g at Rs 329.",
  },
  {
    name: "Lemon Pickle",
    slug: "lemon-pickle",
    category: "Veg Pickles",
    subcategory: "Citrus Pickle",
    shortDescription: "Zesty sun-cured lemons in a spicy, tangy masala.",
    description: "Golden lemons are quartered, salted and left to sun-cure before being tossed in a fiery blend of red chilli, turmeric, mustard and fenugreek. With every bite you get the bright zing of citrus balanced by a warm, slow-building heat.\n\nA year-round favourite that brightens up curd rice, parathas and simple khichdi. Our Lemon Pickle is the taste of long summer afternoons, preserved in a jar.",
    images: [PX(1516382901417), PX(5410417)],
    variants: [V("250g", "250g", 250, 249, 299), V("500g", "500g", 500, 469, 549, 30)],
    ingredients: ["Lemon", "Red Chilli", "Turmeric", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "lemon", "zesty", "tangy", "nimbu"],
    rating: 4.7,
    reviewCount: 84,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store away from direct sunlight. Refrigerate after opening; use a dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Lemon Pickle (250g) | Devi Pickles",
    seoDescription: "Buy tangy lemon pickle online. Sun-cured lemons in spicy masala, 250g at Rs 249.",
  },
  {
    name: "Tomato Pickle",
    slug: "tomato-pickle",
    category: "Veg Pickles",
    subcategory: "Vegetable Pickle",
    shortDescription: "Rich, tangy and slightly sweet - a homestyle tomato pickle.",
    description: "Ripe, flavourful tomatoes are slow-reduced with garlic, red chilli and a hint of jaggery to create a pickle that is jammy, tangy and deeply savoury. It is the kind of pickle that disappears faster than you expect.\n\nPerfect with dosa, chapati and curd rice. Our Tomato Pickle brings the comfort of a home kitchen to every meal.",
    images: [PX(9164642), PX(38521741)],
    variants: [V("250g", "250g", 250, 279, 329), V("500g", "500g", 500, 529, 619, 30)],
    ingredients: ["Tomato", "Red Chilli", "Garlic", "Jaggery", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "tomato", "tangy", "homestyle"],
    rating: 4.8,
    reviewCount: 73,
    shelfLife: "9 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Always use a clean, dry spoon.",
    featured: false,
    bestSeller: true,
    seoTitle: "Tomato Pickle (250g) | Devi Pickles",
    seoDescription: "Buy homestyle tomato pickle online. Rich and tangy, 250g at Rs 279.",
  },
  {
    name: "Garlic Pickle",
    slug: "garlic-pickle",
    category: "Veg Pickles",
    subcategory: "Allium Pickle",
    shortDescription: "Plump garlic pods in a pungent, aromatic masala.",
    description: "Whole garlic pods are gently cooked until tender and cloaked in a robust masala of red chilli, mustard and fenugreek. The result is a pickle with real personality - pungent, warm and utterly moreish.\n\nLoved with rice, parathas and grilled vegetables alike, Garlic Pickle is the bold choice for those who enjoy deep, savoury flavour.",
    images: [PX(32147313), PX(14363801)],
    variants: [V("250g", "250g", 250, 299, 349), V("500g", "500g", 500, 569, 659, 30)],
    ingredients: ["Garlic", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt", "Turmeric"],
    tags: ["veg", "garlic", "pungent", "vellulli"],
    rating: 4.9,
    reviewCount: 102,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place. Refrigerate after opening.",
    featured: false,
    bestSeller: true,
    seoTitle: "Garlic Pickle (250g) | Devi Pickles",
    seoDescription: "Buy pungent garlic pickle online. Whole garlic pods in aromatic masala, 250g at Rs 299.",
  },
  {
    name: "Amla Pickle",
    slug: "amla-pickle",
    category: "Veg Pickles",
    subcategory: "Fruit Pickle",
    shortDescription: "Tangy Indian gooseberry pickle, rich in flavour and vitamin C.",
    description: "Plump amla (Indian gooseberry) pieces are coated in a tangy, spiced masala that lets the fruit's natural sourness shine. Amla is prized in Indian homes for its health benefits, and this pickle makes it genuinely delicious.\n\nThe perfect balance of tart and spicy makes it a wonderful side to rice and dal. A spoonful of nature's goodness, preserved the traditional way.",
    images: [PX(14363801), PX(28645473)],
    variants: [V("250g", "250g", 250, 269, 319), V("500g", "500g", 500, 509, 599, 30)],
    ingredients: ["Amla", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt", "Turmeric"],
    tags: ["veg", "amla", "gooseberry", "tangy", "healthy"],
    rating: 4.7,
    reviewCount: 61,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store away from sunlight. Refrigerate after opening.",
    featured: false,
    bestSeller: false,
    seoTitle: "Amla Pickle (250g) | Devi Pickles",
    seoDescription: "Buy tangy amla (gooseberry) pickle online. Nutrient-rich, 250g at Rs 269.",
  },
  {
    name: "Chicken Pickle",
    slug: "chicken-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Chicken Pickle",
    shortDescription: "Tender chicken pieces slow-cooked in a fiery Andhra masala.",
    description: "Small, succulent chicken pieces are slow-cooked until fork-tender and sealed in our signature hot pickle oil - a robust blend of red chilli, garlic, ginger, mustard and aromatic whole spices. Each spoonful is rich, fiery and packed with deep savoury flavour.\n\nMade the traditional Andhra way, Chicken Pickle pairs beautifully with hot rice, ghee and a cup of strong filter coffee-cold buttermilk on the side. A true indulgence for non-veg lovers.",
    images: [PX(35532821), PX(29684985)],
    variants: [V("250g", "250g", 250, 449, 499), V("500g", "500g", 500, 859, 959, 30)],
    ingredients: ["Chicken", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt", "Whole Spices"],
    tags: ["non-veg", "chicken", "andhra", "spicy", "kodi"],
    rating: 4.9,
    reviewCount: 186,
    shelfLife: "6 months from date of manufacture",
    storageInstructions: "Keep refrigerated at all times. Always use a clean, dry spoon. Consume within 3 months of opening.",
    featured: true,
    bestSeller: true,
    seoTitle: "Chicken Pickle (250g) | Devi Pickles",
    seoDescription: "Buy authentic Andhra chicken pickle online. Tender chicken in fiery masala, 250g at Rs 449.",
  },
  {
    name: "Mutton Pickle",
    slug: "mutton-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Mutton Pickle",
    shortDescription: "Rich, indulgent boneless mutton pickle for special occasions.",
    description: "Boneless mutton is simmered in a dark, aromatic masala of roasted spices and slow-cooked in pickle oil until each piece is melt-in-the-mouth tender. The flavours deepen as the pickle matures, making it more delicious with every passing day.\n\nA premium offering crafted for festive tables, Mutton Pickle is best enjoyed with hot steamed rice and ghee. Pure indulgence in every spoonful.",
    images: [PX(9609846), PX(29685045)],
    variants: [V("250g", "250g", 250, 549, 599), V("500g", "500g", 500, 1039, 1149, 30)],
    ingredients: ["Boneless Mutton", "Red Chilli", "Garlic", "Ginger", "Garam Masala", "Mustard Seeds", "Gingelly Oil", "Rock Salt"],
    tags: ["non-veg", "mutton", "premium", "rich", "boneless"],
    rating: 4.9,
    reviewCount: 164,
    shelfLife: "6 months from date of manufacture",
    storageInstructions: "Keep refrigerated at all times. Use a clean, dry spoon. Consume within 3 months of opening.",
    featured: true,
    bestSeller: true,
    seoTitle: "Mutton Pickle (250g) | Devi Pickles",
    seoDescription: "Buy premium boneless mutton pickle online. Richly spiced, 250g at Rs 549.",
  },
  {
    name: "Prawn Pickle",
    slug: "prawn-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Seafood Pickle",
    shortDescription: "Coastal-style prawn pickle with a burst of coastal spice.",
    description: "Succulent, cleaned prawns are sautéed with garlic, ginger and a coastal blend of spices, then sealed in pickle oil for that signature Devi warmth. The natural sweetness of the prawns meets the fire of red chilli - a combination that is simply irresistible.\n\nA coastal classic that is wonderful with steaming rice and curd. Close your eyes and you can smell the sea air.",
    images: [PX(9809033), PX(33413491)],
    variants: [V("250g", "250g", 250, 499, 549), V("500g", "500g", 500, 949, 1049, 30)],
    ingredients: ["Prawns", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["non-veg", "prawns", "seafood", "coastal", "royyala"],
    rating: 4.8,
    reviewCount: 117,
    shelfLife: "6 months from date of manufacture",
    storageInstructions: "Keep refrigerated at all times. Use a clean, dry spoon. Consume within 3 months of opening.",
    featured: true,
    bestSeller: true,
    seoTitle: "Prawn Pickle (250g) | Devi Pickles",
    seoDescription: "Buy coastal prawn pickle online. Succulent prawns in spicy masala, 250g at Rs 499.",
  },
  {
    name: "Fish Pickle",
    slug: "fish-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Seafood Pickle",
    shortDescription: "Savoury fish pickle, a traditional household favourite.",
    description: "Flavourful fish pieces are crisped and tossed in a tangy, spicy masala of red chilli, tamarind and whole spices. Every bite is a celebration of traditional coastal cooking - savoury, tart and warming.\n\nThe fish soaks up the masala beautifully, and the oil carries the flavours long after the jar is opened. A hearty, homestyle pickle for rice and roti alike.",
    images: [PX(12081454), PX(38324319)],
    variants: [V("250g", "250g", 250, 469, 519), V("500g", "500g", 500, 889, 989, 30)],
    ingredients: ["Fish", "Red Chilli", "Tamarind", "Garlic", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["non-veg", "fish", "seafood", "tangy", "chepala"],
    rating: 4.7,
    reviewCount: 88,
    shelfLife: "6 months from date of manufacture",
    storageInstructions: "Keep refrigerated at all times. Use a clean, dry spoon. Consume within 3 months of opening.",
    featured: false,
    bestSeller: false,
    seoTitle: "Fish Pickle (250g) | Devi Pickles",
    seoDescription: "Buy savoury fish pickle online. Tangy coastal masala, 250g at Rs 469.",
  },
  {
    name: "Andhra Spice Powder",
    slug: "andhra-spice-powder",
    category: "Powders",
    subcategory: "Curry Powder",
    shortDescription: "Hand-roasted Andhra curry powder for authentic home cooking.",
    description: "A fragrant, freshly-ground blend of red chillies, coriander, cumin, fenugreek, mustard and garlic - dry-roasted in small batches to unlock their aroma and ground the traditional way. One spoonful transforms any curry.\n\nUse it as your everyday curry masala for vegetables, dals, gravies and non-veg preparations. This is the spice tin of every Andhra kitchen, full of warmth and character.",
    images: [PX(7208238), PX(31280796)],
    variants: [V("200g", "200g", 200, 199, 229), V("400g", "400g", 400, 379, 439, 30)],
    ingredients: ["Red Chilli", "Coriander Seeds", "Cumin", "Fenugreek", "Mustard Seeds", "Garlic", "Rock Salt"],
    tags: ["powder", "curry", "andhra", "masala", "spice"],
    rating: 4.8,
    reviewCount: 72,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place. Keep away from moisture.",
    featured: false,
    bestSeller: true,
    seoTitle: "Andhra Spice Powder (200g) | Devi Pickles",
    seoDescription: "Buy authentic Andhra curry powder online. Hand-roasted spices, 200g at Rs 199.",
  },
  {
    name: "Idli Podi",
    slug: "idli-podi",
    category: "Powders",
    subcategory: "Podi / Gunpowder",
    shortDescription: "Classic Andhra gunpowder - roasted Bengal gram, chilli and sesame.",
    description: "Our Idli Podi is the beloved 'gunpowder' of Andhra homes - roasted Bengal gram, dried red chillies, sesame, curry leaves and a whisper of garlic, ground to the perfect coarse texture. Mix it with ghee and it transforms soft idlis, dosas and upma.\n\nThe secret is in the roasting: done low and slow so every seed releases its aroma without turning bitter. Sprinkle it on anything that needs a little fire.",
    images: [PX(38684633), PX(32144895)],
    variants: [V("200g", "200g", 200, 189, 219), V("400g", "400g", 400, 359, 419, 30)],
    ingredients: ["Bengal Gram", "Red Chilli", "Sesame", "Curry Leaves", "Garlic", "Cumin", "Rock Salt", "Asafoetida"],
    tags: ["powder", "podi", "gunpowder", "idli", "dosa"],
    rating: 4.9,
    reviewCount: 145,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    featured: true,
    bestSeller: true,
    seoTitle: "Idli Podi (200g) | Devi Pickles",
    seoDescription: "Buy authentic Andhra idli podi (gunpowder) online. Perfect with ghee, 200g at Rs 189.",
  },
  {
    name: "Red Chilli Pickle",
    slug: "red-chilli-pickle",
    category: "Veg Pickles",
    subcategory: "Chilli Pickle",
    shortDescription: "Fiery sun-dried red chillies in mustard oil - for true spice lovers.",
    description: "Sun-dried red chillies stuffed and layered with a punchy garlic-mustard masala, then aged in mustard oil to deepen the heat. It is bold, fiery and gloriously traditional - not for the faint-hearted.\n\nFor those who love their food with serious kick, Red Chilli Pickle is the ultimate companion to rice and curd. Handle with respect, enjoy with joy.",
    images: [PX(33440719), PX(8693381)],
    variants: [V("250g", "250g", 250, 289, 339), V("500g", "500g", 500, 549, 639, 30)],
    ingredients: ["Red Chilli", "Garlic", "Mustard Seeds", "Mustard Oil", "Rock Salt", "Turmeric", "Fenugreek"],
    tags: ["veg", "chilli", "fiery", "spicy", "pandumirchi"],
    rating: 4.8,
    reviewCount: 92,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place. Refrigerate after opening.",
    featured: false,
    bestSeller: false,
    seoTitle: "Red Chilli Pickle (250g) | Devi Pickles",
    seoDescription: "Buy fiery red chilli pickle online. Sun-dried chillies in mustard oil, 250g at Rs 289.",
  },
  {
    name: "Mixed Vegetable Pickle",
    slug: "mixed-vegetable-pickle",
    category: "Veg Pickles",
    subcategory: "Vegetable Pickle",
    shortDescription: "A colourful medley of vegetables in one homestyle jar.",
    description: "The best of the season - carrots, cauliflower, green chillies and tender lime - pickled together in a warm, spiced masala. Every jar is a colourful, crunchy celebration of vegetables.\n\nThe vegetables stay crisp and soak up the masala beautifully, giving you a different bit of texture in every spoonful. A family favourite that disappears fast at the dining table.",
    images: [PX(38857376), PX(5410417)],
    variants: [V("250g", "250g", 250, 259, 309), V("500g", "500g", 500, 489, 579, 30)],
    ingredients: ["Carrot", "Cauliflower", "Green Chilli", "Lime", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "mixed", "vegetable", "crunchy", "sambar-oshadhi"],
    rating: 4.7,
    reviewCount: 68,
    shelfLife: "9 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Always use a clean, dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Mixed Vegetable Pickle (250g) | Devi Pickles",
    seoDescription: "Buy mixed vegetable pickle online. Crunchy veggie medley, 250g at Rs 259.",
  },
  {
    name: "Curry Leaf Powder",
    slug: "curry-leaf-powder",
    category: "Powders",
    subcategory: "Podi / Gunpowder",
    shortDescription: "Fragrant sundried curry leaves, roasted and ground to order.",
    description: "Fresh curry leaves are washed, sun-dried and gently roasted before being ground into a fragrant, deep-green powder. It is an aromatic garnish that adds an unmistakable South Indian touch to anything it meets.\n\nToast a spoonful in ghee and mix into rice, or sprinkle over chutneys, curd and stir-fries. Pure, honest flavour in a tin.",
    images: [PX(37215213), PX(32144883)],
    variants: [V("200g", "200g", 200, 179, 209), V("400g", "400g", 400, 339, 399, 30)],
    ingredients: ["Curry Leaves", "Rock Salt", "Chana Dal", "Cumin"],
    tags: ["powder", "curry leaf", "karuveppilai", "aromatic"],
    rating: 4.8,
    reviewCount: 57,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dark place.",
    featured: false,
    bestSeller: false,
    seoTitle: "Curry Leaf Powder (200g) | Devi Pickles",
    seoDescription: "Buy aromatic curry leaf powder online. Sundried and hand-roasted, 200g at Rs 179.",
  },
  {
    name: "Sweet Mango Pickle",
    slug: "sweet-mango-pickle",
    category: "Veg Pickles",
    subcategory: "Mango Pickle",
    shortDescription: "A jaggery-kissed feast of mangoes, spices and chillies.",
    description: "Our Sweet Mango Pickle (Maagaya) is the gentle side of Andhra tradition - tender mango pieces bathed in jaggery, red chilli and a whisper of mustard and fenugreek. The result is an unmistakably festive pickle that balances sweet, sour and heat in every bite.\n\nWarm some ghee over hot rice and add a generous spoonful for a meal you will not forget. A dragon of tradition for every festival table.",
    images: [PX(7812134), PX(38521741)],
    variants: [V("250g", "250g", 250, 279, 319), V("500g", "500g", 500, 529, 609, 30)],
    ingredients: ["Raw Mango", "Jaggery", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "mango", "sweet", "maagaya", "jaggery"],
    rating: 4.8,
    reviewCount: 76,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening; use a dry spoon.",
    featured: false,
    bestSeller: true,
    seoTitle: "Sweet Mango Pickle (250g) | Devi Pickles",
    seoDescription: "Buy sweet mango pickle (maagaya) online. Jaggery-kissed festive pickle, 250g at Rs 279.",
  },
  {
    name: "Ginger Pickle",
    slug: "ginger-pickle",
    category: "Veg Pickles",
    subcategory: "Root Pickle",
    shortDescription: "Aromatic allam pickle with a warm, peppery kick.",
    description: "Fresh ginger is julienned and folded into a tangy masala of red chilli, mustard and a squeeze of lemon, then aged slowly in gingelly oil. The ginger keeps its crunch while soaking up warm, aromatic heat.\n\nThe perfect pickle to kickstart sluggish digestion and brighten any meal - wonderful with curd rice and parathas. Homely, warming and genuinely special.",
    images: [PX(8999044), PX(14363801)],
    variants: [V("250g", "250g", 250, 289, 339), V("500g", "500g", 500, 549, 639, 30)],
    ingredients: ["Ginger", "Red Chilli", "Garlic", "Mustard Seeds", "Lemon Juice", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "ginger", "allam", "aromatic", "tangy"],
    rating: 4.7,
    reviewCount: 54,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Always use a clean, dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Ginger Pickle (250g) | Devi Pickles",
    seoDescription: "Buy aromatic ginger (allam) pickle online. Warm and tangy, 250g at Rs 289.",
  },
  {
    name: "Green Chilli Pickle",
    slug: "green-chilli-pickle",
    category: "Veg Pickles",
    subcategory: "Chilli Pickle",
    shortDescription: "Fresh green chillies in a bright, vinegar-tangy masala.",
    description: "Plump green chillies are lightly blanched, slit and packed with a punchy garlic-mustard masala and a drizzle of tangy pickle oil. Unlike its fiery red cousin, this one delivers a fresh, citrusy heat that builds slowly.\n\nA bright, crunchy companion for rice, curd and anything grilled. Made for those who like their spice green and alive.",
    images: [PX(12955689), PX(33440719)],
    variants: [V("250g", "250g", 250, 259, 309), V("500g", "500g", 500, 489, 569, 30)],
    ingredients: ["Green Chilli", "Garlic", "Mustard Seeds", "Lemon", "Gingelly Oil", "Rock Salt"],
    tags: ["veg", "green chilli", "pacchimirchi", "spicy", "fresh"],
    rating: 4.8,
    reviewCount: 83,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place. Refrigerate after opening.",
    featured: false,
    bestSeller: true,
    seoTitle: "Green Chilli Pickle (250g) | Devi Pickles",
    seoDescription: "Buy fresh green chilli pickle online. Bright and tangy-spicy, 250g at Rs 259.",
  },
  {
    name: "Onion Pickle",
    slug: "onion-pickle",
    category: "Veg Pickles",
    subcategory: "Vegetable Pickle",
    shortDescription: "Crunchy pearl onions in a tangy, mildly spiced brine.",
    description: "Small pearl onions are pickled whole so they stay gloriously crunchy, then layered with a mild garlic-mustard masala and a hint of vinegar. Every bite is a satisfying pop of texture followed by mellow, tangy warmth.\n\nThe easiest pickle to love - wonderful on burgers, sandwiches, rice and almost anything savoury. Simple, crunchy and endlessly snackable.",
    images: [PX(12181051), PX(38521741)],
    variants: [V("250g", "250g", 250, 239, 289), V("500g", "500g", 500, 449, 519, 30)],
    ingredients: ["Pearl Onions", "Red Chilli", "Garlic", "Mustard Seeds", "Vinegar", "Rock Salt"],
    tags: ["veg", "onion", "tangy", "crunchy"],
    rating: 4.7,
    reviewCount: 49,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place. Refrigerate after opening.",
    featured: false,
    bestSeller: false,
    seoTitle: "Onion Pickle (250g) | Devi Pickles",
    seoDescription: "Buy crunchy onion pickle online. Tangy pearl onions, 250g at Rs 239.",
  },
  {
    name: "Boneless Chicken Pickle",
    slug: "boneless-chicken-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Chicken Pickle",
    shortDescription: "Meaty, no-bones chicken pickle - convenient and delicious.",
    description: "The same beloved Andhra chicken pickle, without the hassle of bones. Generous boneless chicken pieces are slow-cooked in a fiery masala and sealed in pickle oil so the flavour deepens with time.\n\nEvery spoonful is pure, tender, spicy satisfaction - perfect with rice, parathas or as an indulgent side. A premium twist on a household classic.",
    images: [PX(29684985), PX(35532821)],
    variants: [V("250g", "250g", 250, 529, 589), V("500g", "500g", 500, 999, 1119, 30)],
    ingredients: ["Boneless Chicken", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Rock Salt"],
    tags: ["non-veg", "chicken", "boneless", "premium", "spicy"],
    rating: 4.8,
    reviewCount: 143,
    shelfLife: "6 months from date of manufacture",
    storageInstructions: "Keep refrigerated at all times. Use a clean, dry spoon. Consume within 3 months of opening.",
    featured: true,
    bestSeller: true,
    seoTitle: "Boneless Chicken Pickle (250g) | Devi Pickles",
    seoDescription: "Buy boneless chicken pickle online. Tender spicy meat, 250g at Rs 529.",
  },
  {
    name: "Sambar Powder",
    slug: "sambar-powder",
    category: "Powders",
    subcategory: "Curry Powder",
    shortDescription: "Fragrant home-roasted sambar masala for authentic dal.",
    description: "A hand-roasted blend of red chilli, coriander, toor dal, cumin, fenugreek, pepper and a touch of asafoetida - ground fine and aromatic. One spoonful turns everyday dal into authentic, soul-warming sambar.\n\nToast it briefly in oil or ghee before use to unlock its full aroma. The masala tin every South Indian kitchen swears by.",
    images: [PX(7925765), PX(31280796)],
    variants: [V("200g", "200g", 200, 229, 259), V("400g", "400g", 400, 429, 489, 30)],
    ingredients: ["Red Chilli", "Coriander Seeds", "Toor Dal", "Cumin", "Fenugreek", "Mustard Seeds", "Pepper", "Turmeric", "Asafoetida"],
    tags: ["powder", "sambar", "masala", "andhra", "aromatic"],
    rating: 4.8,
    reviewCount: 67,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    featured: false,
    bestSeller: true,
    seoTitle: "Sambar Powder (200g) | Devi Pickles",
    seoDescription: "Buy aromatic sambar masala powder online. Hand-roasted, 200g at Rs 229.",
  },
  {
    name: "Mango Powder",
    slug: "mango-powder",
    category: "Powders",
    subcategory: "Souring Agent",
    shortDescription: "Sun-dried raw mango ground into tangy amchur.",
    description: "Unripe mangoes are sun-dried into pale, tangy slices and ground into a fine golden powder. Amchur adds a clean, fruity sourness that no vinegar or tamarind quite matches.\n\nA pantry essential for curries, chutneys, marinades and chaat. Sprinkle a pinch and let the food come alive.",
    images: [PX(6104651), PX(7925765)],
    variants: [V("200g", "200g", 200, 199, 229), V("400g", "400g", 400, 379, 439, 30)],
    ingredients: ["Sun-Dried Raw Mango"],
    tags: ["powder", "amchur", "mango", "tangy", "souring"],
    rating: 4.7,
    reviewCount: 44,
    shelfLife: "12 months from date of drying",
    storageInstructions: "Store in an airtight container in a cool, dark, dry place.",
    featured: false,
    bestSeller: false,
    seoTitle: "Mango Powder Amchur (200g) | Devi Pickles",
    seoDescription: "Buy tangy amchur mango powder online. Sun-dried raw mango, 200g at Rs 199.",
  },
  {
    name: "Pappula Podi",
    slug: "pappula-podi",
    category: "Powders",
    subcategory: "Podi / Gunpowder",
    shortDescription: "Savoury dal podi - roasted lentils, chilli and garlic.",
    description: "Our Pappula Podi is a classic dal-based powder made from roasted toor and chana dal, red chilli, garlic and curry leaves, ground to a coarse, fragrant mix. Mixed into hot rice with ghee, it is one of the great comfort foods of the South.\n\nCrunchy, savoury and endlessly addictive - just the way grandmother made it.",
    images: [PX(36008676), PX(32144895)],
    variants: [V("200g", "200g", 200, 189, 219), V("400g", "400g", 400, 359, 419, 30)],
    ingredients: ["Toor Dal", "Chana Dal", "Red Chilli", "Garlic", "Cumin", "Curry Leaves", "Rock Salt", "Asafoetida"],
    tags: ["powder", "podi", "dal", "pappula", "traditional"],
    rating: 4.8,
    reviewCount: 63,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    featured: false,
    bestSeller: false,
    seoTitle: "Pappula Podi (200g) | Devi Pickles",
    seoDescription: "Buy traditional pappula podi online. Roasted dal powder, 200g at Rs 189.",
  },
];

const homepageContent = {
  hero: {
    heading: "AUTHENTIC FLAVOURS,\nMADE THE TRADITIONAL WAY",
    subheading: "Handcrafted homemade pickles and traditional spice powders, prepared in small batches and delivered fresh to your doorstep.",
    image: PX(11584813),
    ctaText: "SHOP PICKLES",
    ctaUrl: "/shop",
  },
  announcementBar: {
    text: "AUTHENTIC HOMEMADE PICKLES • HANDCRAFTED SPICE POWDERS • MADE THE TRADITIONAL WAY",
    active: true,
  },
  trustItems: [
    { icon: "leaf", title: "100% NATURAL", description: "Made with natural ingredients, nothing artificial." },
    { icon: "shield", title: "NO ARTIFICIAL COLOURS", description: "Authentic colour comes from real ingredients." },
    { icon: "heart", title: "HOMEMADE TASTE", description: "Prepared with traditional recipes and a lot of care." },
    { icon: "check", title: "HYGIENICALLY PREPARED", description: "Made and packed to the highest standards of hygiene." },
  ],
  storySection: {
    title: "TRADITION IN EVERY JAR",
    text: "At Devi Pickles, every jar carries the warmth of traditional homemade cooking. We believe great food does not need to be complicated - it needs authentic ingredients, time-tested recipes and a whole lot of love. From the mangoes cured on our terrace to the chillies ground on a stone mill, every step follows the rituals our grandmothers perfected over decades.\n\nWe prepare in small batches, taste as we go, and pack every jar with the same care we would give a meal for our own family.",
    image: PX(28645473),
  },
  featuredProducts: [] as string[],
  whyChooseUs: {
    title: "WHY CHOOSE DEVI PICKLES?",
    items: [
      { icon: "book", title: "AUTHENTIC RECIPES", description: "Family recipes passed down through generations." },
      { icon: "star", title: "QUALITY INGREDIENTS", description: "Hand-picked produce and freshly ground spices." },
      { icon: "home", title: "SMALL-BATCH PREPARATION", description: "Prepared fresh in small batches for real taste." },
      { icon: "shield", title: "CAREFULLY PACKED", description: "Packaged with the highest standards of hygiene." },
    ],
  },
  finalCta: {
    heading: "BRING HOME THE TASTE OF TRADITION",
    description: "Authentic homemade flavours, prepared with care and delivered to your door.",
    buttonText: "SHOP NOW",
    buttonUrl: "/shop",
  },
  socialGallery: [PX(11584813), PX(38521742), PX(9164642), PX(38857376), PX(1516382901417), PX(35532821)],
  nonVegSection: { heading: "PREMIUM NON-VEG PICKLES", description: "Rich, fiery and prepared the traditional way with the finest ingredients.", image: PX(35532821), ctaText: "EXPLORE NON-VEG PICKLES", ctaUrl: "/shop/non-veg-pickles" },
  powdersSection: { heading: "TRADITIONAL POWDERS & PODIS", description: "Hand-roasted spice blends made the traditional way.", image: PX(7208238), ctaText: "SHOP POWDERS", ctaUrl: "/shop/powders" },
  experienceSteps: [
    { number: "01", title: "SELECT", description: "Carefully selected ingredients from trusted sources." },
    { number: "02", title: "PREPARE", description: "Ingredients are cleaned, sun-cured and prepared with care." },
    { number: "03", title: "TRADITION", description: "Time-tested recipes and traditional preparation methods." },
    { number: "04", title: "PACK", description: "Packed carefully to preserve freshness and flavour." },
    { number: "05", title: "DELIVER", description: "Delivered fresh to your doorstep." },
  ],
};

const demoReviews = [
  { customerName: "Swathi Reddy", rating: 5, review: "The mango pickle tastes exactly like the one my grandmother made. The spice level and tang are perfect. I have already placed my second order!", location: "Hyderabad, Telangana", published: true, featured: true },
  { customerName: "Ramesh Babu", rating: 5, review: "Gongura pickle is sensational. You can taste that it is made in small batches, not in a factory. Reminds me of home.", location: "Bengaluru, Karnataka", published: true, featured: true },
  { customerName: "Anitha Kumari", rating: 5, review: "Bought the lemon and tomato pickles for my parents. Packaging was neat, delivery was quick, and the taste is genuinely homemade. Highly recommended.", location: "Visakhapatnam, Andhra Pradesh", published: true, featured: true },
  { customerName: "Vijay Kumar", rating: 5, review: "Chicken pickle is out of this world - just the right amount of heat and so much flavour. Best paired with hot rice and ghee.", location: "Chennai, Tamil Nadu", published: true, featured: true },
  { customerName: "Priyanka Rao", rating: 5, review: "The idli podi is the real deal. Coarse, aromatic and perfect with ghee. My kids have started having it with dosa every single morning.", location: "Vijayawada, Andhra Pradesh", published: true, featured: false },
  { customerName: "Suresh Naidu", rating: 4, review: "Mutton pickle is rich and delicious. Slightly more oil than I expected, but the flavour more than makes up for it. Will reorder.", location: "Pune, Maharashtra", published: true, featured: false },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await mongoose.connection.dropDatabase();
  console.log("Database cleared");

  const Category = mongoose.models.Category || require("../src/lib/models/Category").default;
  const Product = mongoose.models.Product || require("../src/lib/models/Product").default;
  const Admin = mongoose.models.Admin || require("../src/lib/models/Admin").default;
  const Homepage = mongoose.models.Homepage || require("../src/lib/models/Homepage").default;
  const SiteSettings = mongoose.models.SiteSettings || require("../src/lib/models/SiteSettings").default;
  const FAQ = mongoose.models.FAQ || require("../src/lib/models/FAQ").default;
  const Review = mongoose.models.Review || require("../src/lib/models/Review").default;

  for (const cat of categories) {
    await Category.create(cat);
  }
  console.log("Categories created");

  const createdProducts: { slug: string; _id: mongoose.Types.ObjectId }[] = [];
  for (const product of products) {
    const doc = await Product.create(product);
    createdProducts.push({ slug: doc.slug, _id: doc._id });
  }
  console.log(`${products.length} products created`);

  homepageContent.featuredProducts = createdProducts
    .filter((p) => ["andhra-mango-pickle", "gongura-pickle", "lemon-pickle", "chicken-pickle", "boneless-chicken-pickle", "mutton-pickle", "prawn-pickle", "idli-podi"].includes(p.slug))
    .map((p) => p._id.toString());
  await Homepage.create(homepageContent);
  console.log("Homepage content created");

  for (const rev of demoReviews) {
    await Review.create(rev);
  }
  console.log(`${demoReviews.length} reviews created`);

  const hashed = await bcrypt.hash("admin123", 12);
  await Admin.create({
    email: process.env.ADMIN_EMAIL || "admin@devipickles.com",
    name: "Admin",
    password: hashed,
    role: "superadmin",
  });
  console.log("Admin created");

  await SiteSettings.create({
    businessName: "Devi Pickles",
    businessAddress: "",
    phone: "",
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    email: "",
    fssaiNumber: "20126122000228",
    deliveryRatePerKg: 100,
    minimumDeliveryCharge: 100,
    freeDeliveryEnabled: false,
    freeDeliveryThreshold: 0,
    razorpayEnabled: true,
    whatsappOrdersEnabled: true,
  });
  console.log("Site settings created");

  const defaultFaqs = [
    { question: "What weights are available?", answer: "Most pickles are available in 250g and 500g packs, and powders in 200g and 400g packs. You can select your preferred weight on each product page.", displayOrder: 1, active: true },
    { question: "How are orders packed?", answer: "Orders are hygienically packed in food-grade, leak-proof jars to preserve freshness and prevent spillage during delivery.", displayOrder: 2, active: true },
    { question: "How is delivery calculated?", answer: "Delivery is calculated based on total order weight at Rs 100 per kg, with a minimum charge of Rs 100. For example, a 500g order costs Rs 100, and a 1.5kg order costs Rs 150.", displayOrder: 3, active: true },
    { question: "How can I track my order?", answer: "You can track your order by visiting the Track Order page and entering your order number and mobile number.", displayOrder: 4, active: true },
    { question: "Do you accept cancellations?", answer: "Cancellations are accepted before the order is dispatched. Please contact us on WhatsApp at the earliest.", displayOrder: 5, active: true },
    { question: "How should I store my pickles?", answer: "Keep pickles in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon to keep them fresh longer.", displayOrder: 6, active: true },
  ];
  for (const faq of defaultFaqs) {
    await FAQ.create(faq);
  }
  console.log("FAQs created");

  console.log("\nSeed completed successfully!");
  console.log("Admin login: admin@devipickles.com / admin123");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
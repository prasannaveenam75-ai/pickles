import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/devi-pickles";

const PX = (id: number) => `/images/products/${id}.jpg`;

const categories = [
  { name: "Veg Pickles", slug: "veg-pickles", description: "Traditional vegetarian pickles made with authentic home recipes, sun-cured spices and the finest ingredients.", image: PX(35267279), displayOrder: 1, active: true, seasonal: false, seoTitle: "Veg Pickles | Buy Online | Devi Pickles", seoDescription: "Shop authentic homemade vegetarian pickles - usiri, tomato, pandumirchi, lemon, avakai, gongura and more." },
  { name: "Non-Veg Pickles", slug: "non-veg-pickles", description: "Rich, flavourful non-vegetarian pickles prepared the traditional way with slow-cooked spices.", image: PX(35532821), displayOrder: 2, active: true, seasonal: false, seoTitle: "Non-Veg Pickles | Buy Online | Devi Pickles", seoDescription: "Authentic chicken, mutton and prawn pickles made with traditional Andhra-style recipes." },
  { name: "Powders", slug: "powders", description: "Authentic spice powders and podis crafted by dry-roasting whole spices the traditional way.", image: PX(7208238), displayOrder: 3, active: true, seasonal: false, seoTitle: "Powders & Podis | Buy Online | Devi Pickles", seoDescription: "Traditional Andhra kura kaaram and pappula podi made from hand-roasted spices." },
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
  newProduct?: boolean;
  seasonal?: boolean;
  videoUrl?: string;
  benefits?: string[];
  preparationMethod?: string;
  seoTitle: string;
  seoDescription: string;
}

const V = (name: string, weight: string, grams: number, price: number, compareAt: number, stock = 50): VariantSeed => ({ name, weight, weightInGrams: grams, price, compareAtPrice: compareAt, stock });

const products: ProductSeed[] = [
  {
    name: "Usiri Pickle",
    slug: "usiri-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Tangy and spicy Indian gooseberry pickle, rich in Vitamin C.",
    description: "Our Usiri (Amla) Pickle is made from fresh Indian gooseberries, sun-dried and slow-cooked with red chilli, mustard, fenugreek and gingelly oil. Packed with Vitamin C and a distinctive tangy-spicy flavour, it is both delicious and nutritious.\n\nEach batch is prepared in small quantities the traditional way our grandmothers made it.",
    images: [PX(35267279), PX(7812134)],
    variants: [
      V("500 g", "500g", 500, 300, 380),
      V("1 kg", "1kg", 1000, 500, 700),
    ],
    ingredients: ["Indian Gooseberry (Usiri/Amla)", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Turmeric", "Rock Salt"],
    tags: ["veg", "amla", "usiri", "vitamin-c", "traditional", "tangy"],
    rating: 4.8,
    reviewCount: 156,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Usiri Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy authentic usiri pickle online. Traditional Indian gooseberry pickle, 500g at Rs 300.",
  },
  {
    name: "Tomato Pickle",
    slug: "tomato-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Sweet, tangy and spicy tomato pickle made with ripe tomatoes.",
    description: "Our Tomato Pickle captures the sweet-sour-spicy essence of ripe vine tomatoes, slow-cooked with red chilli, garlic, mustard and sesame oil. A beloved Andhra staple that pairs perfectly with hot rice and ghee.\n\nNo artificial colours or preservatives — just pure, homemade goodness.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 300, 380),
      V("1 kg", "1kg", 1000, 500, 700),
    ],
    ingredients: ["Ripe Tomatoes", "Red Chilli", "Garlic", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt"],
    tags: ["veg", "tomato", "sweet", "tangy", "traditional"],
    rating: 4.7,
    reviewCount: 142,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: false,
    bestSeller: true,
    seoTitle: "Tomato Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy authentic tomato pickle online. Traditional Andhra tomato pickle, 500g at Rs 300.",
  },
  {
    name: "Pandumirchi Pickle",
    slug: "pandumirchi-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Fiery green chilli pickle with garlic and lemon.",
    description: "Pandumirchi Pickle is made from fresh green chillies, slit and marinated with garlic, lemon juice, mustard and sesame oil. Bold, fiery and deeply flavourful — a must-have for heat lovers.\n\nPrepared the traditional way with no artificial additives.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 300, 380),
      V("1 kg", "1kg", 1000, 500, 700),
    ],
    ingredients: ["Fresh Green Chillies", "Garlic", "Lemon Juice", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt"],
    tags: ["veg", "chilli", "spicy", "green-chilli", "traditional"],
    rating: 4.6,
    reviewCount: 98,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Pandumirchi Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy pandumirchi pickle online. Traditional green chilli pickle, 500g at Rs 300.",
  },
  {
    name: "Lemon Pickle",
    slug: "lemon-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Classic tangy lemon pickle with a perfect balance of sour and spice.",
    description: "Our Lemon Pickle uses whole lemons cut into wedges, cured in rock salt and sun-dried, then tossed with red chilli, mustard, fenugreek and gingelly oil. A timeless favourite that brings brightness to any meal.\n\nHandcrafted in small batches for authentic flavour.",
    images: [PX(35267279), PX(7812134)],
    variants: [
      V("500 g", "500g", 500, 350, 450),
      V("1 kg", "1kg", 1000, 600, 800),
    ],
    ingredients: ["Fresh Lemons", "Rock Salt", "Red Chilli", "Mustard Seeds", "Fenugreek", "Gingelly Oil", "Turmeric"],
    tags: ["veg", "lemon", "tangy", "classic", "traditional"],
    rating: 4.9,
    reviewCount: 210,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Lemon Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy authentic lemon pickle online. Classic tangy Andhra lemon pickle, 500g at Rs 350.",
  },
  {
    name: "Avakai Pickle",
    slug: "avakai-pickle",
    category: "Veg Pickles",
    subcategory: "Mango",
    shortDescription: "The king of Andhra pickles — raw mango in a fiery mustard-red chilli paste.",
    description: "Avakai is the quintessential Andhra pickle: chunky raw mango pieces coated in a bold paste of ground mustard, red chilli, fenugreek and garlic, preserved in sesame oil. Sharp, spicy and deeply flavourful.\n\nEach batch is prepared in ceramic jars the traditional way, allowing the spices to bloom fully.",
    images: [PX(35267279), PX(7812134)],
    variants: [
      V("500 g", "500g", 500, 300, 400),
      V("1 kg", "1kg", 1000, 500, 700),
    ],
    ingredients: ["Raw Mango", "Mustard Powder", "Red Chilli Powder", "Fenugreek", "Garlic", "Sesame Oil", "Rock Salt", "Turmeric"],
    tags: ["veg", "mango", "avakai", "spicy", "traditional", "signature"],
    rating: 4.9,
    reviewCount: 320,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Always use a dry spoon. Keep immersed in oil. Refrigerate for longer shelf life.",
    featured: true,
    bestSeller: true,
    seoTitle: "Avakai Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy authentic avakai pickle online. Classic Andhra mango pickle, 500g at Rs 300.",
  },
  {
    name: "Sweet Avakai Pickle",
    slug: "sweet-avakai-pickle",
    category: "Veg Pickles",
    subcategory: "Mango",
    shortDescription: "A unique sweet-spicy version of the classic avakai with jaggery.",
    description: "Sweet Avakai is a delightful variation where raw mango pieces are slow-cooked with jaggery, red chilli, mustard and sesame oil. The result is a harmonious blend of sweet, tangy and spicy flavours that is uniquely Andhra.\n\nA festive favourite and a wonderful gift for pickle lovers.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 350, 430),
      V("1 kg", "1kg", 1000, 550, 750),
    ],
    ingredients: ["Raw Mango", "Jaggery", "Mustard Powder", "Red Chilli Powder", "Sesame Oil", "Fenugreek", "Rock Salt"],
    tags: ["veg", "mango", "sweet", "avakai", "festive"],
    rating: 4.8,
    reviewCount: 175,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place. Refrigerate after opening and always use a dry spoon.",
    featured: true,
    bestSeller: false,
    seoTitle: "Sweet Avakai Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy sweet avakai pickle online. Jaggery mango pickle, 500g at Rs 350.",
  },
  {
    name: "Magai Pickle",
    slug: "magai-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Traditional Andhra magai — a bold pickle with raw mango and special masala.",
    description: "Magai is a lesser-known Andhra speciality made with raw mango pieces, a unique blend of roasted spices and gingelly oil. It has a distinct earthy, smoky flavour that sets it apart from regular mango pickles.\n\nPrepared using age-old family recipes passed down through generations.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 350, 430),
      V("1 kg", "1kg", 1000, 600, 800),
    ],
    ingredients: ["Raw Mango", "Roasted Spice Blend", "Red Chilli", "Mustard", "Gingelly Oil", "Fenugreek", "Garlic", "Rock Salt"],
    tags: ["veg", "mango", "magai", "traditional", "speciality"],
    rating: 4.7,
    reviewCount: 110,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Magai Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy magai pickle online. Traditional Andhra raw mango pickle, 500g at Rs 350.",
  },
  {
    name: "Allam Pickle",
    slug: "allam-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Zesty ginger pickle — spicy, tangy and incredibly flavourful.",
    description: "Our Allam (Ginger) Pickle is made from fresh ginger root, finely sliced and cooked with red chilli, tamarind, mustard and sesame oil. It has a distinctive sharp, spicy and tangy flavour that makes it a perfect accompaniment to rice and dal.\n\nGinger is also known for its digestive benefits.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 300, 380),
      V("1 kg", "1kg", 1000, 500, 700),
    ],
    ingredients: ["Fresh Ginger", "Red Chilli", "Tamarind", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt"],
    tags: ["veg", "ginger", "allam", "spicy", "digestive", "traditional"],
    rating: 4.7,
    reviewCount: 125,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Allam Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy allam (ginger) pickle online. Traditional spicy ginger pickle, 500g at Rs 300.",
  },
  {
    name: "Vellulli / Garlic Pickle",
    slug: "garlic-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Rich garlic pickle with bold spices and aromatic oil.",
    description: "Our Vellulli (Garlic) Pickle features whole garlic cloves slow-cooked in sesame oil with red chilli, mustard, fenugreek and a hint of tamarind. The garlic turns soft, mellow and deeply savoury.\n\nA bold, aromatic pickle that elevates any simple meal.",
    images: [PX(35267279), PX(7812134)],
    variants: [
      V("500 g", "500g", 500, 400, 500),
      V("1 kg", "1kg", 1000, 700, 900),
    ],
    ingredients: ["Whole Garlic Cloves", "Red Chilli", "Mustard Seeds", "Fenugreek", "Tamarind", "Sesame Oil", "Turmeric", "Rock Salt"],
    tags: ["veg", "garlic", "vellulli", "bold", "aromatic", "traditional"],
    rating: 4.8,
    reviewCount: 165,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: false,
    bestSeller: true,
    seoTitle: "Garlic Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy vellulli (garlic) pickle online. Rich and spicy garlic pickle, 500g at Rs 400.",
  },
  {
    name: "Gongura Pickle",
    slug: "gongura-pickle",
    category: "Veg Pickles",
    subcategory: "Traditional",
    shortDescription: "Tangy sorrel leaf pickle — a beloved Andhra delicacy.",
    description: "Gongura Pickle is made from fresh sorrel leaves (gongura), wilted and slow-cooked with red chilli, garlic, mustard and sesame oil. The leaves impart a distinctive sour tang that is unmistakably Andhra.\n\nA beloved delicacy that is a staple in Andhra households.",
    images: [PX(35267279)],
    variants: [
      V("500 g", "500g", 500, 300, 400),
      V("1 kg", "1kg", 1000, 550, 750),
    ],
    ingredients: ["Gongura (Sorrel) Leaves", "Red Chilli", "Garlic", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt"],
    tags: ["veg", "gongura", "sorrel", "tangy", "traditional", "andhra"],
    rating: 4.9,
    reviewCount: 280,
    shelfLife: "12 months from date of manufacture",
    storageInstructions: "Store in a cool, dry place away from sunlight. Refrigerate after opening and always use a dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Gongura Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy gongura pickle online. Authentic Andhra sorrel leaf pickle, 500g at Rs 300.",
  },
  {
    name: "Chicken Pickle (With Bones)",
    slug: "chicken-pickle-with-bones",
    category: "Non-Veg Pickles",
    subcategory: "Chicken",
    shortDescription: "Spicy chicken pickle with bone-in pieces for extra flavour.",
    description: "Our Chicken Pickle (With Bones) features tender chicken pieces with bone, slow-cooked in a fiery masala of red chilli, garlic, ginger, mustard and sesame oil. The bone-in pieces add depth and richness to every bite.\n\nPrepared in small batches with authentic Andhra-style spices.",
    images: [PX(35532821)],
    variants: [
      V("500 g", "500g", 500, 550, 700),
      V("1 kg", "1kg", 1000, 950, 1200),
    ],
    ingredients: ["Chicken (with bone)", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt", "Spice Blend"],
    tags: ["non-veg", "chicken", "spicy", "bone-in", "traditional"],
    rating: 4.8,
    reviewCount: 240,
    shelfLife: "3 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Consume within 4 weeks. Always use a clean, dry spoon.",
    featured: false,
    bestSeller: true,
    seoTitle: "Chicken Pickle With Bones (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy chicken pickle with bones online. Authentic Andhra chicken pickle, 500g at Rs 550.",
  },
  {
    name: "Chicken Pickle (Bone Less)",
    slug: "chicken-pickle-boneless",
    category: "Non-Veg Pickles",
    subcategory: "Chicken",
    shortDescription: "Premium boneless chicken pickle — all meat, no hassle.",
    description: "Our Boneless Chicken Pickle features succulent, bite-sized boneless chicken pieces slow-cooked in a rich, fiery masala. All the flavour and none of the fuss — just pure, tender chicken in every spoonful.\n\nA premium offering for those who love convenience without compromising on taste.",
    images: [PX(35532821)],
    variants: [
      V("500 g", "500g", 500, 650, 800),
      V("1 kg", "1kg", 1000, 1100, 1400),
    ],
    ingredients: ["Boneless Chicken", "Red Chilli", "Garlic", "Ginger", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt", "Spice Blend"],
    tags: ["non-veg", "chicken", "boneless", "spicy", "premium"],
    rating: 4.9,
    reviewCount: 195,
    shelfLife: "3 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Consume within 4 weeks. Always use a clean, dry spoon.",
    featured: true,
    bestSeller: true,
    seoTitle: "Boneless Chicken Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy boneless chicken pickle online. Premium Andhra chicken pickle, 500g at Rs 650.",
  },
  {
    name: "Mutton Pickle (Only Boneless)",
    slug: "mutton-pickle-boneless",
    category: "Non-Veg Pickles",
    subcategory: "Mutton",
    shortDescription: "Premium boneless mutton pickle — rich, spicy and utterly irresistible.",
    description: "Our Mutton Pickle features tender, boneless mutton pieces slow-cooked for hours in a bold masala of red chilli, garlic, ginger, whole spices and sesame oil. Each piece is melt-in-your-mouth soft with a deep, complex flavour.\n\nOur most premium offering — a true labour of love.",
    images: [PX(35532821)],
    variants: [
      V("500 g", "500g", 500, 1050, 1300),
      V("1 kg", "1kg", 1000, 2000, 2500),
    ],
    ingredients: ["Boneless Mutton", "Red Chilli", "Garlic", "Ginger", "Whole Spices", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt"],
    tags: ["non-veg", "mutton", "boneless", "premium", "spicy"],
    rating: 4.9,
    reviewCount: 130,
    shelfLife: "3 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Consume within 4 weeks. Always use a clean, dry spoon.",
    featured: true,
    bestSeller: false,
    seoTitle: "Mutton Pickle Boneless (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy boneless mutton pickle online. Premium Andhra mutton pickle, 500g at Rs 1050.",
  },
  {
    name: "Prawns Pickle",
    slug: "prawns-pickle",
    category: "Non-Veg Pickles",
    subcategory: "Seafood",
    shortDescription: "Flavourful prawn pickle with coastal Andhra spices.",
    description: "Our Prawns Pickle features fresh, succulent prawns marinated and slow-cooked in a coastal Andhra-style masala with red chilli, garlic, kokum and sesame oil. Each prawn is flavourful and tender.\n\nA coastal delicacy brought to your table.",
    images: [PX(35532821)],
    variants: [
      V("500 g", "500g", 500, 900, 1100),
      V("1 kg", "1kg", 1000, 1700, 2100),
    ],
    ingredients: ["Fresh Prawns", "Red Chilli", "Garlic", "Kokum", "Mustard Seeds", "Sesame Oil", "Fenugreek", "Turmeric", "Rock Salt", "Spice Blend"],
    tags: ["non-veg", "prawns", "seafood", "coastal", "spicy"],
    rating: 4.8,
    reviewCount: 115,
    shelfLife: "2 months from date of manufacture",
    storageInstructions: "Refrigerate after opening. Consume within 3 weeks. Always use a clean, dry spoon.",
    featured: false,
    bestSeller: false,
    seoTitle: "Prawns Pickle (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy prawns pickle online. Coastal Andhra prawn pickle, 500g at Rs 900.",
  },
  {
    name: "Kura Kaaram (Curry Powder)",
    slug: "kura-kaaram",
    category: "Powders",
    subcategory: "Spice Powder",
    shortDescription: "Versatile curry powder — the backbone of Andhra cooking.",
    description: "Our Kura Kaaram is a handcrafted blend of dry-roasted red chilli, coriander, cumin, fenugreek, mustard and other whole spices, stone-ground to a fine powder. It is the essential spice mix for curries, dals and vegetable dishes.\n\nDry-roasted the traditional way for deep, complex flavour.",
    images: [PX(7208238)],
    variants: [
      V("500 g", "500g", 500, 350, 450),
      V("1 kg", "1kg", 1000, 650, 850),
    ],
    ingredients: ["Dry Red Chilli", "Coriander Seeds", "Cumin", "Fenugreek", "Mustard Seeds", "Turmeric", "Garlic", "Rock Salt"],
    tags: ["powder", "kura-kaaram", "curry", "spice", "traditional"],
    rating: 4.8,
    reviewCount: 185,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place. Keep away from moisture.",
    featured: false,
    bestSeller: true,
    seoTitle: "Kura Kaaram Curry Powder (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy kura kaaram online. Traditional Andhra curry powder, 500g at Rs 350.",
  },
  {
    name: "Pappula Podi (Dal Powder)",
    slug: "pappula-podi",
    category: "Powders",
    subcategory: "Podi",
    shortDescription: "Savoury dal podi — roasted lentils, chilli and garlic.",
    description: "Our Pappula Podi is a classic dal-based powder made from roasted toor and chana dal, red chilli, garlic and curry leaves, ground to a coarse, fragrant mix. Mixed into hot rice with ghee, it is one of the great comfort foods of the South.\n\nCrunchy, savoury and endlessly addictive — just the way grandmother made it.",
    images: [PX(7208238), PX(32144895)],
    variants: [
      V("500 g", "500g", 500, 350, 430),
      V("1 kg", "1kg", 1000, 650, 830),
    ],
    ingredients: ["Toor Dal", "Chana Dal", "Red Chilli", "Garlic", "Curry Leaves", "Cumin", "Asafoetida", "Rock Salt"],
    tags: ["powder", "podi", "pappula", "dal", "traditional", "rice"],
    rating: 4.8,
    reviewCount: 160,
    shelfLife: "6 months from date of roasting",
    storageInstructions: "Store in an airtight container in a cool, dry place. Keep away from moisture.",
    featured: false,
    bestSeller: true,
    seoTitle: "Pappula Podi Dal Powder (500g / 1kg) | Devi Pickles",
    seoDescription: "Buy pappula podi online. Traditional Andhra dal powder, 500g at Rs 350.",
  },
];

const homepageContent = {
  hero: {
    heading: "DEVI PICKLES — SWAD JO DIL JEET LE!",
    subheading: "Traditional Taste. Unmatched Quality. Authentic homemade pickles crafted with care.",
    image: PX(11584813),
    ctaText: "SHOP PICKLES",
    ctaUrl: "/shop",
  },
  announcementBar: {
    text: "DEVI PICKLES • SWAD JO DIL JEET LE! • AUTHENTIC HOMEMADE PICKLES • HANDCRAFTED SPICE POWDERS",
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

const demoTestimonials = [
  {
    type: "written" as const,
    slug: "andhra-mango-pickle",
    customerName: "Ananya Reddy",
    customerLocation: "Bengaluru",
    rating: 5,
    reviewText: "Absolutely loved the taste! It reminded me of the homemade mango pickle we used to have at home. The spice level and flavour are perfect.",
    caption: "",
    featured: true,
    displayOrder: 1,
  },
  {
    type: "written" as const,
    slug: "chicken-pickle",
    customerName: "Rahul Kumar",
    customerLocation: "Hyderabad",
    rating: 5,
    reviewText: "The chicken pickle is amazing. Rich flavour, perfectly spiced and the packaging was excellent. Definitely ordering again.",
    caption: "",
    featured: false,
    displayOrder: 2,
  },
  {
    type: "written" as const,
    slug: "gongura-pickle",
    customerName: "Priya Sharma",
    customerLocation: "Mysuru",
    rating: 5,
    reviewText: "The gongura pickle has such an authentic homemade taste. It goes perfectly with rice and ghee.",
    caption: "",
    featured: false,
    displayOrder: 3,
  },
  {
    type: "written" as const,
    slug: "lemon-pickle",
    customerName: "Kavitha Nair",
    customerLocation: "Kochi",
    rating: 4,
    reviewText: "Zesty and fresh. Slightly less spicy than I prefer but the tang is lovely. Goes beautifully with parathas and curd rice.",
    caption: "",
    featured: false,
    displayOrder: 4,
  },
  {
    type: "written" as const,
    slug: "idli-podi",
    customerName: "Arjun Mehta",
    customerLocation: "Mumbai",
    rating: 5,
    reviewText: "Finally an idli podi that tastes like home. Coarse, aromatic and absolutely perfect with a dab of ghee.",
    caption: "",
    featured: false,
    displayOrder: 5,
  },
  {
    type: "written" as const,
    slug: "mutton-pickle",
    customerName: "Deepa Iyer",
    customerLocation: "Chennai",
    rating: 5,
    reviewText: "The mutton pickle is rich and indulgent. You can tell it is made properly, in small batches. Worth every rupee.",
    caption: "",
    featured: false,
    displayOrder: 6,
  },
  {
    type: "instagram" as const,
    slug: "chicken-pickle",
    customerName: "Vikram S.",
    customerLocation: "Vijayawada",
    rating: 5,
    reviewText: "",
    caption: "Sample Testimonial - a customer reel placeholder. This record demonstrates how a real Instagram Reel URL will be embedded when added from the admin panel.",
    instagramUrl: "https://www.instagram.com/reel/DEMO-REEL-123/",
    thumbnailUrl: PX(29684985),
    featured: true,
    displayOrder: 7,
  },
  {
    type: "uploaded" as const,
    slug: "andhra-mango-pickle",
    customerName: "Devi Pickles Team",
    customerLocation: "Andhra Pradesh",
    rating: 5,
    reviewText: "",
    caption: "Sample Testimonial - demo video file. Replace this with a real customer video upload from the admin panel.",
    videoUrl: "https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4",
    thumbnailUrl: PX(38521742),
    videoAspect: "16:9",
    videoDuration: 9,
    featured: true,
    displayOrder: 8,
  },
  {
    type: "written" as const,
    slug: "boneless-chicken-pickle",
    customerName: "Nitin Rao",
    customerLocation: "Pune",
    rating: 5,
    reviewText: "Boneless chicken pickle is a game changer - same great taste, no hassle. The spice blend is just right.",
    caption: "",
    featured: false,
    displayOrder: 9,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const dbName = mongoose.connection.db!.databaseName;
  console.log(`Dropping database: ${dbName}`);
  await mongoose.connection.db!.dropDatabase();
  console.log("Database cleared");

  const Category = mongoose.models.Category || require("../src/lib/models/Category").default;
  const Product = mongoose.models.Product || require("../src/lib/models/Product").default;
  const Admin = mongoose.models.Admin || require("../src/lib/models/Admin").default;
  const Homepage = mongoose.models.Homepage || require("../src/lib/models/Homepage").default;
  const SiteSettings = mongoose.models.SiteSettings || require("../src/lib/models/SiteSettings").default;
  const FAQ = mongoose.models.FAQ || require("../src/lib/models/FAQ").default;
  const Review = mongoose.models.Review || require("../src/lib/models/Review").default;
  const Testimonial = mongoose.models.Testimonial || require("../src/lib/models/Testimonial").default;

  for (const cat of categories) {
    try {
      await Category.create(cat);
    } catch (err: any) {
      console.error(`  FAILED to create category ${cat.name}: ${err.message}`);
    }
  }
  console.log("Categories created");

  const createdProducts: { slug: string; _id: mongoose.Types.ObjectId }[] = [];
  for (const product of products) {
    const doc = await Product.create(product);
    createdProducts.push({ slug: doc.slug, _id: doc._id });
  }
  console.log(`${products.length} products created`);

  homepageContent.featuredProducts = createdProducts
    .filter((p) => ["usiri-pickle", "lemon-pickle", "avakai-pickle", "sweet-avakai-pickle", "gongura-pickle", "chicken-pickle-boneless", "mutton-pickle-boneless"].includes(p.slug))
    .map((p) => p._id.toString());
  await Homepage.create(homepageContent);
  console.log("Homepage content created");

  for (const rev of demoReviews) {
    await Review.create(rev);
  }
  console.log(`${demoReviews.length} reviews created`);

  const productIdMap = new Map(createdProducts.map((p) => [p.slug, p._id.toString()]));
  const productNameMap = new Map(products.map((p) => [p.slug, p.name]));
  for (const t of demoTestimonials) {
    await Testimonial.create({
      type: t.type,
      customerName: t.customerName,
      customerLocation: t.customerLocation,
      customerImage: "",
      productId: productIdMap.get(t.slug) || "",
      productName: productNameMap.get(t.slug) || "",
      rating: t.rating,
      reviewText: t.reviewText,
      instagramUrl: t.instagramUrl || "",
      instagramCode: t.instagramUrl ? t.instagramUrl.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/)?.[1] || "" : "",
      videoUrl: t.videoUrl || "",
      thumbnailUrl: t.thumbnailUrl || "",
      videoPublicId: "",
      videoDuration: t.videoDuration ?? undefined,
      videoAspect: t.videoAspect || "",
      caption: t.caption,
      verified: false,
      featured: Boolean(t.featured),
      active: true,
      displayOrder: t.displayOrder,
      isDemo: true,
    });
  }
  console.log(`${demoTestimonials.length} testimonials created (marked as demo)`);

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
    instagramUrl: "",
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

  // Force a final command to flush all pending writes, then disconnect gracefully
  await mongoose.connection.db!.admin().command({ ping: 1 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

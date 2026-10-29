export const INITIAL_PRODUCTS = [
  // --- 8 CORE ACTIVE PRODUCTS ---
  {
    id: 'prod-df-1',
    title: 'Premium W-240 Jumbo Cashews (Kaju)',
    category: 'Fresh Dry Fruits',
    price: 499,
    mrp: 650,
    stock: 28,
    rating: 4.9,
    reviewsCount: 88,
    hasVariants: true,
    variants: [
      { weight: '100g', label: '100g Pouch', price: 120, mrp: 160 },
      { weight: '250g', label: '250g Pouch', price: 265, mrp: 340 },
      { weight: '500g', label: '500g Pouch', price: 499, mrp: 650, isDefault: true },
      { weight: '1kg', label: '1 KG Value Pack', price: 960, mrp: 1250 }
    ],
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558818498-28c1e002b655?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handpicked, whole white jumbo W-240 kernel cashews. Crispy, naturally sweet, unroasted, and nitrogen-vacuum packed in food-grade pouches to preserve freshness.',
    specs: {
      packWeight: '500g (Default Variant)',
      grade: 'Grade W-240 Whole Jumbo',
      shelfLife: '9 Months from Packing',
      fssaiLicense: '10123000019842',
      origin: 'Mangalore / Kerala'
    },
    badge: 'Direct Farm Price'
  },
  {
    id: 'prod-df-2',
    title: 'California Select Crunchy Almonds (Badam)',
    category: 'Fresh Dry Fruits',
    price: 449,
    mrp: 599,
    stock: 35,
    rating: 4.8,
    reviewsCount: 76,
    hasVariants: true,
    variants: [
      { weight: '100g', label: '100g Pouch', price: 109, mrp: 150 },
      { weight: '250g', label: '250g Pouch', price: 240, mrp: 310 },
      { weight: '500g', label: '500g Pouch', price: 449, mrp: 599, isDefault: true },
      { weight: '1kg', label: '1 KG Value Pack', price: 860, mrp: 1150 }
    ],
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% genuine California Nonpareil almonds. Rich in plant protein, Vitamin E, and antioxidants. Perfectly crunchy with zero bitter taste.',
    specs: {
      packWeight: '500g (Default Variant)',
      grade: 'Extra No. 1 California Nonpareil',
      shelfLife: '12 Months',
      fssaiLicense: '10123000019842',
      origin: 'California, USA (Packed in Vizag)'
    },
    badge: 'High Protein'
  },
  {
    id: 'prod-df-3',
    title: 'Kashmiri Snow White Walnut Kernels (Akhrot)',
    category: 'Fresh Dry Fruits',
    price: 380,
    mrp: 490,
    stock: 15,
    rating: 4.9,
    reviewsCount: 34,
    hasVariants: true,
    variants: [
      { weight: '100g', label: '100g Pouch', price: 165, mrp: 220 },
      { weight: '250g', label: '250g Pouch', price: 380, mrp: 490, isDefault: true },
      { weight: '500g', label: '500g Pouch', price: 720, mrp: 950 },
      { weight: '1kg', label: '1 KG Value Pack', price: 1390, mrp: 1850 }
    ],
    image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?auto=format&fit=crop&w=800&q=80',
    description: 'Pure Kashmiri walnut kernels (halves and quarters) with rich natural oils. High in plant-based Omega-3 fatty acids for brain & heart health.',
    specs: {
      packWeight: '250g (Default Variant)',
      grade: 'Snow White Halves (Grade A)',
      shelfLife: '6 Months (Store refrigerated)',
      fssaiLicense: '10123000019842',
      origin: 'Srinagar, Kashmir'
    },
    badge: 'Pure Kashmiri'
  },
  {
    id: 'prod-df-4',
    title: 'Afghani Jumbo Dried Figs (Anjeer)',
    category: 'Fresh Dry Fruits',
    price: 590,
    mrp: 750,
    stock: 12,
    rating: 4.7,
    reviewsCount: 42,
    hasVariants: true,
    variants: [
      { weight: '250g', label: '250g Pouch', price: 310, mrp: 399 },
      { weight: '500g', label: '500g Pouch', price: 590, mrp: 750, isDefault: true },
      { weight: '1kg', label: '1 KG Value Pack', price: 1120, mrp: 1450 }
    ],
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    description: 'Plump, naturally sun-dried Afghani garland figs. Soft and naturally sweet with zero added sugar or preservatives. High in dietary fiber and calcium.',
    specs: {
      packWeight: '500g (Default Variant)',
      grade: 'Afghani Jumbo Garland Cut',
      shelfLife: '8 Months',
      fssaiLicense: '10123000019842',
      origin: 'Kandahar, Afghanistan'
    },
    badge: 'Zero Added Sugar'
  },
  {
    id: 'prod-rc-1',
    title: 'HMT Kurnool Premium Steamed Sona Masoori Rice',
    category: 'Rice & Pulses',
    price: 1399,
    mrp: 1750,
    stock: 45,
    rating: 4.8,
    reviewsCount: 56,
    hasVariants: true,
    variants: [
      { weight: '5kg', label: '5 KG Bag', price: 320, mrp: 390 },
      { weight: '10kg', label: '10 KG Bag', price: 590, mrp: 720 },
      { weight: '25kg', label: '25 KG Mandi Bag', price: 1399, mrp: 1750, isDefault: true }
    ],
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Aged Kurnool Sona Masoori steamed rice. Non-sticky, lightweight grains with delightful aroma. Direct mill dispatch at wholesale rate.',
    specs: {
      packWeight: '25 KG (Default Variant)',
      grade: 'Super Fine Steamed Sona Masoori',
      shelfLife: '12 Months',
      origin: 'Kurnool / Nellore Mills'
    },
    badge: 'Mill Direct'
  },
  {
    id: 'prod-pl-1',
    title: 'Guntur Supreme Unpolished Toor Dal (Kandi Pappu)',
    category: 'Rice & Pulses',
    price: 165,
    mrp: 210,
    stock: 60,
    rating: 4.9,
    reviewsCount: 48,
    hasVariants: true,
    variants: [
      { weight: '500g', label: '500g Pouch', price: 85, mrp: 110 },
      { weight: '1kg', label: '1 KG Pack', price: 165, mrp: 210, isDefault: true },
      { weight: '5kg', label: '5 KG Bag', price: 790, mrp: 990 }
    ],
    image: 'https://images.unsplash.com/photo-1585996746979-379e49a15f00?auto=format&fit=crop&w=800&q=80',
    description: '100% unpolished Desi Toor Dal retaining natural fiber and plant protein. Cooks creamy and thick with rich traditional Andhra sambar aroma.',
    specs: {
      packWeight: '1 KG (Default Variant)',
      grade: 'Grade-A Unpolished Desi Dal',
      shelfLife: '9 Months',
      origin: 'Guntur, Andhra Pradesh'
    },
    badge: 'High Protein'
  },
  {
    id: 'prod-fl-1',
    title: 'Chakki Fresh 100% Whole Wheat Atta',
    category: 'Flours, Sooji & Sugar',
    price: 389,
    mrp: 475,
    stock: 50,
    rating: 4.8,
    reviewsCount: 39,
    hasVariants: true,
    variants: [
      { weight: '5kg', label: '5 KG Bag', price: 199, mrp: 245 },
      { weight: '10kg', label: '10 KG Bag', price: 389, mrp: 475, isDefault: true }
    ],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional slow-stone ground chakki atta made from selected golden heavy wheat grains. Produces super soft rotis that stay fresh for hours.',
    specs: {
      packWeight: '10 KG (Default Variant)',
      grade: '100% Whole Wheat with Zero Maida',
      shelfLife: '3 Months',
      origin: 'Madhya Pradesh Sharbati'
    },
    badge: 'Zero Maida'
  },
  {
    id: 'prod-ka-1',
    title: 'Preethi Zodiac MG-218 750W Mixer Grinder',
    category: 'Kitchen Appliances',
    price: 7499,
    mrp: 9999,
    stock: 6,
    rating: 4.8,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Powerful 750W Vega W5 motor capable of grinding tough ingredients in 2 minutes. Includes MasterChef Food Processor jar for chopping, slicing, grating, and atta kneading.',
    specs: {
      power: '750 Watts Vega W5 Motor',
      warranty: '2 Years Comprehensive + 5 Years on Motor',
      boxContents: '1x Motor Unit, 5x Stainless Steel & Tritan Jars, MasterChef Bowl, Citrus Press, Kneader Blade, User Manual',
      brand: 'Preethi',
      modelNumber: 'MG-218'
    },
    badge: 'Best Seller in Vizag'
  }
];

// Archived items reserved for future catalog expansion
export const FUTURE_EXPANDED_PRODUCTS = [
  {
    id: 'prod-ka-2',
    title: 'Pigeon Cruise 1800W Induction Cooktop',
    category: 'Kitchen Appliances',
    price: 1599,
    mrp: 3195,
    stock: 14,
    rating: 4.6,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed energy-efficient 1800W electromagnetic induction cooktop with 7 preset Indian cooking menus.',
    badge: '50% OFF'
  },
  {
    id: 'prod-ka-3',
    title: 'Philips Digital Air Fryer HD9252/90 (4.1L)',
    category: 'Kitchen Appliances',
    price: 6999,
    mrp: 10995,
    stock: 4,
    rating: 4.9,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    description: 'Patented Rapid Air Technology fries with up to 90% less fat.',
    badge: 'Healthy Choice'
  },
  {
    id: 'prod-ka-4',
    title: 'Butterfly Smart Glass 3 Burner Gas Stove',
    category: 'Kitchen Appliances',
    price: 2899,
    mrp: 5495,
    stock: 5,
    rating: 4.7,
    reviewsCount: 41,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
    description: 'Shatter-proof toughened black glass top with heavy-duty brass burners.',
    badge: 'Popular'
  },
  {
    id: 'prod-ka-5',
    title: 'Prestige Iris 1.2L Stainless Steel Electric Kettle',
    category: 'Kitchen Appliances',
    price: 749,
    mrp: 1295,
    stock: 18,
    rating: 4.5,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80',
    description: 'Fast boiling 1200W electric kettle with 360-degree swivel base.',
    badge: 'Everyday Essential'
  },
  {
    id: 'prod-df-5',
    title: 'Long Golden Kishmish (Green Raisins)',
    category: 'Fresh Dry Fruits',
    price: 199,
    mrp: 280,
    stock: 22,
    rating: 4.6,
    reviewsCount: 39,
    hasVariants: true,
    variants: [
      { weight: '100g', label: '100g Pouch', price: 50, mrp: 70 },
      { weight: '250g', label: '250g Pouch', price: 110, mrp: 150 },
      { weight: '500g', label: '500g Pouch', price: 199, mrp: 280, isDefault: true },
      { weight: '1kg', label: '1 KG Value Pack', price: 380, mrp: 520 }
    ],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    description: 'Selected long seedless green raisins sun-dried in clean hygienic chambers.',
    badge: 'Value Pack'
  },
  {
    id: 'prod-sg-1',
    title: 'Anakapalle Organic Bellam / Natural Jaggery Blocks',
    category: 'Flours, Sooji & Sugar',
    price: 75,
    mrp: 110,
    stock: 40,
    rating: 4.9,
    reviewsCount: 62,
    hasVariants: true,
    variants: [
      { weight: '1kg', label: '1 KG Block', price: 75, mrp: 110, isDefault: true },
      { weight: '5kg', label: '5 KG Box', price: 350, mrp: 490 }
    ],
    image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=800&q=80',
    description: 'Famous Anakapalle market pure sugarcane bellam with zero chemical bleaching.',
    badge: 'Vizag Local'
  },
  {
    id: 'prod-sp-1',
    title: 'Guntur Teja Pure Red Chilli Powder (Mirchi Podi)',
    category: 'Spices & Masalas',
    price: 180,
    mrp: 240,
    stock: 35,
    rating: 4.8,
    reviewsCount: 45,
    hasVariants: true,
    variants: [
      { weight: '250g', label: '250g Pouch', price: 50, mrp: 70 },
      { weight: '500g', label: '500g Pouch', price: 95, mrp: 125 },
      { weight: '1kg', label: '1 KG Value Pack', price: 180, mrp: 240, isDefault: true }
    ],
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
    description: 'Stem-cut Guntur Teja chillies cold-ground to preserve volatile oils.',
    badge: 'Mandi Pure'
  },
  {
    id: 'prod-sp-2',
    title: 'Idukki Whole Green Cardamom 8mm Bold (Elaichi)',
    category: 'Spices & Masalas',
    price: 399,
    mrp: 550,
    stock: 25,
    rating: 5.0,
    reviewsCount: 31,
    hasVariants: true,
    variants: [
      { weight: '50g', label: '50g Pouch', price: 110, mrp: 160 },
      { weight: '100g', label: '100g Pouch', price: 210, mrp: 290 },
      { weight: '200g', label: '200g Pouch', price: 399, mrp: 550, isDefault: true }
    ],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    description: 'Direct Kerala estate harvest bold 8mm aromatic elaichi pods.',
    badge: 'Estate Fresh'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VH-1042',
    date: '2026-10-09T10:15:00',
    expiresAt: '2026-10-10T10:15:00',
    customer: {
      name: 'Ramesh Varma',
      phone: '9848022341',
      email: 'ramesh.varma@gmail.com',
      address: 'Central Store Hub, Dwaraka Nagar, Visakhapatnam',
      pincode: '530016',
      landmark: 'Near RTC Complex'
    },
    fulfillmentType: 'pickup',
    pickupSlot: 'Today: Evening (5:00 PM - 8:30 PM)',
    items: [
      {
        id: 'prod-ka-1',
        title: 'Preethi Zodiac MG-218 750W Mixer Grinder',
        price: 7499,
        quantity: 1
      },
      {
        id: 'prod-df-1',
        title: 'Premium W-240 Jumbo Cashews (Kaju) - 500g',
        price: 499,
        quantity: 2
      }
    ],
    itemSubtotal: 8497,
    deliveryFee: 0,
    total: 8497,
    paymentMethod: 'Direct UPI (9392624326@idfcfirst)',
    paymentStatus: 'PAID',
    upiRefNumber: '428901234567',
    pickupOtp: '4821',
    status: 'Ready for Pickup', // 'Placed', 'Ready for Pickup', 'Completed', 'Cancelled'
    notes: 'Customer will collect by 6:30 PM.'
  },
  {
    id: 'VH-1041',
    date: '2026-10-08T16:30:00',
    expiresAt: '2026-10-09T16:30:00',
    customer: {
      name: 'Sravani Devi',
      phone: '9490155678',
      email: 'sravani.d@yahoo.com',
      address: 'Central Store Hub, Dwaraka Nagar, Visakhapatnam',
      pincode: '530016',
      landmark: 'Near RTC Complex'
    },
    fulfillmentType: 'pickup',
    pickupSlot: 'Yesterday: Afternoon (1:00 PM - 5:00 PM)',
    items: [
      {
        id: 'prod-df-2',
        title: 'California Select Crunchy Almonds (Badam) - 500g',
        price: 449,
        quantity: 2
      },
      {
        id: 'prod-df-4',
        title: 'Afghani Jumbo Dried Figs (Anjeer) - 500g',
        price: 590,
        quantity: 1
      }
    ],
    itemSubtotal: 1488,
    deliveryFee: 0,
    total: 1488,
    paymentMethod: 'Pay on Store Pickup (Cash/UPI)',
    paymentStatus: 'PAID',
    status: 'Completed',
    notes: 'Collected at Dwaraka Nagar hub counter.'
  }
];

export const VIZAG_STORE_INFO = {
  name: 'VijayaHub Central Store & Warehouse',
  address: 'Door No. 47-10-22, 1st Floor, Near RTC Complex, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh - 530016',
  phone: '+91 98480 54321',
  whatsapp: '+91 98480 54321',
  email: 'orders@vijayahub.com',
  workingHours: '10:00 AM - 8:30 PM (All 7 Days Open)',
  pickupWindowHours: 24, // strictly 24 hours
  fssaiNumber: '10123000019842',
  gstNumber: '37AAAAA0000A1Z5',
  upiId: '9392624326@idfcfirst',
  upiPayeeName: 'VijayaHub'
};

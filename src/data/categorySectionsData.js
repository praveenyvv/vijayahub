/**
 * Data Schema for Jumbotail-Style Minimalist Wholesale Category Grid Layout
 */

export const PRODUCTS_FOR_YOU_ITEMS = [
  {
    id: 'pfy-1',
    name: 'Steamed Rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Rice',
    productId: 'prod-rc-1'
  },
  {
    id: 'pfy-2',
    name: 'Edible Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Oil',
    productId: 'prod-ol-1'
  },
  {
    id: 'pfy-3',
    name: 'Whole Cashews',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Cashew',
    productId: 'prod-df-1'
  },
  {
    id: 'pfy-4',
    name: 'Preethi Mixer',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Preethi',
    productId: 'prod-ka-1'
  },
  {
    id: 'pfy-5',
    name: 'California Almonds',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Almond',
    productId: 'prod-df-2'
  },
  {
    id: 'pfy-6',
    name: 'Toor Dal',
    image: 'https://images.unsplash.com/photo-1585996746979-379e49a15f00?auto=format&fit=crop&w=600&q=80',
    searchKeyword: 'Toor',
    productId: 'prod-pl-1'
  }
];

export const MAIN_CATEGORY_SECTIONS = [
  {
    id: 'rice-pulses',
    title: 'Rice & Pulses',
    iconBadge: '🌾',
    subCategories: [
      {
        id: 'rice-products',
        name: 'Rice & Rice Products',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        slug: 'rice-products',
        searchKeyword: 'Rice'
      },
      {
        id: 'pulses',
        name: 'Pulses',
        image: 'https://images.unsplash.com/photo-1585996746979-379e49a15f00?auto=format&fit=crop&w=600&q=80',
        slug: 'pulses',
        searchKeyword: 'Dal'
      }
    ]
  },
  {
    id: 'whole-grains-dry-fruits',
    title: 'Whole Grains & Dry Fruits',
    iconBadge: '🌾',
    subCategories: [
      {
        id: 'whole-grains',
        name: 'Whole Grains',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
        slug: 'whole-grains',
        searchKeyword: 'Wheat'
      },
      {
        id: 'dry-fruits',
        name: 'Dry Fruits',
        image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
        slug: 'dry-fruits',
        searchKeyword: 'Dry Fruits'
      }
    ]
  },
  {
    id: 'flours-sooji-sugar',
    title: 'Flours, Sooji & Sugar',
    iconBadge: '🌾',
    subCategories: [
      {
        id: 'flours-sooji',
        name: 'Flours & Sooji',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        slug: 'flours-sooji',
        searchKeyword: 'Atta'
      },
      {
        id: 'sugar-salt-jaggery',
        name: 'Sugar, Salt & Jaggery',
        image: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=600&q=80',
        slug: 'sugar-salt-jaggery',
        searchKeyword: 'Sugar'
      }
    ]
  },
  {
    id: 'spices-masalas',
    title: 'Spices & Masalas',
    iconBadge: '🌾',
    subCategories: [
      {
        id: 'whole-spices',
        name: 'Whole Spices',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        slug: 'whole-spices',
        searchKeyword: 'Spices'
      },
      {
        id: 'powdered-spices-masalas',
        name: 'Powdered Spices & Masalas',
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
        slug: 'powdered-spices-masalas',
        searchKeyword: 'Masala'
      }
    ]
  },
  {
    id: 'kitchen-appliances',
    title: 'Kitchen Appliances',
    iconBadge: '⚡',
    subCategories: [
      {
        id: 'mixer-grinders',
        name: 'Mixer Grinders',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
        slug: 'mixer-grinders',
        searchKeyword: 'Mixer'
      },
      {
        id: 'induction-stoves',
        name: 'Induction & Stoves',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        slug: 'induction-stoves',
        searchKeyword: 'Induction'
      }
    ]
  }
];

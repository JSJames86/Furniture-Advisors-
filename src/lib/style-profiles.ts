import type { StyleProfileData, StyleProfile, QuizSubmission } from '@/types'

export const STYLE_PROFILES: Record<StyleProfile, StyleProfileData> = {
  'modern-luxe': {
    slug: 'modern-luxe',
    label: 'Modern Luxe',
    tagline: 'Refined simplicity meets elevated living.',
    description:
      'Your space is a study in confident minimalism — clean silhouettes, rich materials, and a palette of deep neutrals punctuated by metallic accents. Every piece earns its place.',
    colorPalette: ['#1C1C1A', '#B8975A', '#FDFAF7', '#8A8479'],
    keywords: ['clean lines', 'metallics', 'statement lighting', 'velvet', 'marble'],
    lifestyleNote:
      'You appreciate quality over quantity — a room where every detail has been considered and nothing feels accidental.',
    lifestyleNoteWithPets:
      'Your aesthetic doesn\'t have to compromise for your furry family. I\'ll point you toward performance velvets and easy-clean upholstery that look just as luxurious.',
    lifestyleNoteWithKids:
      'Modern Luxe for families means smart material choices — indoor/outdoor fabrics that hold up beautifully while maintaining that elevated feel.',
    recommendations: [
      {
        name: 'Coralayne King Bed',
        collection: 'Coralayne',
        description:
          'Silver-finish button-tufted headboard with sophisticated glam detailing — the centerpiece your master suite deserves.',
        priceRange: '$800 – $1,100',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/B650-56S-58-97',
        shopUrl: 'https://www.ashleyfurniture.com/p/coralayne_king_upholstered_bed/B65058.html',
        tags: ['bedroom', 'glam', 'statement'],
      },
      {
        name: 'Maggie Sofa',
        collection: 'Maggie',
        description:
          'Track-arm silhouette with tightly woven fabric. Sleek, structured, built to anchor a modern living room with understated authority.',
        priceRange: '$700 – $900',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/5190138',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['living room', 'sofa', 'clean lines'],
      },
      {
        name: 'Zuo Dining Collection',
        collection: 'Zuo',
        description:
          'Champagne-finish table with glass top and upholstered side chairs. Dining elevated to an art form.',
        priceRange: '$1,200 – $1,800',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/D650-25-01',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['dining', 'metallic', 'entertaining'],
      },
    ],
  },

  'warm-traditional': {
    slug: 'warm-traditional',
    label: 'Warm Traditional',
    tagline: 'Classic comfort. Timeless beauty. A home that welcomes.',
    description:
      'Your home tells a story — rich wood tones, layered textiles, and heirloom-quality pieces that grow more beautiful with time. Comfort and elegance are not a trade-off here.',
    colorPalette: ['#8B6914', '#D4B483', '#F7F3EE', '#6B4C2A'],
    keywords: ['warm wood tones', 'rolled arms', 'wingback', 'florals', 'antique brass'],
    lifestyleNote:
      'Your rooms feel like a warm embrace — spaces designed for real living, Sunday dinners, and years of cherished memories.',
    lifestyleNoteWithPets:
      'Traditional style is wonderfully forgiving. I\'ll steer you toward durable woven textures and darker wood stains that hide life\'s little adventures.',
    lifestyleNoteWithKids:
      'Traditional furniture is often the most family-friendly — solid frames, generous proportions, and easy-care fabrics. Your home can be beautiful and lived-in at once.',
    recommendations: [
      {
        name: 'Signature Design Chesterfield Sofa',
        collection: 'Altonbury',
        description:
          'Button-tufted linen-blend cushions, rolled arms, and turned legs in antique finish. This sofa was made to host decades of conversations.',
        priceRange: '$1,000 – $1,400',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/8720538',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['living room', 'sofa', 'traditional'],
      },
      {
        name: 'Flynnter Bedroom Collection',
        collection: 'Flynnter',
        description:
          'Warm medium brown finish on replicated oak grain. Panel bed with detailed molding — heirloom quality at an attainable price.',
        priceRange: '$900 – $1,600',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/B719-58-56',
        shopUrl: 'https://www.ashleyfurniture.com/p/flynnter_king_panel_bed_with_storage/B71958.html',
        tags: ['bedroom', 'wood', 'storage'],
      },
      {
        name: 'Chalanna Dining Table Set',
        collection: 'Chalanna',
        description:
          'Casual dining set with warm white finish, turned legs, and upholstered side chairs. The heart of every family home.',
        priceRange: '$800 – $1,200',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/D816-25',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['dining', 'family', 'casual elegance'],
      },
    ],
  },

  'coastal-serene': {
    slug: 'coastal-serene',
    label: 'Coastal Serene',
    tagline: 'Where every room feels like a breath of ocean air.',
    description:
      'Light, airy, and effortlessly sophisticated. Natural textures, whitewashed finishes, and a palette inspired by sea glass and sun-bleached sand. Your home should feel like a vacation you never leave.',
    colorPalette: ['#7A8C76', '#D4B8A8', '#FDFAF7', '#A8C4C0'],
    keywords: ['natural linen', 'whitewash', 'rattan', 'sea glass tones', 'driftwood'],
    lifestyleNote:
      'Your home is a sanctuary — unhurried, beautiful, and as restorative as a walk along the shore.',
    lifestyleNoteWithPets:
      'Coastal style and pet-friendly living are a natural match. I\'ll show you indoor/outdoor performance fabrics that look like natural linen but clean up in seconds.',
    lifestyleNoteWithKids:
      'Light and airy doesn\'t have to mean fragile. Coastal-style performance fabrics and durable natural wood frames keep the look fresh while welcoming your whole family.',
    recommendations: [
      {
        name: 'Beachcroft Outdoor Collection',
        collection: 'Beachcroft',
        description:
          'Driftwood-look resin wicker with beige cushions. Seamlessly bridges indoor and outdoor coastal living.',
        priceRange: '$600 – $1,000',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/P791-820',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['outdoor', 'wicker', 'coastal'],
      },
      {
        name: 'Bolanburg Bedroom Collection',
        collection: 'Bolanburg',
        description:
          'Two-tone antique white and gray finish with replicated oak grain. Light and relaxed with beautiful coastal character.',
        priceRange: '$700 – $1,300',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/B647-58',
        shopUrl: 'https://www.ashleyfurniture.com/p/bolanburg_queen_panel_bed/B64752.html',
        tags: ['bedroom', 'whitewash', 'airy'],
      },
      {
        name: 'Benchcraft Sofa in Linen',
        collection: 'Benchcraft',
        description:
          'Slipcover-style sofa in natural linen blend. Relaxed and elegant — feels like the furniture exhales.',
        priceRange: '$800 – $1,100',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/2800338',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['living room', 'linen', 'relaxed'],
      },
    ],
  },

  'urban-glam': {
    slug: 'urban-glam',
    label: 'Urban Glam',
    tagline: 'Bold. Dramatic. Unapologetically you.',
    description:
      'You don\'t decorate a room — you curate an experience. Deep jewel tones, mirrored surfaces, sculptural silhouettes, and statement lighting that makes every entrance feel like an arrival.',
    colorPalette: ['#1C1C1A', '#B8975A', '#4A3060', '#D4B483'],
    keywords: ['jewel tones', 'mirrored', 'sculptural', 'velvet', 'lacquer', 'statement pieces'],
    lifestyleNote:
      'Your home is an extension of your personal brand — every room a conversation starter, every piece a deliberate choice.',
    lifestyleNoteWithPets:
      'Glamour and pet-friendly can absolutely coexist. I\'ll introduce you to high-performance velvet alternatives that photograph beautifully and clean up effortlessly.',
    lifestyleNoteWithKids:
      'Urban Glam for families means strategic choices — performance fabrics in rich colors, durable lacquer finishes, and pieces that grow with your home\'s story.',
    recommendations: [
      {
        name: 'Coralayne Dresser & Mirror',
        collection: 'Coralayne',
        description:
          'Silver-finish dresser with full-length beveled mirror. Maximum drama, maximum storage.',
        priceRange: '$900 – $1,300',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/B650-31-36',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['bedroom', 'glam', 'mirrored'],
      },
      {
        name: 'Accrington Sectional in Crimson',
        collection: 'Accrington',
        description:
          'Deep tufted velvet sectional with a bold jewel-tone upholstery. This is the sofa that owns the room.',
        priceRange: '$1,400 – $2,000',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/8050716',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['living room', 'sectional', 'velvet', 'jewel tones'],
      },
      {
        name: 'Wildner Round Dining Table',
        collection: 'Wildner',
        description:
          'Faux-marble round top on a gold-tone geometric base. The dining table that doubles as a sculpture.',
        priceRange: '$600 – $900',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/D396-15',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['dining', 'marble', 'gold', 'sculptural'],
      },
    ],
  },

  'rustic-refined': {
    slug: 'rustic-refined',
    label: 'Rustic Refined',
    tagline: 'The soul of the farmhouse, elevated.',
    description:
      'Raw, honest materials with a refined hand. Reclaimed wood, soft linens, aged iron hardware, and a warmth that commercial design can never replicate. Your home tells an authentic story.',
    colorPalette: ['#6B4C2A', '#8A8479', '#F7F3EE', '#7A8C76'],
    keywords: ['reclaimed wood', 'shiplap', 'linen', 'iron', 'barn door', 'lanterns'],
    lifestyleNote:
      'Your home has soul. It invites you to slow down, pour a cup of something warm, and stay a while.',
    lifestyleNoteWithPets:
      'Rustic style is the most pet-forgiving aesthetic there is. Natural wear, distressed finishes, and durable upholstery mean your home only gets better with time.',
    lifestyleNoteWithKids:
      'Rustic refined was practically made for family living. Solid frames, durable finishes, and materials that patina gracefully mean your home tells a richer story every year.',
    recommendations: [
      {
        name: 'Trinell Bedroom Collection',
        collection: 'Trinell',
        description:
          'Replicated pine with rough sawn texture and authentic plank detail. Rustic character without the splinters.',
        priceRange: '$700 – $1,200',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/B446-58',
        shopUrl: 'https://www.ashleyfurniture.com/p/trinell_queen_panel_bed/B44652.html',
        tags: ['bedroom', 'pine', 'rustic'],
      },
      {
        name: 'Abinger Sofa in Natural',
        collection: 'Abinger',
        description:
          'Casual farmhouse sofa with loose cushions, rolled arms, and natural-tone chenille fabric. Sink in and stay.',
        priceRange: '$700 – $950',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/8390838',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['living room', 'sofa', 'farmhouse'],
      },
      {
        name: 'Wesling Dining Table',
        collection: 'Wesling',
        description:
          'Chunky trestle base in dark rustic finish with plank-style tabletop. Gather the whole family — there\'s always room.',
        priceRange: '$600 – $900',
        imageUrl: 'https://assets.ashleyfurniture.com/is/image/AshleyFurniture/D946-25',
        shopUrl: 'https://www.ashleyfurniture.com',
        tags: ['dining', 'trestle', 'family'],
      },
    ],
  },
}

/**
 * Derive a style profile from quiz answers.
 * This mirrors the logic that would run on the frontend quiz.
 */
export function deriveStyleProfile(submission: Partial<QuizSubmission>): StyleProfile {
  // If explicitly provided, trust it
  if (submission.styleProfile) return submission.styleProfile

  // Fallback scoring based on room type / household
  return 'warm-traditional'
}

export function getProfileData(slug: StyleProfile): StyleProfileData {
  return STYLE_PROFILES[slug]
}

export function getLifestyleNote(profile: StyleProfileData, householdType: string[]): string {
  if (householdType.includes('pets') && householdType.includes('kids')) {
    return `${profile.lifestyleNoteWithKids} ${profile.lifestyleNoteWithPets}`
  }
  if (householdType.includes('pets')) return profile.lifestyleNoteWithPets
  if (householdType.includes('kids')) return profile.lifestyleNoteWithKids
  return profile.lifestyleNote
}

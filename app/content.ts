// content.ts — Single source of truth for all site content.
// To update the site, edit values below. No need to touch components.

export const siteConfig = {
  name: 'Abhishar V16.0',
  themeTitle: 'The Art Odyssey',
  tagline: 'A Timeless Voyage Through Art and Culture',
  organization: 'AASF',
  institute: 'ABV-IIITM Gwalior',
  logoPath: '/images/aasf-logo.png',
  copyright: `© ${new Date().getFullYear()} AASF, ABV-IIITM Gwalior. All rights reserved.`,
};

export const navLinks = [
  { label: 'Art Forms', href: '#types' },
  { label: 'Featured', href: '#featured' },
  { label: 'Lifescape', href: '#lifescape' },
  { label: 'Read', href: '#read' },
  { label: 'About', href: '#about' },
];

export const ctaLink = {
  label: 'Get Hard Copy',
  href: '#footer',
};

export const heroSlides = [
  {
    src: '/images/hero-01.png',
    alt: 'Painting of a white swan with open wings on a blue sky',
    label: 'Swan in Flight',
    focalPoint: { x: 50, y: 40 }, // percentage
  },
  {
    src: '/images/hero-02.png',
    alt: 'Blue-and-white Delft landscape tile',
    label: 'Delft Landscape',
    focalPoint: { x: 50, y: 50 },
  },
  {
    src: '/images/hero-03.png',
    alt: 'Close-up of pale roses',
    label: 'Pale Roses',
    focalPoint: { x: 50, y: 45 },
  },
  {
    src: '/images/hero-04.png',
    alt: 'Watercolour of cats with a guitar',
    label: 'Musical Cats',
    focalPoint: { x: 50, y: 50 },
  },
  {
    src: '/images/hero-05.png',
    alt: 'Dark group painting with a figure in red and a figure in cream',
    label: 'The Gathering',
    focalPoint: { x: 50, y: 35 },
  },
];

export const colors = {
  cream: '#F8F1DC',
  ink: '#17140F',
  sunflower: '#F7CF45',
  teal: '#4FB0BA',
  sand: '#D9CC9B',
  coral: '#E2674A',
  delftBlue: '#25356B',
  night: '#101426',
};

export const typePanels = [
  {
    id: 'painting',
    title: 'Painting, Drawing & Illustration',
    description: 'Pigment, brush and patience. A painted face can hold the light of an entire room, and a pencil line can hold a whole afternoon.',
    materials: 'pigment, graphite, ink, canvas, paper',
    image: '/images/type-painting.png',
    imageAlt: 'Portrait of a girl holding a fan',
    color: '#F7CF45',
    longDescription: 'From cave walls to cathedral ceilings, from oil on canvas to ink on paper, painting has been the most direct conversation between artist and viewer. Drawing strips colour away and speaks in pure line and shadow. Illustration bridges art and story, giving shape to the ideas we read.',
    techniques: 'Oil painting, watercolour, gouache, ink wash, charcoal, pastel, digital illustration, fresco, encaustic.',
    relatedImages: [] as { src: string; alt: string; caption: string }[],
  },
  {
    id: 'sculpture',
    title: 'Sculpture & Woodcraft',
    description: 'Form drawn out of stone and timber. The sculptor removes everything that is not the figure, and what is left seems to breathe.',
    materials: 'marble, wood, clay, bronze',
    image: '/images/type-sculpture.png',
    imageAlt: 'White marble cherub with a finger to its lips',
    color: '#4FB0BA',
    longDescription: 'Sculpture is the art of thinking in three dimensions. Whether carved from marble, cast in bronze or whittled from wood, each piece demands that the artist see the finished form hidden inside raw material and free it.',
    techniques: 'Carving, modelling, casting, assemblage, wood turning, relief sculpture, kinetic sculpture.',
    relatedImages: [] as { src: string; alt: string; caption: string }[],
  },
  {
    id: 'textile',
    title: 'Textile Arts',
    description: 'Thread as storyteller. Woven and embroidered patterns carry emblems, journeys and family histories from one generation to the next.',
    materials: 'silk, cotton, wool, natural dyes',
    image: '/images/type-textile.png',
    imageAlt: 'Dark blue woven textile with castles, birds and shields',
    color: '#D9CC9B',
    longDescription: 'Textile art is perhaps the most intimate of all art forms. It is worn, slept under, hung on walls and wrapped around the newborn. Every culture has its signature weave, its signature pattern, its own way of turning thread into identity.',
    techniques: 'Weaving, embroidery, tapestry, batik, block printing, knitting, crochet, quilting, macramé.',
    relatedImages: [] as { src: string; alt: string; caption: string }[],
  },
  {
    id: 'mosaic',
    title: 'Mosaic & Decorative Arts',
    description: 'Thousands of small pieces that only become a picture when you step back. Mosaic turns patience into colour.',
    materials: 'glass, stone, ceramic tile, grout',
    image: '/images/type-mosaic.png',
    imageAlt: 'Colourful mosaic of a sun over the sea and a house',
    color: '#E2674A',
    longDescription: 'Mosaic is the art of patience and precision. Each tessera is placed by hand, and the picture only reveals itself when hundreds or thousands of pieces come together. From Roman floors to Art Nouveau façades, mosaic transforms architecture into art.',
    techniques: 'Direct method, indirect method, double indirect method, micro-mosaic, pique assiette, Venetian smalti.',
    relatedImages: [] as { src: string; alt: string; caption: string }[],
  },
];

export const otherArtForms = [
  { label: 'Pottery & Ceramics', note: 'Earth shaped by hand and fire, from ancient vessels to contemporary studio pottery.' },
  { label: 'Folk & Community Crafts', note: 'Art passed down through communities: rangoli, warli painting, madhubani, and more.' },
  { label: 'Basketry & Natural Materials', note: 'Weaving with grasses, reeds and bamboo to create functional beauty.' },
  { label: 'Metalwork & Jewellery', note: 'Forging, casting and filigree: precious metals shaped into wearable art.' },
  { label: 'Printmaking & Calligraphy', note: 'The art of the repeated image and the beauty of written form.' },
  { label: 'Paper Crafts & Mixed Media', note: 'Origami, collage, papier-mâché and the art of layering materials.' },
  { label: 'Architecture & Decorative Arts', note: 'Buildings as art: from carved facades to stained glass windows.' },
  { label: 'Photography & Visual Arts', note: 'Capturing light, shadow and the decisive moment through a lens.' },
];

export const featuredArticles = [
  {
    id: 'article-1',
    title: 'Let\u2019s Get Ripped!',
    author: 'Guna Shekar Proddaturi',
    image: '/images/feature-01.png',
    imageAlt: 'Swirling blue night sky painting',
    imagePosition: '50% 50%',
    link: '', // Add link when available
    frameColor: '#8B6914',
    frameHighlight: '#C9A84C',
    accentColor: '#C9A84C', // gold
  },
  {
    id: 'article-2',
    title: 'The Art Of Problem Solving',
    author: 'Ritu Raj',
    image: '/images/feature-02.png',
    imageAlt: 'Portrait with a felt hat on a swirling blue background',
    imagePosition: '50% 50%',
    link: '', // Add link when available
    frameColor: '#3D2B1F',
    frameHighlight: '#6B4226',
    accentColor: '#6B4226', // brown
  },
  {
    id: 'article-3',
    title: 'Study The Systems You Can\u2019t Build',
    author: 'Aaditya Kumar Singh',
    image: '/images/feature-03.png',
    imageAlt: 'Wheat field with cypress trees',
    imagePosition: '65% 50%',
    link: '', // Add link when available
    frameColor: '#25356B',
    frameHighlight: '#C9A84C',
    accentColor: '#25356B', // deep blue
  },
];

export const lifescapeCards = [
  {
    id: 'ls-1',
    caption: 'Dark knight in the rain', // GENERATED, replace if needed
    artist: 'Sarthak Khobragade',
    image: '/images/lifescape/lifescape-01.jpeg',
    imageAlt: 'Dark knight in the rain, by Sarthak Khobragade',
    color: '#F7CF45',
  },
  {
    id: 'ls-2',
    caption: 'Storm behind silent eyes',
    artist: 'Bharath Lohiya',
    image: '/images/lifescape/lifescape-02.jpeg',
    imageAlt: 'Storm behind silent eyes, by Bharath Lohiya',
    color: '#4FB0BA',
  },
  {
    id: 'ls-3',
    caption: 'Morning walk',
    artist: 'Aakash',
    image: '/images/lifescape/lifescape-03.jpeg',
    imageAlt: 'Morning walk, by Aakash',
    color: '#D9CC9B',
  },
  {
    id: 'ls-4',
    caption: 'Skull aglow in warm embers', // GENERATED, replace if needed
    artist: 'Pooja Raj Rajkumar',
    image: '/images/lifescape/lifescape-04.jpeg',
    imageAlt: 'Skull aglow in warm embers, by Pooja Raj Rajkumar',
    color: '#E2674A',
  },
  {
    id: 'ls-5',
    caption: 'Pacific Sea nettles',
    artist: 'Yashasvi Jain',
    image: '/images/lifescape/lifescape-05.jpeg',
    imageAlt: 'Pacific Sea nettles, by Yashasvi Jain',
    color: '#F7CF45',
  },
  {
    id: 'ls-6',
    caption: 'Bearded man in a turban', // GENERATED, replace if needed
    artist: 'Pratichi Jain',
    image: '/images/lifescape/lifescape-06.jpeg',
    imageAlt: 'Bearded man in a turban, by Pratichi Jain',
    color: '#4FB0BA',
  },
  {
    id: 'ls-7',
    caption: 'Café light on a rainy night', // GENERATED, replace if needed
    artist: 'Nabaskar Brahma',
    image: '/images/lifescape/lifescape-07.jpeg',
    imageAlt: 'Café light on a rainy night, by Nabaskar Brahma',
    color: '#D9CC9B',
  },
  {
    id: 'ls-8',
    caption: 'Somewhere along the green path',
    artist: 'Srivas',
    image: '/images/lifescape/lifescape-08.jpeg',
    imageAlt: 'Somewhere along the green path, by Srivas',
    color: '#E2674A',
  },
];

export const themeSection = {
  heading: 'The Art Odyssey',
  pullQuote: 'Art begins in the hand. A brushstroke, a stitch, a chiselled curve, a pressed tile: every culture has found its own way of turning material into meaning. This edition of Abhishar sets out on an odyssey through those forms. We follow image, object, material and craft from village workshops to museum walls, and ask who made them, how, and why they still move us.',
  followUp: 'Scroll on to meet the forms of art we explore in this edition.',
};

export const featuredSection = {
  heading: 'Featured Articles',
  intro: 'Abhishar feels incomplete without articles and poems from our talented alumni, showcasing their creativity, opinions and experiences. Here are the featured articles from this edition.',
};

export const lifescapeSection = {
  heading: 'Lifescape',
  intro: 'A curated gallery of artwork from our talented students, showcasing diverse styles and themes that capture the essence of life and creativity.',
};

export const videoSection = {
  heading: 'Behind the Canvas',
  title: 'The Making of Abhishar V16.0',
  videoUrl: '/video/behind-the-canvas.mp4',
  posterImage: '', // No poster file; will use video's first frame
  videoWidth: 848,
  videoHeight: 480,
};

export const flipbookSection = {
  heading: 'Read Abhishar V16.0',
  tip: 'Open full-screen for the best reading experience.',
  flipbookUrl: 'https://heyzine.com/flip-book/4adb18100f.html',
};

export const downloadSection = {
  heading: 'Download the Magazine',
  lowRes: {
    label: 'Low Resolution',
    description: 'For quick viewing',
    url: 'https://drive.google.com/uc?export=download&id=1iEp6tUbuKx6mUuVrznNTf4CPlfQbiYpx',
    fileSize: '17.2 MB',
    downloadName: 'Abhishar-V16-Low-Resolution.pdf',
  },
  highRes: {
    label: 'High Resolution',
    description: 'Best quality download',
    url: 'https://drive.google.com/uc?export=download&id=1BbJH2uchqXReKwBqQ-T6qzaBelpO5lPq',
    fileSize: '447.9 MB',
    downloadName: 'Abhishar-V16-High-Resolution.pdf',
  },
};

export const aboutSection = {
  heading: 'Abhishar',
  text: 'Abhishar is the annual magazine of AASF and also of the prestigious institute ABV-IIITM Gwalior. This magazine is a space for students to exhibit their literary talents and express their ideas and opinions. \u2018Abhishar\u2019, the annual magazine of AASF, means companionship and has evolved from the names of our late AASF members, Abhinav Saxena and Tushar Sharma, two indispensable work engines of AASF.',
  coverImage: '/images/about-cover.jpg',
  coverAlt: 'Cover of Abhishar V16.0',
  coverCaption: 'Abhishar V16.0, cover',
  coverWidth: 978,
  coverHeight: 1280,
};

export const hardCopySection = {
  heading: 'Get Your Abhishar Now!',
  text: 'Click the button below if you are interested in receiving a hard copy of Abhishar V16.0.',
  buttonLabel: 'Get Now!',
  link: '', // Add when available
};

export const socialLinks = [
  { label: 'Instagram', url: '#', icon: 'instagram' },
  { label: 'LinkedIn', url: '#', icon: 'linkedin' },
  { label: 'GitHub', url: '#', icon: 'github' },
  { label: 'Twitter', url: '#', icon: 'twitter' },
];

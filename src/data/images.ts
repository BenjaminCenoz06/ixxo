const UNSPLASH_MAP: Record<string, string> = {
  // Remeras
  "p01-a": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  "p01-b": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
  "p02-a": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
  "p02-b": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  "p03-a": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "p03-b": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",

  // Camisas
  "p04-a": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
  "p04-b": "https://images.unsplash.com/photo-1626497764746-6dc36546b388",
  "p05-a": "https://images.unsplash.com/photo-1488161628813-04466f872be2",
  "p05-b": "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  "p06-a": "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  "p06-b": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",

  // Buzos
  "p07-a": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  "p07-b": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
  "p08-a": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6",
  "p08-b": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",

  // Camperas
  "p09-a": "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  "p09-b": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
  "p10-a": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  "p10-b": "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
  "p11-a": "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  "p11-b": "https://images.unsplash.com/photo-1551028719-00167b16eac5",

  // Jeans
  "p12-a": "https://images.unsplash.com/photo-1542272604-787c3835535d",
  "p12-b": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  "p13-a": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908",
  "p13-b": "https://images.unsplash.com/photo-1582562124811-c09040d0a901",

  // Pantalones
  "p14-a": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  "p14-b": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
  "p15-a": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
  "p15-b": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",

  // Joggers
  "p16-a": "https://images.unsplash.com/photo-1551854838-212c50b4c184",
  "p16-b": "https://images.unsplash.com/photo-1483985988355-763728e1935b",

  // Sweaters
  "p17-a": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "p17-b": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
  "p18-a": "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4",
  "p18-b": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  "p19-a": "https://images.unsplash.com/photo-1516826957135-700dedea698c",
  "p19-b": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",

  // Bermudas
  "p20-a": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
  "p20-b": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",

  // Zapatillas
  "p21-a": "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  "p21-b": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
  "p22-a": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111",
  "p22-b": "https://images.unsplash.com/photo-1491553895911-0055eca6402d",

  // Accesorios
  "p23-a": "https://images.unsplash.com/photo-1534215754734-18e55d13ce35",
  "p23-b": "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e",
  "p24-a": "https://images.unsplash.com/photo-1624222247344-550fb8ec5521",
  "p24-b": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",

  // Categorías
  "cat-remeras": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  "cat-camisas": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
  "cat-buzos": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  "cat-camperas": "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  "cat-jeans": "https://images.unsplash.com/photo-1542272604-787c3835535d",
  "cat-pantalones": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
  "cat-joggers": "https://images.unsplash.com/photo-1551854838-212c50b4c184",
  "cat-sweaters": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "cat-bermudas": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
  "cat-zapatillas": "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  "cat-accesorios": "https://images.unsplash.com/photo-1534215754734-18e55d13ce35",
  "cat-novedades": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
  "cat-ofertas": "https://images.unsplash.com/photo-1488161628813-04466f872be2",

  // Colecciones
  "col-essentials": "https://images.unsplash.com/photo-1488161628813-04466f872be2",
  "col-tailoring": "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  "col-winter": "https://images.unsplash.com/photo-1520975916090-3105956dac38",

  // Instagram Feed - @tiendasixxo_oficial
  "instagram-0": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
  "instagram-1": "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  "instagram-2": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  "instagram-3": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
  "instagram-4": "https://images.unsplash.com/photo-1520975916090-3105956cec38",
  "instagram-5": "https://images.unsplash.com/photo-1488161628813-04466f872be2",
};

/**
 * Devuelve una foto de modelo elegante de hombre de Unsplash optimizada.
 */
export function editorial(seed: string, w = 900, h = 1200): string {
  const base = UNSPLASH_MAP[seed];
  if (base) {
    return `${base}?auto=format&fit=crop&q=80&w=${w}&h=${h}`;
  }
  // Fallback con keywords coherentes
  return `https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=${w}&h=${h}`;
}

export function editorialWide(seed: string, w = 1600, h = 900): string {
  const base = UNSPLASH_MAP[seed];
  if (base) {
    return `${base}?auto=format&fit=crop&q=80&w=${w}&h=${h}`;
  }
  // Fallback con keywords coherentes
  return `https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=${w}&h=${h}`;
}


const UNSPLASH_MAP: Record<string, string> = {
  // Remeras
  "p01-a": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  "p01-b": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
  "p02-a": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  "p02-b": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2",
  "p03-a": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "p03-b": "https://images.unsplash.com/photo-1618354691438-25bc04584c24",

  // Camisas
  "p04-a": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
  "p04-b": "https://images.unsplash.com/photo-1626497764746-6dc36546b388",
  "p05-a": "https://images.unsplash.com/photo-1488161628813-04466f872be2",
  "p05-b": "https://images.unsplash.com/photo-1617137968427-85924c800a22",
  "p06-a": "https://images.unsplash.com/photo-1603252109303-2751441dd157",
  "p06-b": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",

  // Buzos
  "p07-a": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  "p07-b": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
  "p08-a": "https://images.unsplash.com/photo-1509967419530-da38b4704bc6",
  "p08-b": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",

  // Camperas
  "p09-a": "https://images.unsplash.com/photo-1551028719-00167b16eac5",
  "p09-b": "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef",
  "p10-a": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  "p10-b": "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
  "p11-a": "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  "p11-b": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",

  // Jeans
  "p12-a": "https://images.unsplash.com/photo-1542272604-787c3835535d",
  "p12-b": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  "p13-a": "https://images.unsplash.com/photo-1479064555552-3ef4979f8908",
  "p13-b": "https://images.unsplash.com/photo-1582562124811-c09040d0a901",

  // Pantalones
  "p14-a": "https://images.unsplash.com/photo-1593030103066-0093718efeb9",
  "p14-b": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
  "p15-a": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
  "p15-b": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",

  // Joggers
  "p16-a": "https://images.unsplash.com/photo-1551854838-212c50b4c184",
  "p16-b": "https://images.unsplash.com/photo-1483985988355-763728e1935b",

  // Sweaters
  "p17-a": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "p17-b": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
  "p18-a": "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4",
  "p18-b": "https://images.unsplash.com/photo-1608063615781-e2ef8c13d114",
  "p19-a": "https://images.unsplash.com/photo-1516826957135-700dedea698c",
  "p19-b": "https://images.unsplash.com/photo-1620799137054-d6219b4e5421",

  // Bermudas
  "p20-a": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b",
  "p20-b": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",

  // Zapatillas
  "p21-a": "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  "p21-b": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
  "p22-a": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111",
  "p22-b": "https://images.unsplash.com/photo-1491553895911-0055eca6402d",

  // Accesorios
  "p23-a": "https://images.unsplash.com/photo-1534215754734-18e55d13ce35",
  "p23-b": "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e",
  "p24-a": "https://images.unsplash.com/photo-1624222247344-550fb8ec5521",
  "p24-b": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",

  // Categorías
  "cat-remeras": "https://images.unsplash.com/photo-1562157873-818bc0726f68",
  "cat-camisas": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
  "cat-buzos": "https://images.unsplash.com/photo-1621905252507-b354bc25edac",
  "cat-camperas": "https://images.unsplash.com/photo-1483985988355-763728e1935b",
  "cat-jeans": "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
  "cat-pantalones": "https://images.unsplash.com/photo-1473968512647-3e447244af8f",
  "cat-joggers": "https://images.unsplash.com/photo-1506152983158-b4a74a01c721",
  "cat-sweaters": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c",
  "cat-bermudas": "https://images.unsplash.com/photo-1604176354204-9268737828e4",
  "cat-zapatillas": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  "cat-accesorios": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
  "cat-novedades": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce",
  "cat-ofertas": "https://images.unsplash.com/photo-1488161628813-04466f872be2",

  // Colecciones
  "col-essentials": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
  "col-tailoring": "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  "col-winter": "https://images.unsplash.com/photo-1520975916090-3105956dac38",

  // Instagram Feed - @tiendasixxo_oficial
  "instagram-0": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "instagram-1": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea",
  "instagram-2": "https://images.unsplash.com/photo-1550246140-5119ae4790b8",
  "instagram-3": "https://images.unsplash.com/photo-1534030216700-b457a3746683",
  "instagram-4": "https://images.unsplash.com/photo-1505022610485-0249ba5b3675",
  "instagram-5": "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d",
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
}


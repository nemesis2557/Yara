import type { ItemCarrito } from "@/types/luwak";

export type CategoriaSlug =
  | "premium"
  | "calientes"
  | "con-licor"
  | "heladas"
  | "andinos"
  | "tradicional"
  | "fast-food"
  | "para-almorzar"
  | "sandwich"
  | "para-acompañar"
  | "cervezas"
  | "cocteles"
  | "vinos"
  | "gaseosa";

export interface Categoria {
  slug: CategoriaSlug;
  label: string;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: CategoriaSlug;
  imagen?: string;
  descripcion?: string;
  variantes?: string[];
}

export const CATEGORIAS: Categoria[] = [
  { slug: "premium", label: "PREMIUM" },
  { slug: "calientes", label: "CALIENTES" },
  { slug: "con-licor", label: "CON LICOR" },
  { slug: "heladas", label: "HELADAS Y AL TIEMPO" },
  { slug: "andinos", label: "ANDINOS" },
  { slug: "tradicional", label: "TRADICIONAL" },
  { slug: "para-almorzar", label: "PARA ALMORZAR" },
  { slug: "sandwich", label: "SANDWICH" },
  { slug: "para-acompañar", label: "PARA ACOMPAÑAR" },
  { slug: "cervezas", label: "CERVEZAS" },
  { slug: "cocteles", label: "COCTELES" },
  { slug: "vinos", label: "VINOS" },
  { slug: "gaseosa", label: "GASEOSAS" },
  { slug: "fast-food", label: "FAST FOOD" },
];

export const PRODUCTOS: Producto[] = [
  // PREMIUM
  {
    id: "menu-5-tiempos",
    nombre: "Menú de 5 tiempos",
    precio: 70,
    categoria: "premium",
    imagen: "/img-carta/PREMIUM/1.webp",
  },
  {
    id: "buffet",
    nombre: "Buffet",
    precio: 70,
    categoria: "premium",
    imagen: "/img-carta/PREMIUM/2.webp",
  },

  // CALIENTES
  {
    id: "espresso",
    nombre: "Espresso",
    precio: 6,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/1.webp",
    descripcion: "Esencia de café",
  },
  {
    id: "latte-capuccino",
    nombre: "Latte / Capuccino",
    precio: 8,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/2.webp",
    descripcion: "Esencia de café y leche",
  },
  {
    id: "americano",
    nombre: "Americano",
    precio: 6,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/3.webp",
    descripcion: "Esencia de café y agua",
  },
  {
    id: "chocolate-caliente",
    nombre: "Chocolate caliente",
    precio: 8,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/4.webp",
    descripcion: "Pasta de cacao 100% orgánico",
  },
  {
    id: "mocaccino",
    nombre: "Mocaccino",
    precio: 9,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/5.webp",
    descripcion: "Café, leche y chocolate",
  },
  {
    id: "lagrima",
    nombre: "Lágrima",
    precio: 8,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/6.webp",
    descripcion: "Leche con gotitas de café",
  },
  {
    id: "ponche-andino",
    nombre: "Ponche andino",
    precio: 7,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/7.webp",
    descripcion: "Harina de granos andinos y leche",
  },
  {
    id: "infusiones-andinas",
    nombre: "Infusiones andinas",
    precio: 4,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/8.webp",
    variantes: ["Manzanilla", "Muña", "Coca", "Toronjil"],
  },
  {
    id: "infusiones-importadas",
    nombre: "Infusiones importadas",
    precio: 7,
    categoria: "calientes", // <- corregido, antes decía "calentes"
    imagen: "/img-carta/CALIENTES/9.webp",
    variantes: ["Relajantes", "Desestresante", "Digestivas"],
  },
  {
    id: "te-jamaica",
    nombre: "Té Jamaica",
    precio: 5,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/10.webp",
  },
  {
    id: "te-luwak",
    nombre: "Té Luwak",
    precio: 5,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/11.webp",
    descripcion: "Té, naranja, limón y especias",
  },
  {
    id: "emoliente-caliente",
    nombre: "Emoliente",
    precio: 5,
    categoria: "calientes",
    imagen: "/img-carta/CALIENTES/12.webp",
    descripcion: "Cebada, linaza, infusiones",
  },

  // CON LICOR
  {
    id: "emoliente-licor",
    nombre: "Emoliente con licor",
    precio: 10,
    categoria: "con-licor",
    imagen: "/img-carta/CONLICOR/1.webp",
    descripcion: "Con pisco, ron, anís o pulkay",
  },
  {
    id: "te-licor",
    nombre: "Té con licor",
    precio: 10,
    categoria: "con-licor",
    imagen: "/img-carta/CONLICOR/2.webp",
    descripcion: "Pisco, canela, cáscara de naranja",
  },
  {
    id: "ponche-licor",
    nombre: "Ponche con licor",
    precio: 12,
    categoria: "con-licor",
    imagen: "/img-carta/CONLICOR/3.webp",
    descripcion: "Pisco, ron, anís o pulkay",
  },

  // HELADAS
  {
    id: "frappe",
    nombre: "Frappé",
    precio: 8,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/1.webp",
    descripcion: "Café, hielo, crema, helado",
  },
  {
    id: "frappe-caramelo",
    nombre: "Frappé caramelo",
    precio: 9,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/2.webp",
    descripcion: "Caramelo, café, hielo, crema, helado",
  },
  {
    id: "frappe-brownie",
    nombre: "Frappé brownie",
    precio: 10,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/3.webp",
    descripcion: "Brownie, café, hielo, crema, helado",
  },
  {
    id: "capuccino-helado",
    nombre: "Capuccino helado",
    precio: 7,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/4.webp",
  },
  {
    id: "cafe-helado",
    nombre: "Café helado",
    precio: 7,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/5.webp",
  },
  {
    id: "te-helado",
    nombre: "Té helado",
    precio: 6,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/6.webp",
    variantes: ["Naranja y limón", "Menta y limón"],
  },
  {
    id: "emoliente-frio",
    nombre: "Emoliente frío",
    precio: 7,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/7.webp",
    variantes: ["Cebada", "Linaza"],
  },
  {
    id: "licuados-andinos",
    nombre: "Licuados andinos",
    precio: 10,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/8.webp",
    variantes: ["Quinua", "Kiwicha", "Kaniwa", "Siete semillas"],
  },
  {
    id: "smoothie-frutas",
    nombre: "Smoothie de frutas",
    precio: 10,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/9.webp",
    variantes: ["Frutos rojos", "Mango", "Piña"],
  },
  {
    id: "smoothie-licor",
    nombre: "Smoothie con licor",
    precio: 12,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/10.webp",
  },
  {
    id: "batido-proteico",
    nombre: "Batido proteico",
    precio: 12,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/11.webp",
    variantes: ["Proteína", "Creatina"],
  },
  {
    id: "cerveza-artesanal",
    nombre: "Cerveza artesanal",
    precio: 12,
    categoria: "heladas",
    imagen: "/img-carta/HELADAS/12.webp",
    variantes: ["Pilsen", "Red ale", "Porter", "Ipa"],
  },

  // ANDINOS
  {
    id: "vino-casa-andino",
    nombre: "Vino de la casa - andino",
    precio: 14,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/1.webp",
  },
  {
    id: "pisco-sour",
    nombre: "Pisco sour",
    precio: 15,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/2.webp",
  },
  {
    id: "chilcano",
    nombre: "Chilcano",
    precio: 14,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/3.webp",
  },
  {
    id: "coctel-canchalagua",
    nombre: "Coctel canchalagua",
    precio: 12,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/4.webp",
  },
  {
    id: "coctel-morra",
    nombre: "Coctel morra",
    precio: 12,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/5.webp",
  },
  {
    id: "coctel-navidena",
    nombre: "Coctel navideña",
    precio: 14,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/6.webp",
  },
  {
    id: "sangria",
    nombre: "Sangría",
    precio: 12,
    categoria: "andinos",
    imagen: "/img-carta/ANDINOS/7.webp",
  },

  // TRADICIONAL
  {
    id: "vino-casa",
    nombre: "Vino de la casa",
    precio: 14,
    categoria: "tradicional",
    imagen: "/img-carta/TRADICIONAL/1.webp",
  },
  {
    id: "piña-colada",
    nombre: "Piña colada",
    precio: 16,
    categoria: "tradicional",
    imagen: "/img-carta/TRADICIONAL/2.webp",
  },
  {
    id: "margarita",
    nombre: "Margarita",
    precio: 16,
    categoria: "tradicional",
    imagen: "/img-carta/TRADICIONAL/3.webp",
  },
  {
    id: "sex-on-the-beach",
    nombre: "Sex on the beach",
    precio: 16,
    categoria: "tradicional",
    imagen: "/img-carta/TRADICIONAL/4.webp",
  },
  {
    id: "daiquiri",
    nombre: "Daiquiri",
    precio: 18,
    categoria: "tradicional",
    imagen: "/img-carta/TRADICIONAL/5.webp",
  },

  // PARA ALMORZAR
  {
    id: "ensalada",
    nombre: "Ensalada",
    precio: 18,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/1.webp",
  },
  {
    id: "ensalada-proteica",
    nombre: "Ensalada proteica",
    precio: 28,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/2.webp",
  },
  {
    id: "ensalada-grande",
    nombre: "Ensalada grande",
    precio: 30,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/3.webp",
  },
  {
    id: "pollo-plancha",
    nombre: "Pollo a la plancha",
    precio: 25,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/4.webp",
  },
  {
    id: "lomo-saltado",
    nombre: "Lomo saltado",
    precio: 28,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/5.webp",
  },
  {
    id: "arroz-mariscos",
    nombre: "Arroz con mariscos",
    precio: 32,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/6.webp",
  },
  {
    id: "ceviche",
    nombre: "Ceviche",
    precio: 35,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/7.webp",
  },
  {
    id: "pasta",
    nombre: "Pasta",
    precio: 24,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/8.webp",
  },
  {
    id: "pizza",
    nombre: "Pizza",
    precio: 26,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/9.webp",
  },
  {
    id: "hamburguesa",
    nombre: "Hamburguesa",
    precio: 22,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/10.webp",
  },
  {
    id: "tartar-quinua",
    nombre: "Tartar de quinua",
    precio: 20,
    categoria: "para-almorzar",
    imagen: "/img-carta/PARAALMORZAR/11.webp",
  },

  // SANDWICH
  {
    id: "sandwich-jamon",
    nombre: "Sándwich de jamón",
    precio: 15,
    categoria: "sandwich",
    imagen: "/img-carta/SANDWICH/1.webp",
  },
  {
    id: "sandwich-pollo",
    nombre: "Sándwich de pollo",
    precio: 16,
    categoria: "sandwich",
    imagen: "/img-carta/SANDWICH/2.webp",
  },
  {
    id: "sandwich-vegano",
    nombre: "Sándwich vegano",
    precio: 17,
    categoria: "sandwich",
    imagen: "/img-carta/SANDWICH/3.webp",
  },
  {
    id: "sandwich-club",
    nombre: "Sándwich club",
    precio: 18,
    categoria: "sandwich",
    imagen: "/img-carta/SANDWICH/4.webp",
  },
  {
    id: "sandwich-pavo",
    nombre: "Sándwich de pavo",
    precio: 17,
    categoria: "sandwich",
    imagen: "/img-carta/SANDWICH/5.webp",
  },

  // PARA ACOMPAÑAR
  {
    id: "papas-fritas",
    nombre: "Papas fritas",
    precio: 10,
    categoria: "para-acompañar",
    imagen: "/img-carta/ACOMPANAR/1.webp",
  },
  {
    id: "camote-frito",
    nombre: "Camote frito",
    precio: 10,
    categoria: "para-acompañar",
    imagen: "/img-carta/ACOMPANAR/2.webp",
  },
  {
    id: "ensalada-mixta",
    nombre: "Ensalada mixta",
    precio: 12,
    categoria: "para-acompañar",
    imagen: "/img-carta/ACOMPANAR/3.webp",
  },
  {
    id: "pan-ajo",
    nombre: "Pan al ajo",
    precio: 8,
    categoria: "para-acompañar",
    imagen: "/img-carta/ACOMPANAR/4.webp",
  },
  {
    id: "arroz-blanco",
    nombre: "Arroz blanco",
    precio: 6,
    categoria: "para-acompañar",
    imagen: "/img-carta/ACOMPANAR/5.webp",
  },

  // CERVEZAS
  {
    id: "cerveza-pilsen",
    nombre: "Cerveza Pilsen",
    precio: 10,
    categoria: "cervezas",
    imagen: "/img-carta/CERVEZAS/1.webp",
  },
  {
    id: "cerveza-cusquena",
    nombre: "Cerveza Cusqueña",
    precio: 12,
    categoria: "cervezas",
    imagen: "/img-carta/CERVEZAS/2.webp",
  },
  {
    id: "cerveza-corona",
    nombre: "Cerveza Corona",
    precio: 14,
    categoria: "cervezas",
    imagen: "/img-carta/CERVEZAS/3.webp",
  },
  {
    id: "cerveza-heineken",
    nombre: "Cerveza Heineken",
    precio: 13,
    categoria: "cervezas",
    imagen: "/img-carta/CERVEZAS/4.webp",
  },
  {
    id: "cerveza-artesanal-roja",
    nombre: "Cerveza artesanal roja",
    precio: 15,
    categoria: "cervezas",
    imagen: "/img-carta/CERVEZAS/5.webp",
  },

  // COCTELES
  {
    id: "martini",
    nombre: "Martini",
    precio: 16,
    categoria: "cocteles",
    imagen: "/img-carta/COCTELES/1.webp",
  },
  {
    id: "mojito",
    nombre: "Mojito",
    precio: 14,
    categoria: "cocteles",
    imagen: "/img-carta/COCTELES/2.webp",
  },
  {
    id: "negroni",
    nombre: "Negroni",
    precio: 17,
    categoria: "cocteles",
    imagen: "/img-carta/COCTELES/3.webp",
  },
  {
    id: "old-fashioned",
    nombre: "Old Fashioned",
    precio: 18,
    categoria: "cocteles",
    imagen: "/img-carta/COCTELES/4.webp",
  },
  {
    id: "aperol-spritz",
    nombre: "Aperol Spritz",
    precio: 16,
    categoria: "cocteles",
    imagen: "/img-carta/COCTELES/5.webp",
  },

  // VINOS
  {
    id: "vino-blanco",
    nombre: "Vino blanco",
    precio: 20,
    categoria: "vinos",
    imagen: "/img-carta/VINOS/1.webp",
  },
  {
    id: "vino-tinto",
    nombre: "Vino tinto",
    precio: 22,
    categoria: "vinos",
    imagen: "/img-carta/VINOS/2.webp",
  },
  {
    id: "vino-rosado",
    nombre: "Vino rosado",
    precio: 21,
    categoria: "vinos",
    imagen: "/img-carta/VINOS/3.webp",
  },
  {
    id: "vino-espumante",
    nombre: "Vino espumante",
    precio: 25,
    categoria: "vinos",
    imagen: "/img-carta/VINOS/4.webp",
  },
  {
    id: "vino-malbec",
    nombre: "Vino Malbec",
    precio: 24,
    categoria: "vinos",
    imagen: "/img-carta/VINOS/5.webp",
  },

  // GASEOSA
  {
    id: "gaseosa",
    nombre: "Gaseosa",
    precio: 6,
    categoria: "gaseosa",
    imagen: "/img-carta/GASEOSAS/1.webp",
  },
  {
    id: "gaseosa-personal",
    nombre: "Gaseosa personal",
    precio: 5,
    categoria: "gaseosa",
    imagen: "/img-carta/GASEOSAS/2.webp",
  },
  {
    id: "agua",
    nombre: "Agua",
    precio: 4,
    categoria: "gaseosa",
    imagen: "/img-carta/GASEOSAS/3.webp",
  },

  // FAST FOOD
  {
    id: "hot-dog",
    nombre: "Hot dog",
    precio: 12,
    categoria: "fast-food",
    imagen: "/img-carta/FASTFOOD/1.webp",
  },
  {
    id: "hamburguesa-fast",
    nombre: "Hamburguesa fast",
    precio: 14,
    categoria: "fast-food",
    imagen: "/img-carta/FASTFOOD/2.webp",
  },
  {
    id: "pizza-personal",
    nombre: "Pizza personal",
    precio: 13,
    categoria: "fast-food",
    imagen: "/img-carta/FASTFOOD/3.webp",
  },
  {
    id: "papas-fast",
    nombre: "Papas fast",
    precio: 9,
    categoria: "fast-food",
    imagen: "/img-carta/FASTFOOD/4.webp",
  },
  {
    id: "nachos",
    nombre: "Nachos",
    precio: 11,
    categoria: "fast-food",
    imagen: "/img-carta/FASTFOOD/5.webp",
  },
];

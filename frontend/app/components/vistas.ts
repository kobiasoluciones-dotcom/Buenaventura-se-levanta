// Fuente única de verdad para la navegación móvil tipo app.
//
// El portal completo (frontend/app/page.tsx) sigue siendo una sola página
// larga de ~20 secciones enlazadas por ancla. En pantallas ≤760px, cada
// sección se agrupa bajo una "vista" y el CSS de app/mobile.css esconde las
// que no pertenecen a la vista activa. Este archivo es el único lugar donde
// se define esa agrupación — MobileTabBar, el manejador de anclas de
// page.tsx y mobile.css (como referencia al escribirlo) la consumen desde
// aquí para no tener el mapa duplicado en tres sitios.
//
// "sos" no es una vista: el botón central de MobileTabBar abre
// EmergencySheet por encima de lo que se esté viendo, sin cambiar de pestaña.

export type VistaId = "hoy" | "ayuda" | "verificado" | "mas";

export type Vista = {
  id: VistaId;
  label: string;
  /** Nombre para SolidarityIcon */
  icon: "home" | "hands" | "check" | "menu";
  /** Anclas (id de <section>) que viven dentro de esta vista. */
  anclas: string[];
};

export const VISTAS: Vista[] = [
  {
    id: "hoy",
    label: "Hoy",
    icon: "home",
    anclas: ["inicio", "contenido", "cifras", "alertas", "hoy"],
  },
  {
    id: "ayuda",
    label: "Ayuda",
    icon: "hands",
    anclas: ["ayuda-oficial", "ayuda", "directorio-ayuda", "socorro", "atencion-medica"],
  },
  {
    id: "verificado",
    label: "Verificado",
    icon: "check",
    anclas: ["verificacion", "registro-visual", "boletines"],
  },
  {
    id: "mas",
    label: "Más",
    icon: "menu",
    anclas: ["plataformas", "cuentas-voces", "acerca-de"],
  },
];

const ANCLA_A_VISTA: Record<string, VistaId> = VISTAS.reduce((mapa, vista) => {
  vista.anclas.forEach((ancla) => { mapa[ancla] = vista.id });
  return mapa;
}, {} as Record<string, VistaId>);

/**
 * Dado un href tipo "#ayuda" (o solo "ayuda"), devuelve a qué vista
 * pertenece esa sección, o null si el ancla no está mapeada (por ejemplo
 * "#inicio" en el brand del header, que siempre debe llevar a "hoy" — sí está
 * mapeada — o un href que no es un ancla interna, como "tel:123").
 */
export function vistaDeAncla(href: string): VistaId | null {
  const id = href.startsWith("#") ? href.slice(1) : href;
  return ANCLA_A_VISTA[id] ?? null;
}

"use client";

import { useEffect, useMemo, useState } from "react";

type HelpType = "acopio" | "ofrece" | "necesita" | "salud";
type HelpItem = { id: string; type: HelpType; eyebrow: string; title: string; place: string; image: string | null; mediaType?: "imagen" | "video"; verified: boolean; detail: string; href?: string | null };
type SolidarityIconName = "heart" | "hands" | "union" | "box" | "care" | "spark" | "check";
type PublicationSection = "ofrecimientos" | "puntos-acopio" | "necesidades" | "salud" | "registro-visual" | "noticias";
type Publication = { id: string; seccion: PublicationSection; titulo: string; descripcion?: string | null; nivel_confianza: string; archivo?: string | null; tipo_archivo?: "imagen" | "video" | null; url_externa?: string | null; fecha_publicado: string };
type OfficialFigures = { buenaventura: { fecha_corte: string; fuente: string; afectados: number; viviendas_destruidas: { total: number }; viviendas_averiadas: { total: number }; lesionados: number; fallecidos: number }; sismo_principal: { magnitud: number; fecha?: string; hora_local?: string; epicentro?: string; fuente?: string }; replicas_relevantes?: { fecha: string; hora_local?: string; magnitud: number; ubicacion?: string; fuente?: string }[]; toque_de_queda?: { estado: string; horario?: string; ultimo_decreto_fecha?: string; excepciones?: string[]; fuente?: string; nota?: string } };
type Verification = { afirmacion: string; estado: string; explicacion: string; fuente?: string | null };
type Bulletin = { id: string; nivel_gobierno: "alcaldia" | "departamento" | "nacion"; entidad: string; titulo: string; descripcion?: string | null; archivo: string; fecha_del_boletin?: string | null; fecha_publicado: string };
type ContactoLinea = { nombre: string; numero: string };
type EmergencyContacts = { nacionales?: ContactoLinea[]; buenaventura?: ContactoLinea[]; salud_mental?: { numero?: string; nombre?: string; descripcion?: string; fuente?: string }; restablecimiento_contacto_familiar?: { organizacion?: string; whatsapp?: string; email?: string; linea_te_escucha?: string }; atencion_ciudadano_alcaldia?: { nombre?: string; numero?: string } };
type Plataforma = { nombre: string; url: string; descripcion?: string | null };
type Plataformas = { ciudadanas: Plataforma[]; oficiales: Plataforma[] };
type CuentaVoz = { nombre: string; canal?: string | null; descripcion?: string | null; estado_verificacion?: string | null };
type CuentasYVoces = { criterios_inclusion: string[]; oficiales: CuentaVoz[]; medios_locales: CuentaVoz[]; ong_con_trayectoria: CuentaVoz[]; profesionales_tecnicos: CuentaVoz[]; influencers_y_personalidades: CuentaVoz[] };
type PasoAyudaOficial = { paso: string; detalle: string; fuente_tipo?: string };
type ComoSolicitarAyuda = { estado_contenido: string; nota_transparencia?: string | null; lo_que_se_sabe: PasoAyudaOficial[]; pendiente_de_confirmar: string[] };
type RegistroVisualItem = { titulo: string; descripcion?: string | null; fecha_verificacion?: string | null };
type RegistroVisual = { estado_contenido: string; nota_transparencia: string; checklist_antes_de_publicar: string[]; items: RegistroVisualItem[] };
type IniciativaDirectorio = { nombre: string; nivel_confianza: string; descripcion?: string | null; ubicacion?: string | null; horario?: string | null; recibe?: string[] | null; no_recibe?: string[] | null; cuenta?: string | null; llave_bre_b?: string | null; llave_daviplata?: string | null; cuenta_bancolombia_ahorros?: string | null; contacto_whatsapp?: string | null; puntos_entrega?: string[] | null; fuente?: string | null; nota_verificacion?: string | null };
type DirectorioAyuda = { advertencia_fraude: { titulo: string; puntos: string[] }; niveles_confianza: Record<string, string>; iniciativas: IniciativaDirectorio[] };

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

function apiUrl(path: string) { return `${API_BASE_URL}${path}` }
function formatNumber(value: number) { return new Intl.NumberFormat("es-CO").format(value) }
function formatDate(value?: string | null) {
  if (!value) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Bogota" }).format(new Date(`${value}T12:00:00-05:00`)).replaceAll(".", "").toUpperCase();
}
async function fetchJson<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(apiUrl(path), { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}

function SolidarityIcon({ name, className = "" }: { name: SolidarityIconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "heart" && <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />}
    {name === "hands" && <><path d="M8.2 20 5 18.2a3.8 3.8 0 0 1-1.9-3.3v-3.4a1.5 1.5 0 0 1 3 0v2.1" /><path d="m6 13.2 2.7 1.5a2.8 2.8 0 0 1 1.3 2.4V21" /><path d="m15.8 20 3.2-1.8a3.8 3.8 0 0 0 1.9-3.3v-3.4a1.5 1.5 0 0 0-3 0v2.1" /><path d="m18 13.2-2.7 1.5a2.8 2.8 0 0 0-1.3 2.4V21" /><path d="M15.1 4.2a2.6 2.6 0 0 0-3.1.5 2.6 2.6 0 0 0-4.1 3.1c.6 1.7 4.1 3.9 4.1 3.9s3.5-2.2 4.1-3.9a2.6 2.6 0 0 0-1-3.6Z" /></>}
    {name === "union" && <><path d="m3.5 10.5 4-4 4.2 4.2-2.1 2.1a1.7 1.7 0 0 0 2.4 2.4l3.7-3.7" /><path d="m12.3 7.2 1.5-1.5a2.5 2.5 0 0 1 3.5 0l3.2 3.2" /><path d="m3 10 7.5 7.5a2 2 0 0 0 2.8 0l.5-.5" /><path d="m20.5 9-6.7 8" /><path d="M2 8.5 5.5 5 8 7.5 4.5 11Z" /><path d="m16 7.5 2.5-2.5L22 8.5 19.5 11Z" /></>}
    {name === "box" && <><path d="m4 8 8-4 8 4v9l-8 4-8-4Z" /><path d="m4 8 8 4 8-4M12 12v9" /><path d="M10.5 7.2c.6-.7 1.7-.6 2.1.2.5-.8 1.6-.9 2.2-.2.7.9 0 2.1-2.2 3.3-2.1-1.2-2.8-2.4-2.1-3.3Z" /></>}
    {name === "care" && <><path d="M20.8 5.7a5.4 5.4 0 0 0-7.7-.1L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z" /><path d="M5.8 13h3l1.2-3 2.1 6 1.6-3h4.5" /></>}
    {name === "spark" && <><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /><circle cx="12" cy="12" r="3.2" /></>}
    {name === "check" && <><path d="M6 3.5h9.2L19 7.3V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M15.2 3.5v3.8H19" /><path d="m8.3 13.2 2.3 2.3 5-5" /></>}
  </svg>;
}

const fallbackHelpItems: HelpItem[] = [
  { id: "fallback-1", type: "acopio", eyebrow: "Punto de acopio", title: "Colecta solidaria para el Pacífico", place: "Villa del Prado · Ciudad Córdoba", image: "/media/01-WhatsApp-Image-2026-08-13-at-2.21.33-PM.jpeg", verified: false, detail: "Reciben alimentos, agua, ropa, elementos de higiene y materiales de curación." },
  { id: "fallback-2", type: "ofrece", eyebrow: "Voluntariado técnico", title: "Profesionales de Buenaventura se organizan", place: "Buenaventura", image: "/media/02-WhatsApp-Image-2026-08-13-at-2.24.36-PM.jpeg", verified: true, detail: "Convocatoria para apoyar la identificación de viviendas afectadas y acompañar comunidades." },
  { id: "fallback-3", type: "necesita", eyebrow: "Necesidad prioritaria", title: "Insumos para el Hospital Distrital", place: "Buenaventura", image: "/media/03-WhatsApp-Image-2026-08-13-at-2.22.31-PM.jpeg", verified: false, detail: "Pañales, gasas, vendas, solución salina, analgésicos y equipos de macrogoteo." },
  { id: "fallback-4", type: "acopio", eyebrow: "Punto de recepción", title: "Donaciones para Buenaventura", place: "Calle 70C #1J–00", image: "/media/08-WhatsApp-Image-2026-08-13-at-2.19.18-PM.jpeg", verified: false, detail: "Reciben ropa, alimentos no perecederos, productos de aseo, cobijas y sábanas." },
  { id: "fallback-5", type: "necesita", eyebrow: "Familia afectada", title: "Una casa perdida, una familia por levantar", place: "Quibdó · Chocó", image: "/media/09-WhatsApp-Image-2026-08-13-at-2.25.13-PM.jpeg", verified: false, detail: "Solicitud de materiales de construcción y apoyo para una familia con pérdida total de vivienda." },
  { id: "fallback-6", type: "salud", eyebrow: "Salud mental", title: "No estás solo ni sola", place: "Línea distrital de acompañamiento", image: "/media/13-WhatsApp-Image-2026-08-13-at-2.24.15-PM.jpeg", verified: true, detail: "Escucha, orientación y acompañamiento por profesionales capacitados." },
  { id: "fallback-7", type: "salud", eyebrow: "Atención gratuita", title: "Fisioterapia respiratoria para niñas y niños", place: "Buenaventura", image: "/media/14-WhatsApp-Image-2026-08-13-at-2.23.56-PM.jpeg", verified: false, detail: "Profesionales ofrecen terapia respiratoria a menores afectados sin recursos." },
  { id: "fallback-8", type: "ofrece", eyebrow: "Apoyo profesional", title: "Inspección visual de viviendas sin costo", place: "Buenaventura", image: "/media/15-WhatsApp-Image-2026-08-13-at-2.25.37-PM.jpeg", verified: false, detail: "Orientación preliminar del nivel de riesgo para familias afectadas." },
];

const fallbackFigures = [
  { value: "3.956", label: "personas afectadas" },
  { value: "540", label: "viviendas destruidas" },
  { value: "2.833", label: "viviendas averiadas" },
  { value: "310", label: "personas lesionadas" },
  { value: "13", label: "personas fallecidas" },
];

const filters: { id: "todos" | HelpType; label: string; icon: SolidarityIconName }[] = [
  { id: "todos", label: "Todo", icon: "spark" }, { id: "acopio", label: "Puntos de acopio", icon: "box" }, { id: "ofrece", label: "Puedo ayudar", icon: "heart" }, { id: "necesita", label: "Necesito ayuda", icon: "hands" }, { id: "salud", label: "Salud", icon: "care" },
];

const sectionPresentation: Record<"ofrecimientos" | "puntos-acopio" | "necesidades" | "salud", { type: HelpType; eyebrow: string }> = {
  ofrecimientos: { type: "ofrece", eyebrow: "Puedo ayudar" },
  "puntos-acopio": { type: "acopio", eyebrow: "Punto de acopio" },
  necesidades: { type: "necesita", eyebrow: "Necesidad prioritaria" },
  salud: { type: "salud", eyebrow: "Salud y cuidado" },
};

function publicationToHelpItem(publication: Publication): HelpItem | null {
  if (!(publication.seccion in sectionPresentation)) return null;
  const presentation = sectionPresentation[publication.seccion as keyof typeof sectionPresentation];
  return {
    id: publication.id,
    type: presentation.type,
    eyebrow: presentation.eyebrow,
    title: publication.titulo,
    place: publication.url_externa ? "Publicación externa" : "Buenaventura",
    image: publication.archivo || null,
    mediaType: publication.tipo_archivo || "imagen",
    verified: ["oficial", "institucional"].includes(publication.nivel_confianza),
    detail: publication.descripcion || "Consulta la pieza original y confirma su vigencia antes de actuar.",
    href: publication.url_externa,
  };
}

function verificationPresentation(status: string) {
  const normalized = status.toLowerCase();
  if (["verdadero", "verificado", "confirmado"].includes(normalized)) return { className: "true", label: "VERIFICADO" };
  if (["en_revision", "en revisión", "sin_confirmar"].includes(normalized)) return { className: "checking", label: "EN REVISIÓN" };
  return { className: "expired", label: normalized === "falso" ? "FALSO" : "DESACTUALIZADO" };
}

const fallbackVerifications: Verification[] = [
  { afirmacion: "La línea distrital de salud mental fue actualizada.", estado: "verificado", explicacion: "Confirmado por el Distrito de Buenaventura." },
  { afirmacion: "La vía Buga–Buenaventura está completamente habilitada.", estado: "desactualizado", explicacion: "La movilidad continúa controlada. Verifique antes de viajar." },
  { afirmacion: "Cadena sobre entrega de subsidios sin registro previo.", estado: "en_revision", explicacion: "No comparta datos personales hasta confirmar la fuente oficial." },
];

const fallbackContactosNacionales: ContactoLinea[] = [
  { nombre: "Emergencias generales", numero: "123" }, { nombre: "Policía", numero: "112" }, { nombre: "Bomberos", numero: "119" }, { nombre: "Cruz Roja", numero: "132" }, { nombre: "Defensa Civil", numero: "144" },
];
const fallbackContactosBuenaventura: ContactoLinea[] = [
  { nombre: "Cruz Roja Buenaventura", numero: "6022424475" }, { nombre: "Bomberos Buenaventura", numero: "2422222" }, { nombre: "Defensa Civil Buenaventura", numero: "2423719" }, { nombre: "Policía Buenaventura", numero: "165" }, { nombre: "Acueducto (Hidropacífico)", numero: "116" }, { nombre: "Energía", numero: "115" },
];

const fallbackComoSolicitar: { lo_que_se_sabe: PasoAyudaOficial[]; pendiente_de_confirmar: string[]; nota_transparencia: string } = {
  lo_que_se_sabe: [
    { paso: "Punto de atención presencial", detalle: "Oficina de Atención al Ciudadano, frente a la Alcaldía Distrital de Buenaventura. Lunes a viernes, 8:00 AM – 5:00 PM." },
    { paso: "Canal telefónico para gestión de ayudas humanitarias", detalle: "+57 315 2517606 — línea de la Alcaldía Distrital para recepción y gestión de ayudas humanitarias." },
  ],
  pendiente_de_confirmar: ["Requisitos documentales exactos para registrarse como damnificado", "Tipos de ayuda disponibles (subsidio, alojamiento temporal, reconstrucción) y proceso de acceso a cada una", "Tiempos de respuesta esperados"],
  nota_transparencia: "El procedimiento oficial completo de registro como damnificado aún no está publicado en detalle por la Alcaldía — esta sección muestra lo que sí está confirmado y se ampliará cuando haya más información oficial.",
};
const fallbackAdvertenciaFraude = ["NO ha habilitado cuentas bancarias propias para recibir donaciones", "NO se debe entregar dinero en efectivo a ningún funcionario", "SÍ se puede donar en el centro de acopio oficial (Oficina de Atención al Ciudadano)"];
const fallbackChecklistRegistro = ["Origen confirmado geográfica y temporalmente", "No es contenido reciclado de otro país o evento (verificación inversa de imagen/video)", "Respeta dignidad: no muestra personas fallecidas ni menores identificables sin consentimiento", "Consentimiento de quien grabó, para publicar con o sin crédito"];

const fallbackBulletins: Bulletin[] = [
  { id: "fallback-1", nivel_gobierno: "alcaldia", entidad: "Distrito de Buenaventura", titulo: "Informe de situación y acciones de respuesta tras el sismo", descripcion: "Boletín unificado No. 2", archivo: "#cifras", fecha_del_boletin: "2026-08-12", fecha_publicado: "2026-08-12" },
  { id: "fallback-2", nivel_gobierno: "departamento", entidad: "Gobernación del Valle", titulo: "Balance territorial y despliegue de equipos de atención", archivo: "#cifras", fecha_del_boletin: "2026-08-13", fecha_publicado: "2026-08-13" },
  { id: "fallback-3", nivel_gobierno: "nacion", entidad: "UNGRD · SGC", titulo: "Recomendaciones para réplicas y evaluación de viviendas", archivo: "#cifras", fecha_del_boletin: "2026-08-13", fecha_publicado: "2026-08-13" },
];

export default function Home() {
  const [filter, setFilter] = useState<"todos" | HelpType>("todos");
  const [selected, setSelected] = useState<HelpItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [helpItems, setHelpItems] = useState<HelpItem[]>(fallbackHelpItems);
  const [figures, setFigures] = useState(fallbackFigures);
  const [figureCutoff, setFigureCutoff] = useState("12 de agosto de 2026");
  const [magnitude, setMagnitude] = useState("7.4");
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [healthPhone, setHealthPhone] = useState("3138581219");
  const [replicas, setReplicas] = useState<NonNullable<OfficialFigures["replicas_relevantes"]>>([]);
  const [toqueDeQueda, setToqueDeQueda] = useState<OfficialFigures["toque_de_queda"] | null>(null);
  const [contactos, setContactos] = useState<EmergencyContacts | null>(null);
  const [noticias, setNoticias] = useState<Publication[]>([]);
  const [comoSolicitar, setComoSolicitar] = useState<ComoSolicitarAyuda | null>(null);
  const [registroVisual, setRegistroVisual] = useState<RegistroVisual | null>(null);
  const [plataformas, setPlataformas] = useState<Plataformas | null>(null);
  const [cuentasYVoces, setCuentasYVoces] = useState<CuentasYVoces | null>(null);
  const [directorioAyuda, setDirectorioAyuda] = useState<DirectorioAyuda | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      const results = await Promise.allSettled([
        fetchJson<OfficialFigures>("/api/cifras-oficiales", controller.signal),
        fetchJson<Publication[]>("/api/publicaciones", controller.signal),
        fetchJson<{ aclaraciones_oficiales: Verification[] }>("/api/verificado-falso", controller.signal),
        fetchJson<Bulletin[]>("/api/boletines", controller.signal),
        fetchJson<EmergencyContacts>("/api/contactos-emergencia", controller.signal),
        fetchJson<Publication[]>("/api/publicaciones?seccion=noticias", controller.signal),
        fetchJson<ComoSolicitarAyuda>("/api/como-solicitar-ayuda-oficial", controller.signal),
        fetchJson<RegistroVisual>("/api/registro-visual", controller.signal),
        fetchJson<Plataformas>("/api/plataformas", controller.signal),
        fetchJson<CuentasYVoces>("/api/cuentas-y-voces", controller.signal),
        fetchJson<DirectorioAyuda>("/api/directorio-ayuda", controller.signal),
      ]);
      const [officialResult, publicationsResult, verificationsResult, bulletinsResult, contactsResult, noticiasResult, comoSolicitarResult, registroVisualResult, plataformasResult, cuentasYVocesResult, directorioAyudaResult] = results;

      if (officialResult.status === "fulfilled") {
        const official = officialResult.value;
        if (official.replicas_relevantes) setReplicas(official.replicas_relevantes);
        if (official.toque_de_queda) setToqueDeQueda(official.toque_de_queda);
        try {
          setFigures([
            { value: formatNumber(official.buenaventura.afectados), label: "personas afectadas" },
            { value: formatNumber(official.buenaventura.viviendas_destruidas.total), label: "viviendas destruidas" },
            { value: formatNumber(official.buenaventura.viviendas_averiadas.total), label: "viviendas averiadas" },
            { value: formatNumber(official.buenaventura.lesionados), label: "personas lesionadas" },
            { value: formatNumber(official.buenaventura.fallecidos), label: "personas fallecidas" },
          ]);
          setFigureCutoff(formatDate(official.buenaventura.fecha_corte).toLocaleLowerCase("es-CO"));
          setMagnitude(String(official.sismo_principal.magnitud));
        } catch {
          // Un dato con forma inesperada en /api/cifras-oficiales no debe impedir que el resto de secciones carguen.
        }
      }
      if (publicationsResult.status === "fulfilled") {
        const dynamicItems = publicationsResult.value.map(publicationToHelpItem).filter((item): item is HelpItem => item !== null);
        if (dynamicItems.length > 0) setHelpItems(dynamicItems);
      }
      if (verificationsResult.status === "fulfilled") setVerifications(verificationsResult.value.aclaraciones_oficiales);
      if (bulletinsResult.status === "fulfilled") setBulletins(bulletinsResult.value);
      if (contactsResult.status === "fulfilled") {
        setContactos(contactsResult.value);
        if (contactsResult.value.salud_mental?.numero) setHealthPhone(contactsResult.value.salud_mental.numero);
      }
      if (noticiasResult.status === "fulfilled") setNoticias(noticiasResult.value);
      if (comoSolicitarResult.status === "fulfilled") setComoSolicitar(comoSolicitarResult.value);
      if (registroVisualResult.status === "fulfilled") setRegistroVisual(registroVisualResult.value);
      if (plataformasResult.status === "fulfilled") setPlataformas(plataformasResult.value);
      if (cuentasYVocesResult.status === "fulfilled") setCuentasYVoces(cuentasYVocesResult.value);
      if (directorioAyudaResult.status === "fulfilled") setDirectorioAyuda(directorioAyudaResult.value);
    };
    load().catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = "" };
  }, [selected, menuOpen]);

  const filteredItems = useMemo(() => helpItems.filter((item) => filter === "todos" || item.type === filter), [filter, helpItems]);
  const displayedVerifications = verifications.length > 0 ? verifications.slice(0, 3) : fallbackVerifications;
  const displayedBulletins = bulletins.length > 0 ? bulletins.slice(0, 6) : fallbackBulletins;
  const readableHealthPhone = healthPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  const cuentasGroups: { label: string; items: CuentaVoz[] }[] = [
    { label: "Oficiales", items: cuentasYVoces?.oficiales ?? [] },
    { label: "Medios locales", items: cuentasYVoces?.medios_locales ?? [] },
    { label: "ONG con trayectoria", items: cuentasYVoces?.ong_con_trayectoria ?? [] },
    { label: "Profesionales técnicos", items: cuentasYVoces?.profesionales_tecnicos ?? [] },
    { label: "Influencers y personalidades", items: cuentasYVoces?.influencers_y_personalidades ?? [] },
  ];

  const shareSite = async () => {
    const shareData = { title: "Buenaventura se levanta", text: "Información verificada, ayuda y esperanza frente a la emergencia sísmica.", url: window.location.href };
    if (navigator.share) { await navigator.share(shareData).catch(() => undefined); return }
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="emergency-bar"><div className="shell emergency-inner"><span><i className="pulse-dot" /> Emergencia sísmica · M{magnitude}</span><span className="emergency-date">Buenaventura · información en actualización</span><a href="#cifras">Ver último balance <span aria-hidden="true">↘</span></a></div></div>

      <header className="site-header"><div className="shell nav-wrap">
        <a className="brand" href="#inicio" aria-label="Buenaventura se levanta, inicio"><span className="brand-mark" aria-hidden="true"><b>B</b><i /></span><span>Buenaventura<br /><strong>se levanta</strong></span></a>
        <nav className="desktop-nav" aria-label="Navegación principal"><a href="#hoy">Hoy</a><a href="#cifras">Información oficial</a><a href="#socorro">Equipos de socorro</a><a href="#ayuda">Red de ayuda</a><a href="#verificacion">Verificación</a><a href="#boletines">Boletines</a></nav>
        <div className="nav-actions"><button className="share-button" onClick={shareSite}>{copied ? "Enlace copiado" : "Compartir"} <span>↗</span></button><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><span /><span /></button></div>
      </div></header>

      <section className="hero" id="inicio">
        <div className="hero-wash" /><div className="hero-word hero-word-one">BUENA</div><div className="hero-word hero-word-two">VENTURA</div>
        <div className="shell hero-grid">
          <div className="hero-copy"><p className="kicker light"><span>10·08·26</span> La ciudad que no se queda en el suelo</p><h1>Nos golpeó la tierra.<br /><em>Nos sostiene la gente.</em></h1><p className="hero-intro">Este es el relato vivo de una ciudad que se organiza, comparte y vuelve a levantarse desde sus barrios, sus ríos y su mar.</p><div className="hero-actions"><a className="primary-cta" href="#ayuda">Encontrar ayuda <span>→</span></a><a className="text-link light-link" href="#hoy">Ver lo que está pasando <span>↓</span></a></div></div>
          <div className="hero-collage" aria-label="Historias de solidaridad en Buenaventura">
            <figure className="hero-photo hero-photo-main"><img src="/media/12-WhatsApp-Image-2026-08-13-at-2.25.51-PM.jpeg" alt="Fundación apoyando familias afectadas en Buenaventura" /><figcaption><span>01</span> Familias acompañadas</figcaption></figure>
            <figure className="hero-photo hero-photo-small"><img src="/media/02-WhatsApp-Image-2026-08-13-at-2.24.36-PM.jpeg" alt="Profesionales convocados para apoyar viviendas afectadas" /><figcaption><span>02</span> Profesionales unidos</figcaption></figure>
            <div className="hero-seal"><span>POR Y PARA</span><strong>LA GENTE</strong><i>↗</i></div>
          </div>
        </div>
        <div className="hero-bottom shell"><p>Información ciudadana para actuar con dignidad, rapidez y cuidado.</p><span>Desliza para conocer el pulso de la ciudad</span></div>
      </section>

      <section className="road-strip" aria-label="Estado de la vía"><div className="shell road-inner"><div className="road-label"><span className="traffic-light"><i /><i /><i /></span><strong>Estado de la vía</strong></div><div className="road-main"><span>PASO RESTRINGIDO</span><p>Corredor Buga–Buenaventura con movilidad controlada y puntos bajo monitoreo.</p></div><div className="road-time"><small>Actualizado</small><strong>14 AGO · 8:30 a. m.</strong></div><button className="circle-arrow" aria-label="Ver detalle del estado de la vía">↗</button></div></section>

      <section className="manifesto" id="contenido"><div className="shell manifesto-grid"><p className="section-index">01 — EL PULSO</p><div><h2>La emergencia también tiene otro rostro: <em>manos que buscan, cocinan, curan y sostienen.</em></h2><p>La información puede salvar tiempo, recursos y vidas. Aquí reunimos lo oficial y lo comunitario para que cada ayuda encuentre a quien la necesita.</p><div className="solidarity-values" aria-label="Principios de la red"><span><i><SolidarityIcon name="hands" /></i><b>Sostener</b><small>La ayuda llega con dignidad</small></span><span><i><SolidarityIcon name="union" /></i><b>Unir</b><small>La comunidad conecta capacidades</small></span><span><i><SolidarityIcon name="care" /></i><b>Cuidar</b><small>Cada decisión protege una vida</small></span></div></div></div></section>

      <section className="figures-section" id="cifras">
        <div className="shell figures-heading"><div><p className="kicker"><span>Información oficial</span> Corte: {figureCutoff}</p><h2>Lo que sabemos<br />hasta ahora</h2></div><div className="official-note"><span className="verified-badge">✓ Fuente oficial</span><p>Datos reportados por el Distrito Especial de Buenaventura. Las cifras pueden cambiar con cada nuevo boletín.</p><a href="#boletines">Consultar boletín completo →</a></div></div>
        <div className="shell figure-flow">{figures.map((figure, index) => <div className={`figure-item figure-${index + 1}`} key={figure.label}><strong>{figure.value}</strong><span>{figure.label}</span></div>)}<div className="figure-note">Cada cifra representa una historia, una familia y una comunidad.</div></div>
      </section>

      <section className="alert-section" id="alertas" aria-label="Réplicas y toque de queda">
        <div className="shell alert-heading"><p className="section-index">— RÉPLICAS Y TOQUE DE QUEDA</p><h2>Lo que hay que <em>tener presente</em> hoy.</h2></div>
        <div className="shell alert-grid">
          <div className="alert-card curfew-card"><span className={`truth-stamp ${toqueDeQueda?.estado === "vigente" ? "expired" : "true"}`}>{toqueDeQueda ? (toqueDeQueda.estado === "vigente" ? "VIGENTE" : toqueDeQueda.estado.toUpperCase()) : "POR CONFIRMAR"}</span><h3>Toque de queda</h3>{toqueDeQueda?.horario ? <p className="alert-highlight">{toqueDeQueda.horario}</p> : <p className="alert-empty">Aún no hay un decreto oficial confirmado por el equipo.</p>}{toqueDeQueda?.excepciones && toqueDeQueda.excepciones.length > 0 && <ul className="alert-list">{toqueDeQueda.excepciones.map((excepcion) => <li key={excepcion}>{excepcion}</li>)}</ul>}{toqueDeQueda?.nota && <p className="alert-note">{toqueDeQueda.nota}</p>}<p className="alert-source">{toqueDeQueda?.fuente ? `Fuente: ${toqueDeQueda.fuente}` : "Fuente por confirmar"}{toqueDeQueda?.ultimo_decreto_fecha ? ` · ${formatDate(toqueDeQueda.ultimo_decreto_fecha)}` : ""}</p></div>
          <div className="alert-card"><h3>Réplicas relevantes</h3>{replicas.length > 0 ? <ul className="replica-list">{replicas.map((replica) => <li key={`${replica.fecha}-${replica.hora_local ?? ""}`}><strong>M{replica.magnitud}</strong><span>{formatDate(replica.fecha)}{replica.hora_local ? ` · ${replica.hora_local}` : ""}{replica.ubicacion ? ` · ${replica.ubicacion}` : ""}</span></li>)}</ul> : <p className="alert-empty">Sin réplicas relevantes reportadas por el equipo hasta el momento.</p>}<p className="alert-source">{replicas[0]?.fuente ? `Fuente: ${replicas[0].fuente}` : "Fuente: Servicio Geológico Colombiano (SGC)"}</p></div>
        </div>
      </section>

      <section className="socorro-section" id="socorro">
        <div className="shell section-title-row"><div><p className="section-index">02 — EQUIPOS DE SOCORRO Y RESPUESTA</p><h2>A quién llamar<br />ahora mismo.</h2></div><p className="socorro-note">Toca cualquier línea para llamar directo desde el celular.</p></div>
        <div className="shell contact-groups">
          <div className="contact-group"><h3>Líneas nacionales</h3><ul>{(contactos?.nacionales ?? fallbackContactosNacionales).map((contacto) => <li key={contacto.nombre}><a href={`tel:${contacto.numero}`}>{contacto.nombre}<span>{contacto.numero} ↗</span></a></li>)}</ul></div>
          <div className="contact-group"><h3>Buenaventura</h3><ul>{(contactos?.buenaventura ?? fallbackContactosBuenaventura).map((contacto) => <li key={contacto.nombre}><a href={`tel:${contacto.numero}`}>{contacto.nombre}<span>{contacto.numero} ↗</span></a></li>)}</ul></div>
          <div className="contact-group contact-group-highlight"><h3>Apoyo especializado</h3>
            {contactos?.salud_mental?.numero && <a className="contact-highlight" href={`tel:${contactos.salud_mental.numero}`}><span>Salud mental</span><strong>{contactos.salud_mental.numero} ↗</strong>{contactos.salud_mental.descripcion && <small>{contactos.salud_mental.descripcion}</small>}</a>}
            {contactos?.restablecimiento_contacto_familiar && <div className="contact-highlight"><span>Restablecimiento de contacto familiar</span><strong>{contactos.restablecimiento_contacto_familiar.organizacion || "Cruz Roja / CICR"}</strong>{contactos.restablecimiento_contacto_familiar.whatsapp && <small>WhatsApp {contactos.restablecimiento_contacto_familiar.whatsapp}</small>}{contactos.restablecimiento_contacto_familiar.linea_te_escucha && <small>{contactos.restablecimiento_contacto_familiar.linea_te_escucha}</small>}</div>}
            {contactos?.atencion_ciudadano_alcaldia?.numero && <a className="contact-highlight" href={`tel:${contactos.atencion_ciudadano_alcaldia.numero}`}><span>Ayudas humanitarias · Alcaldía</span><strong>{contactos.atencion_ciudadano_alcaldia.numero} ↗</strong></a>}
            {!contactos && <p className="alert-empty">Cargando líneas especializadas…</p>}
          </div>
        </div>
      </section>

      <section className="today-section" id="hoy">
        <div className="shell section-title-row"><div><p className="section-index">03 — BUENAVENTURA HOY</p><h2>Actualidad,<br />verificada y con fecha</h2></div><a className="text-link" href="#ayuda">Ver red de ayuda <span>↗</span></a></div>
        {noticias.length > 0 ? <div className="shell editorial-grid">
          <article className="lead-story"><div className="story-image">{noticias[0].archivo ? (noticias[0].tipo_archivo === "video" ? <video src={noticias[0].archivo} muted playsInline preload="metadata" /> : <img src={noticias[0].archivo} alt={noticias[0].titulo} />) : <div className="story-image-empty"><span>Publicación externa</span><p>Sin imagen alojada en el portal — ábrela en su fuente original.</p></div>}<span className="story-tag">{noticias[0].nivel_confianza}</span></div><div className="story-copy"><p className="story-meta">{formatDate(noticias[0].fecha_publicado)}</p><h3>{noticias[0].titulo}</h3><p>{noticias[0].descripcion || "Consulta la publicación original para más contexto."}</p>{noticias[0].url_externa && <a href={noticias[0].url_externa} target="_blank" rel="noreferrer"><button>Ver publicación <span>→</span></button></a>}</div></article>
          {noticias[1] && <article className="side-story side-story-top">{noticias[1].archivo ? <img src={noticias[1].archivo} alt={noticias[1].titulo} /> : <div className="side-story-empty" />}<div><p className="story-meta">{noticias[1].nivel_confianza} · {formatDate(noticias[1].fecha_publicado)}</p><h3>{noticias[1].titulo}</h3><p>{noticias[1].descripcion}</p>{noticias[1].url_externa && <a className="text-link" href={noticias[1].url_externa} target="_blank" rel="noreferrer">Ver publicación ↗</a>}</div></article>}
          {noticias[2] ? <article className="quote-story quote-story-news"><span aria-hidden="true">“</span><blockquote>{noticias[2].titulo}</blockquote><p>{noticias[2].nivel_confianza} · {formatDate(noticias[2].fecha_publicado)}</p></article> : <article className="quote-story quote-story-news empty-quote"><p>Más actualidad verificada se publica aquí a medida que el equipo la confirma.</p></article>}
        </div> : <div className="shell empty-news"><p>Todavía no hay actualidad verificada y con fecha publicada por el equipo en esta sección. Cuando el equipo confirme una historia, aparecerá aquí con su fuente.</p></div>}
      </section>

      <section className="action-marquee" aria-label="Acciones de ayuda"><div><span>PUEDO AYUDAR</span><i><SolidarityIcon name="heart" /></i><span>NECESITO AYUDA</span><i><SolidarityIcon name="hands" /></i><span>COMPARTIR SALVA</span><i><SolidarityIcon name="union" /></i><span>PUEDO AYUDAR</span></div></section>

      <section className="ayuda-oficial-section" id="ayuda-oficial">
        <div className="shell section-title-row"><div><p className="section-index">04 — CÓMO SOLICITAR AYUDA OFICIAL</p><h2>Si necesitas ayuda,<br />este es el canal oficial.</h2></div><a className="text-link" href="#ayuda">Ver también la red de ayuda <span>↗</span></a></div>
        <div className="shell oficial-grid">
          <div className="oficial-steps"><h3>Lo que ya está confirmado</h3><ol>{(comoSolicitar?.lo_que_se_sabe ?? fallbackComoSolicitar.lo_que_se_sabe).map((paso, index) => <li key={paso.paso}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{paso.paso}</strong><p>{paso.detalle}</p></div></li>)}</ol></div>
          <div className="oficial-pending"><h3>Pendiente de confirmar</h3><ul>{(comoSolicitar?.pendiente_de_confirmar ?? fallbackComoSolicitar.pendiente_de_confirmar).map((item) => <li key={item}>{item}</li>)}</ul><p className="transparency-note">{comoSolicitar?.nota_transparencia ?? fallbackComoSolicitar.nota_transparencia}</p></div>
        </div>
      </section>

      <section className="help-section" id="ayuda">
        <div className="shell help-intro"><div><p className="section-index">05 — RED DE AYUDA</p><h2>Que la ayuda<br /><em>encuentre su camino.</em></h2></div><p>Clasificamos la información que circula en redes y estados para que puedas actuar desde un solo lugar.</p></div>
        <div className="shell filters" role="group" aria-label="Filtrar publicaciones de ayuda">{filters.map((item) => <button className={filter === item.id ? "active" : ""} key={item.id} onClick={() => setFilter(item.id)}><SolidarityIcon name={item.icon} />{item.label}</button>)}</div>
        <div className="shell help-grid">{filteredItems.map((item, index) => <article className={`help-card help-card-${index % 3}`} key={item.id}><button className="card-media" onClick={() => setSelected(item)} aria-label={`Abrir información: ${item.title}`}>{item.image ? (item.mediaType === "video" ? <video src={item.image} muted playsInline preload="metadata" /> : <img src={item.image} alt="" />) : <div className="card-media-empty"><span>Enlace externo</span><p>Sin imagen alojada</p></div>}<span className="open-card">Ver información <i>↗</i></span></button><div className="card-copy"><div className="card-topline"><span>{item.eyebrow}</span><span className={item.verified ? "status verified" : "status reviewing"}>{item.verified ? "✓ Verificado" : "◌ En revisión"}</span></div><h3>{item.title}</h3><p>{item.place}</p></div></article>)}</div>
      </section>

      <section className="directorio-section" id="directorio-ayuda">
        <div className="shell section-title-row"><div><p className="section-index">06 — DIRECTORIO VERIFICADO</p><h2>A quién sí<br /><em>puedes donarle.</em></h2></div><p className="directorio-note">Organizaciones y colectivos identificables, revisados por el equipo antes de publicarse.</p></div>
        <div className="shell fraud-warning"><strong>{directorioAyuda?.advertencia_fraude.titulo ?? "La Alcaldía de Buenaventura aclaró públicamente:"}</strong><ul>{(directorioAyuda?.advertencia_fraude.puntos ?? fallbackAdvertenciaFraude).map((punto) => <li key={punto}>{punto}</li>)}</ul></div>
        <div className="shell directorio-grid">
          {(directorioAyuda?.iniciativas ?? []).map((iniciativa) => <article className="directorio-card" key={iniciativa.nombre}>
            <span className={`trust-badge trust-${iniciativa.nivel_confianza}`}>{iniciativa.nivel_confianza}</span>
            <h3>{iniciativa.nombre}</h3>
            {iniciativa.descripcion && <p>{iniciativa.descripcion}</p>}
            {(iniciativa.ubicacion || iniciativa.horario) && <p className="directorio-meta">⌖ {iniciativa.ubicacion}{iniciativa.horario ? ` · ${iniciativa.horario}` : ""}</p>}
            <div className="directorio-accounts">
              {iniciativa.cuenta && <span>Cuenta: {iniciativa.cuenta}</span>}
              {iniciativa.cuenta_bancolombia_ahorros && <span>Bancolombia ahorros: {iniciativa.cuenta_bancolombia_ahorros}</span>}
              {iniciativa.llave_bre_b && <span>Llave Bre-B: {iniciativa.llave_bre_b}</span>}
              {iniciativa.llave_daviplata && <span>Daviplata: {iniciativa.llave_daviplata}</span>}
              {iniciativa.contacto_whatsapp && <span>WhatsApp: {iniciativa.contacto_whatsapp}</span>}
            </div>
            {iniciativa.recibe && iniciativa.recibe.length > 0 && <p className="directorio-recibe"><strong>Recibe:</strong> {iniciativa.recibe.join(", ")}</p>}
            {iniciativa.no_recibe && iniciativa.no_recibe.length > 0 && <p className="directorio-no-recibe"><strong>No recibe:</strong> {iniciativa.no_recibe.join(", ")}</p>}
            {iniciativa.puntos_entrega && iniciativa.puntos_entrega.length > 0 && <p className="directorio-meta">Puntos de entrega: {iniciativa.puntos_entrega.join(" · ")}</p>}
            <p className="alert-source">{iniciativa.fuente ? `Fuente: ${iniciativa.fuente}` : "Fuente por confirmar"}{iniciativa.nota_verificacion ? ` · ${iniciativa.nota_verificacion}` : ""}</p>
          </article>)}
          {(!directorioAyuda || directorioAyuda.iniciativas.length === 0) && <p className="alert-empty">Cargando directorio verificado…</p>}
        </div>
      </section>

      <section className="medical-section" id="atencion-medica"><div className="shell medical-layout"><div className="medical-art"><img src="/media/14-WhatsApp-Image-2026-08-13-at-2.23.56-PM.jpeg" alt="Servicio solidario de fisioterapia respiratoria" /><div className="medical-number">24<span>/</span>7</div></div><div className="medical-copy"><p className="section-index">CUIDAR TAMBIÉN ES LEVANTAR</p><h2>Salud para el cuerpo.<br /><em>Compañía para el alma.</em></h2><p>Encuentra atención médica, fisioterapia respiratoria, apoyo psicosocial y orientación gratuita ofrecida por profesionales de la ciudad.</p><div className="hotline"><span>Línea distrital de salud mental</span><a href={`tel:${healthPhone}`}>{readableHealthPhone} <i>↗</i></a></div><a className="primary-cta dark-cta" href="#ayuda">Ver servicios disponibles <span>→</span></a></div></div></section>

      <section className="registro-visual-section" id="registro-visual">
        <div className="shell section-title-row"><div><p className="section-index">07 — REGISTRO VISUAL</p><h2>Foto y video,<br />solo si pasa el filtro.</h2></div></div>
        <div className="shell registro-grid">
          {registroVisual && registroVisual.items.length > 0 ? <div className="registro-items">{registroVisual.items.map((item) => <article key={item.titulo}><h3>{item.titulo}</h3>{item.descripcion && <p>{item.descripcion}</p>}<p className="alert-source">Verificado el {formatDate(item.fecha_verificacion)}</p></article>)}</div> : <div className="registro-empty"><i className="registro-empty-icon"><SolidarityIcon name="check" /></i><p>{registroVisual?.nota_transparencia ?? "Todavía no hay ningún video o foto que haya pasado el checklist de verificación del equipo. No se publica contenido visual sin verificar, aunque eso signifique que esta sección empiece vacía."}</p></div>}
          <div className="registro-checklist"><h3>Antes de publicar, el equipo confirma:</h3><ul>{(registroVisual?.checklist_antes_de_publicar ?? fallbackChecklistRegistro).map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="verification-section" id="verificacion"><div className="shell verification-grid"><div><p className="section-index light-index">08 — VERIFICADO / FALSO</p><h2>En una emergencia,<br /><em>la verdad también cuida.</em></h2></div><div className="verification-feed">
        {displayedVerifications.map((verification) => { const presentation = verificationPresentation(verification.estado); return <article key={verification.afirmacion}><span className={`truth-stamp ${presentation.className}`}>{presentation.label}</span><div><h3>{verification.afirmacion}</h3><p>{verification.explicacion}{verification.fuente ? ` · ${verification.fuente}` : ""}</p></div><button aria-label={`Detalle: ${verification.afirmacion}`}>↗</button></article> })}
      </div></div></section>

      <section className="bulletins-section" id="boletines"><div className="shell section-title-row bulletin-title"><div><p className="section-index">09 — FUENTES OFICIALES</p><h2>Boletines para entender y actuar</h2></div><span className="update-clock">Contenido sincronizado con el panel</span></div><div className="shell bulletin-list">{displayedBulletins.map((bulletin, index) => <article key={bulletin.id}><span className="bulletin-number">{String(index + 1).padStart(2, "0")}</span><span className="bulletin-level">{bulletin.nivel_gobierno === "alcaldia" ? "Distrito" : bulletin.nivel_gobierno === "departamento" ? "Departamento" : "Nación"}</span><div><h3>{bulletin.titulo}</h3><p>{bulletin.entidad}{bulletin.descripcion ? ` · ${bulletin.descripcion}` : ""}</p></div><time>{formatDate(bulletin.fecha_del_boletin || bulletin.fecha_publicado)}</time><a className="circle-arrow" href={bulletin.archivo} target={bulletin.archivo.startsWith("http") ? "_blank" : undefined} rel="noreferrer" aria-label={`Abrir boletín: ${bulletin.titulo}`}>↗</a></article>)}</div></section>

      <section className="plataformas-section" id="plataformas">
        <div className="shell section-title-row"><div><p className="section-index">10 — PLATAFORMAS ÚTILES</p><h2>Otras herramientas<br />que ya existen.</h2></div></div>
        <div className="shell plataformas-columns">
          <div className="plataformas-group"><h3>Ciudadanas</h3><div className="plataformas-list">{(plataformas?.ciudadanas ?? []).map((plataforma) => <a key={plataforma.nombre} href={plataforma.url} target="_blank" rel="noreferrer"><div><strong>{plataforma.nombre}</strong>{plataforma.descripcion && <small>{plataforma.descripcion}</small>}</div><i>↗</i></a>)}</div></div>
          <div className="plataformas-group"><h3>Oficiales</h3><div className="plataformas-list">{(plataformas?.oficiales ?? []).map((plataforma) => <a key={plataforma.nombre} href={plataforma.url} target="_blank" rel="noreferrer"><div><strong>{plataforma.nombre}</strong>{plataforma.descripcion && <small>{plataforma.descripcion}</small>}</div><i>↗</i></a>)}</div></div>
        </div>
        {!plataformas && <p className="shell alert-empty">Cargando plataformas…</p>}
      </section>

      <section className="cuentas-section" id="cuentas-voces">
        <div className="shell section-title-row"><div><p className="section-index">11 — CUENTAS Y VOCES</p><h2>A quién sí<br /><em>seguirle la pista.</em></h2></div><p className="directorio-note">Cuentas y personas con acción real verificada, no solo mensajes de solidaridad.</p></div>
        <div className="shell cuentas-criterios"><h3>Criterios de inclusión</h3><ul>{(cuentasYVoces?.criterios_inclusion ?? []).map((criterio) => <li key={criterio}>{criterio}</li>)}</ul></div>
        <div className="shell cuentas-columns">{cuentasGroups.map((group) => <div className="cuentas-group" key={group.label}><h3>{group.label}</h3>{group.items.length > 0 ? <ul>{group.items.map((cuenta) => <li key={cuenta.nombre}><strong>{cuenta.nombre}</strong>{cuenta.canal && <span>{cuenta.canal}</span>}{cuenta.descripcion && <p>{cuenta.descripcion}</p>}{cuenta.estado_verificacion && <small>{cuenta.estado_verificacion}</small>}</li>)}</ul> : <p className="alert-empty">Sin cuentas verificadas todavía en esta categoría.</p>}</div>)}</div>
      </section>

      <section className="acerca-section" id="acerca-de">
        <div className="shell acerca-grid">
          <div><p className="section-index">12 — ACERCA DE LA INICIATIVA</p><h2>Cómo verificamos,<br /><em>publicamos y corregimos.</em></h2></div>
          <div className="acerca-copy">
            <p>Buenaventura SE LEVANTA es una iniciativa ciudadana impulsada por Kobia Inteligencia Ancestral S.A.S. No reemplaza a las entidades oficiales — centraliza y verifica información dispersa en boletines oficiales, redes sociales y reportes ciudadanos, para que una cifra o una cuenta de donación no dependa de un flyer sin fuente.</p>
            <blockquote>Lo volátil se enlaza con fuente y fecha; lo estable se afirma con nombre propio; lo no verificado se marca explícitamente como tal.</blockquote>
            <p>Cada cifra, contacto o cuenta que publicamos pasa por un equipo antes de salir al público. Cuando algo no está confirmado, lo decimos así — como en Registro visual, que empieza vacía a propósito. Si encuentras un error, puedes reportarlo por los mismos canales de contacto del portal.</p>
          </div>
        </div>
      </section>

      <section className="resources-section" aria-label="Más información útil"><div className="shell resources-layout">
        <div className="resources-heading"><p className="section-index">ÍNDICE</p><h2>Todo lo útil,<br /><em>en un solo lugar.</em></h2><p>Rutas claras para actuar sin perder tiempo y sin exponer información personal innecesaria.</p></div>
        <nav className="resource-links">{[
          ["Cómo solicitar ayuda oficial", "Pasos, canales y documentos necesarios", "#ayuda-oficial", "01"], ["Réplicas y toque de queda", "Última actividad sísmica y restricciones vigentes", "#alertas", "02"], ["Directorio verificado de ayuda", "A quién sí donarle, con cuentas y advertencia de fraude", "#directorio-ayuda", "03"], ["Plataformas útiles", "Mapas, registros y servicios públicos", "#plataformas", "04"], ["Equipos de socorro", "Quiénes están trabajando y cómo contactarlos", "#socorro", "05"], ["Cuentas y voces", "Periodistas, organizaciones y líderes del territorio", "#cuentas-voces", "06"], ["Acerca de la iniciativa", "Cómo verificamos, publicamos y corregimos", "#acerca-de", "07"],
        ].map((resource) => <a href={resource[2]} key={resource[0]}><span>{resource[3]}</span><div><strong>{resource[0]}</strong><small>{resource[1]}</small></div><i>↗</i></a>)}</nav>
      </div></section>

      <section className="final-call"><div className="shell final-call-inner"><p className="final-symbol"><SolidarityIcon name="hands" /> Una ciudad no se levanta sola.</p><h2>Comparte lo útil.<br />Verifica lo urgente.<br /><em>Sostén a tu gente.</em></h2><div><a className="primary-cta" href="#ayuda"><SolidarityIcon name="heart" /> Quiero ayudar <span>→</span></a><button onClick={shareSite}>Compartir este portal ↗</button></div></div></section>

      <footer><div className="shell footer-grid"><div className="footer-brand"><span className="brand-mark footer-mark"><b>B</b><i /></span><h2>Buenaventura<br /><strong>se levanta</strong></h2><p>Una iniciativa ciudadana hecha por y para la comunidad.</p></div><div><h3>Información</h3><a href="#cifras">Cifras oficiales</a><a href="#alertas">Réplicas y toque de queda</a><a href="#hoy">Actualidad</a><a href="#boletines">Boletines</a><a href="#verificacion">Verificado / Falso</a><a href="#registro-visual">Registro visual</a></div><div><h3>Ayuda</h3><a href="#ayuda-oficial">Solicitar ayuda oficial</a><a href="#ayuda">Necesito ayuda</a><a href="#ayuda">Puedo ayudar</a><a href="#directorio-ayuda">Directorio verificado</a><a href="#socorro">Equipos de socorro</a><a href="#atencion-medica">Atención médica</a></div><div><h3>Emergencias</h3><a href="tel:123">Línea 123</a><a href="tel:132">Cruz Roja 132</a><a href="tel:119">Bomberos 119</a><a href="#acerca-de">Acerca de la iniciativa</a><button onClick={shareSite}>Compartir el portal ↗</button></div></div><div className="shell footer-bottom"><span>© 2026 Buenaventura se levanta</span><span>Fondos editoriales ilustrativos · Registro visual con fuente</span><a href="#inicio">Volver arriba ↑</a></div></footer>

      {selected && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}><article className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button><div className="modal-image">{selected.image ? (selected.mediaType === "video" ? <video src={selected.image} controls playsInline /> : <img src={selected.image} alt={`Pieza informativa: ${selected.title}`} />) : <div className="modal-image-empty"><span>Enlace externo</span><p>Esta publicación no tiene imagen alojada en el portal — ábrela en su fuente original para verla.</p></div>}</div><div className="modal-copy"><div className="card-topline"><span>{selected.eyebrow}</span><span className={selected.verified ? "status verified" : "status reviewing"}>{selected.verified ? "✓ Verificado" : "◌ En revisión"}</span></div><h2 id="modal-title">{selected.title}</h2><p className="modal-place">⌖ {selected.place}</p><p>{selected.detail}</p><div className="safety-note"><strong>Antes de donar</strong><span>Confirma la vigencia y la identidad del responsable. Las solicitudes monetarias requieren verificación adicional.</span></div><div className="modal-actions">{selected.href && <a href={selected.href} target="_blank" rel="noreferrer">Abrir publicación original ↗</a>}<button onClick={shareSite}>Compartir información ↗</button><button onClick={() => setSelected(null)}>Seguir explorando</button></div></div></article></div>}

      {menuOpen && <div className="menu-overlay"><div className="shell menu-top"><a className="brand inverse" href="#inicio"><span className="brand-mark"><b>B</b><i /></span><span>Buenaventura<br /><strong>se levanta</strong></span></a><button onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button></div><nav className="shell mobile-nav" aria-label="Menú móvil">{[["Hoy", "#hoy"], ["Información oficial", "#cifras"], ["Equipos de socorro", "#socorro"], ["Red de ayuda", "#ayuda"], ["Verificación", "#verificacion"], ["Boletines", "#boletines"]].map(([label, href], index) => <a href={href} onClick={() => setMenuOpen(false)} key={href}><span>0{index + 1}</span>{label}<i>↗</i></a>)}</nav><p className="shell menu-footer">Información ciudadana para actuar con dignidad, rapidez y cuidado.</p></div>}
    </main>
  );
}

// Sistema de iconos inline en SVG del portal (política corporativa: sin
// emojis). Vivía dentro de app/page.tsx; se mueve aquí sin cambios en los 8
// nombres originales para que MobileTabBar y EmergencySheet puedan
// reutilizarlo en vez de crear un segundo set de iconos. Se añaden los
// nombres que necesita la navegación móvil: home, phone, menu, alert, copy,
// wa (WhatsApp, para el enlace del CICR en la hoja de emergencia).

export type SolidarityIconName =
  | "heart" | "hands" | "union" | "box" | "care" | "spark" | "check" | "link"
  | "home" | "phone" | "menu" | "alert" | "copy" | "wa";

export function SolidarityIcon({ name, className = "" }: { name: SolidarityIconName; className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "heart" && <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />}
    {name === "hands" && <><path d="M8.2 20 5 18.2a3.8 3.8 0 0 1-1.9-3.3v-3.4a1.5 1.5 0 0 1 3 0v2.1" /><path d="m6 13.2 2.7 1.5a2.8 2.8 0 0 1 1.3 2.4V21" /><path d="m15.8 20 3.2-1.8a3.8 3.8 0 0 0 1.9-3.3v-3.4a1.5 1.5 0 0 0-3 0v2.1" /><path d="m18 13.2-2.7 1.5a2.8 2.8 0 0 0-1.3 2.4V21" /><path d="M15.1 4.2a2.6 2.6 0 0 0-3.1.5 2.6 2.6 0 0 0-4.1 3.1c.6 1.7 4.1 3.9 4.1 3.9s3.5-2.2 4.1-3.9a2.6 2.6 0 0 0-1-3.6Z" /></>}
    {name === "union" && <><path d="m3.5 10.5 4-4 4.2 4.2-2.1 2.1a1.7 1.7 0 0 0 2.4 2.4l3.7-3.7" /><path d="m12.3 7.2 1.5-1.5a2.5 2.5 0 0 1 3.5 0l3.2 3.2" /><path d="m3 10 7.5 7.5a2 2 0 0 0 2.8 0l.5-.5" /><path d="m20.5 9-6.7 8" /><path d="M2 8.5 5.5 5 8 7.5 4.5 11Z" /><path d="m16 7.5 2.5-2.5L22 8.5 19.5 11Z" /></>}
    {name === "box" && <><path d="m4 8 8-4 8 4v9l-8 4-8-4Z" /><path d="m4 8 8 4 8-4M12 12v9" /><path d="M10.5 7.2c.6-.7 1.7-.6 2.1.2.5-.8 1.6-.9 2.2-.2.7.9 0 2.1-2.2 3.3-2.1-1.2-2.8-2.4-2.1-3.3Z" /></>}
    {name === "care" && <><path d="M20.8 5.7a5.4 5.4 0 0 0-7.7-.1L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z" /><path d="M5.8 13h3l1.2-3 2.1 6 1.6-3h4.5" /></>}
    {name === "spark" && <><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /><circle cx="12" cy="12" r="3.2" /></>}
    {name === "check" && <><path d="M6 3.5h9.2L19 7.3V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" /><path d="M15.2 3.5v3.8H19" /><path d="m8.3 13.2 2.3 2.3 5-5" /></>}
    {name === "link" && <><path d="M10 14 14 10" /><path d="M8.3 15.7a3.2 3.2 0 0 1 0-4.5l2-2a3.2 3.2 0 0 1 4.5 0" /><path d="M15.7 8.3a3.2 3.2 0 0 1 0 4.5l-2 2a3.2 3.2 0 0 1-4.5 0" /></>}
    {name === "home" && <path d="M3.5 10.4 12 3.5l8.5 6.9V20a1 1 0 0 1-1 1h-4.6v-6.1H9.1V21H4.5a1 1 0 0 1-1-1Z" />}
    {name === "phone" && <path d="M6.5 3.5h3l1.6 4-2 1.5a11.5 11.5 0 0 0 5.4 5.4l1.5-2 4 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.6 5.7a2 2 0 0 1 2-2.2Z" />}
    {name === "menu" && <path d="M4 7h16M4 12h16M4 17h16" />}
    {name === "alert" && <><path d="M12 3.6 21.2 19a1 1 0 0 1-.9 1.5H3.7A1 1 0 0 1 2.8 19Z" /><path d="M12 9.6v4.2M12 17.2h.01" /></>}
    {name === "copy" && <><rect x="8.5" y="8.5" width="12" height="12" rx="2" /><path d="M15.5 5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2" /></>}
    {name === "wa" && <><path d="M3.5 20.5 5 16.7A8 8 0 1 1 8 19.4Z" /><path d="M8.9 9.2c.3 2.6 2.4 4.6 5 5l1-1.4 2 .9-.2 1.6c-2.9.6-6.6-2.3-7.5-6l1.5-.7Z" /></>}
  </svg>;
}

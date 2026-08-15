"use client";

import { useEffect, useRef } from "react";
import { SolidarityIcon } from "./SolidarityIcon";

export type ContactoLinea = { nombre: string; numero: string };
export type EmergencyContacts = {
  nacionales?: ContactoLinea[];
  buenaventura?: ContactoLinea[];
  salud_mental?: { numero?: string; nombre?: string; descripcion?: string; fuente?: string };
  restablecimiento_contacto_familiar?: { organizacion?: string; whatsapp?: string; email?: string; linea_te_escucha?: string };
  atencion_ciudadano_alcaldia?: { nombre?: string; numero?: string };
};

// Únicas líneas de respaldo del portal: si /api/contactos-emergencia falla
// (el backend de Render se cae de forma intermitente, ver docs/ENTORNOS.md),
// tanto esta hoja como la sección #socorro de page.tsx caen aquí. Antes
// vivían duplicadas en page.tsx — se centralizan para que solo haya una
// fuente de verdad.
export const fallbackContactosNacionales: ContactoLinea[] = [
  { nombre: "Emergencias generales", numero: "123" }, { nombre: "Policía", numero: "112" }, { nombre: "Bomberos", numero: "119" }, { nombre: "Cruz Roja", numero: "132" }, { nombre: "Defensa Civil", numero: "144" },
];
export const fallbackContactosBuenaventura: ContactoLinea[] = [
  { nombre: "Cruz Roja Buenaventura", numero: "6022424475" }, { nombre: "Bomberos Buenaventura", numero: "2422222" }, { nombre: "Defensa Civil Buenaventura", numero: "2423719" }, { nombre: "Policía Buenaventura", numero: "165" }, { nombre: "Acueducto (Hidropacífico)", numero: "116" }, { nombre: "Energía", numero: "115" },
];

function soloDigitos(numero: string) { return numero.replace(/[^\d]/g, "") }
function waLink(numero: string) { return `https://wa.me/${soloDigitos(numero)}` }

export function EmergencySheet({ open, onClose, contactos }: { open: boolean; onClose: () => void; contactos: EmergencyContacts | null }) {
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cerrarRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose() };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const nacionales = contactos?.nacionales ?? fallbackContactosNacionales;
  const buenaventura = contactos?.buenaventura ?? fallbackContactosBuenaventura;
  const saludMental = contactos?.salud_mental;
  const cicr = contactos?.restablecimiento_contacto_familiar;
  const alcaldia = contactos?.atencion_ciudadano_alcaldia;

  return (
    <div className="sos-sheet-wrap" role="presentation" onMouseDown={onClose}>
      <div className="sos-sheet-bg" />
      <article className="sos-sheet" role="dialog" aria-modal="true" aria-labelledby="sos-sheet-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sos-sheet-head">
          <div><h2 id="sos-sheet-title">Llamar ahora</h2><p>Toca cualquier línea para marcar directo</p></div>
          <button ref={cerrarRef} type="button" className="sos-sheet-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="sos-sheet-body">
          <div className="sos-group">
            <p className="sos-group-title">Emergencia inmediata</p>
            {nacionales.map((contacto) => (
              <a key={contacto.nombre} className="sos-call sos-call-urgent" href={`tel:${contacto.numero}`}>
                <SolidarityIcon name="phone" />
                <span className="sos-call-name">{contacto.nombre}</span>
                <span className="sos-call-number">{contacto.numero}</span>
              </a>
            ))}
          </div>

          {(saludMental?.numero || cicr || alcaldia?.numero) && (
            <div className="sos-group">
              <p className="sos-group-title">Apoyo especializado</p>
              {saludMental?.numero && (
                <a className="sos-call sos-call-mind" href={`tel:${saludMental.numero}`}>
                  <SolidarityIcon name="care" />
                  <span className="sos-call-name">{saludMental.nombre || "Salud mental"}{saludMental.descripcion && <small>{saludMental.descripcion}</small>}</span>
                  <span className="sos-call-number">{saludMental.numero}</span>
                </a>
              )}
              {cicr?.whatsapp && (
                <a className="sos-call sos-call-wa" href={waLink(cicr.whatsapp)} target="_blank" rel="noreferrer">
                  <SolidarityIcon name="wa" />
                  <span className="sos-call-name">{cicr.organizacion || "Restablecimiento de contacto familiar"}<small>WhatsApp{cicr.linea_te_escucha ? ` · también ${cicr.linea_te_escucha}` : ""}</small></span>
                  <span className="sos-call-number">{cicr.whatsapp}</span>
                </a>
              )}
              {alcaldia?.numero && (
                <a className="sos-call" href={`tel:${alcaldia.numero}`}>
                  <SolidarityIcon name="hands" />
                  <span className="sos-call-name">{alcaldia.nombre || "Ayudas humanitarias · Alcaldía"}</span>
                  <span className="sos-call-number">{alcaldia.numero}</span>
                </a>
              )}
            </div>
          )}

          <div className="sos-group">
            <p className="sos-group-title">Buenaventura</p>
            {buenaventura.map((contacto) => (
              <a key={contacto.nombre} className="sos-call" href={`tel:${contacto.numero}`}>
                <SolidarityIcon name="phone" />
                <span className="sos-call-name">{contacto.nombre}</span>
                <span className="sos-call-number">{contacto.numero}</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

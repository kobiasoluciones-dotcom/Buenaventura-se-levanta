"use client";

import { SolidarityIcon } from "./SolidarityIcon";
import { VISTAS, type VistaId } from "./vistas";

// Barra de navegación fija, visible solo ≤760px (app/mobile.css la esconde
// por defecto y la muestra dentro del media query). Es puramente
// presentacional: no decide a qué vista pertenece cada sección (eso vive en
// vistas.ts) ni hace scroll — page.tsx orquesta ambas cosas en onCambiar.
export function MobileTabBar({
  activa,
  onCambiar,
  onAbrirSOS,
  novedadesAyuda = 0,
}: {
  activa: VistaId;
  onCambiar: (vista: VistaId) => void;
  onAbrirSOS: () => void;
  novedadesAyuda?: number;
}) {
  const mitad = Math.ceil(VISTAS.length / 2);
  const antesDelSOS = VISTAS.slice(0, mitad);
  const despuesDelSOS = VISTAS.slice(mitad);

  return (
    <nav className="tab-bar" aria-label="Navegación de emergencia">
      {antesDelSOS.map((vista) => <TabBarItem key={vista.id} vista={vista} activa={activa} onCambiar={onCambiar} novedades={vista.id === "ayuda" ? novedadesAyuda : 0} />)}

      <span className="tab-bar-item tab-bar-item-sos">
        <button type="button" className="tab-bar-sos" onClick={onAbrirSOS} aria-haspopup="dialog" aria-label="Abrir líneas de emergencia">
          <SolidarityIcon name="phone" />
        </button>
        <span>SOS</span>
      </span>

      {despuesDelSOS.map((vista) => <TabBarItem key={vista.id} vista={vista} activa={activa} onCambiar={onCambiar} novedades={vista.id === "ayuda" ? novedadesAyuda : 0} />)}
    </nav>
  );
}

function TabBarItem({ vista, activa, onCambiar, novedades }: { vista: (typeof VISTAS)[number]; activa: VistaId; onCambiar: (vista: VistaId) => void; novedades: number }) {
  const esActiva = vista.id === activa;
  return (
    <button
      type="button"
      className="tab-bar-item"
      onClick={() => onCambiar(vista.id)}
      aria-current={esActiva ? "page" : undefined}
    >
      <span className="tab-bar-icon">
        <SolidarityIcon name={vista.icon} />
        {novedades > 0 && <i className="tab-bar-badge" aria-hidden="true" />}
      </span>
      <span>{vista.label}</span>
      {novedades > 0 && <span className="sr-only">, {novedades} publicaciones nuevas</span>}
    </button>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchJson } from "../lib/api";

const INTERVALO_MS = 60_000;

type RespuestaNovedades = { conteo: number; ultima_fecha: string | null };

// Badge "N nuevas" de la pestaña Ayuda. Sondea GET /api/novedades cada 60s en
// vez de mantener una conexión SSE abierta: el backend de Render se cae de
// forma intermitente (docs/ENTORNOS.md) y una conexión de larga vida se
// rompería en cada caída sin avisar. Un fetch periódico simplemente falla
// una vez y se recupera solo en el siguiente intento.
//
// El hook se autoinicializa: en su primera consulta no pasa `desde`, así que
// el backend solo devuelve la fecha de la publicación más reciente sin
// contarla como "novedad" — evita anunciar como nuevo algo que ya estaba
// publicado antes de que alguien abriera el portal. Esa fecha queda como
// base para las consultas siguientes.
export function useNovedades() {
  const [conteo, setConteo] = useState(0);
  const baseRef = useRef<string | null>(null);
  const ultimaFechaRef = useRef<string | null>(null);
  const inicializadoRef = useRef(false);

  const consultar = useCallback(async (signal: AbortSignal) => {
    if (document.visibilityState !== "visible") return;
    try {
      const query = baseRef.current ? `?desde=${encodeURIComponent(baseRef.current)}` : "";
      const resultado = await fetchJson<RespuestaNovedades>(`/api/novedades${query}`, signal);
      ultimaFechaRef.current = resultado.ultima_fecha;
      if (!inicializadoRef.current) {
        inicializadoRef.current = true;
        baseRef.current = resultado.ultima_fecha;
        return;
      }
      setConteo(resultado.conteo);
    } catch {
      // Backend caído, CORS mal configurado o sin conexión: el badge
      // simplemente no aparece. El resto del portal sigue con sus fallbacks.
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    consultar(controller.signal);

    const intervalo = window.setInterval(() => consultar(new AbortController().signal), INTERVALO_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") consultar(new AbortController().signal);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      controller.abort();
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [consultar]);

  // Llamar tras recargar la lista de ayuda (botón "Ver N nuevas"): pone el
  // contador en cero de inmediato y adelanta la base, así que si de verdad
  // llega algo nuevo después, el badge vuelve a aparecer en el próximo sondeo.
  const marcarVistas = useCallback(() => {
    baseRef.current = ultimaFechaRef.current;
    setConteo(0);
  }, []);

  return { conteo, marcarVistas };
}

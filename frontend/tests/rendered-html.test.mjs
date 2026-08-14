import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const proyectoRoot = fileURLToPath(new URL("..", import.meta.url));
const nextBin = path.join(
  proyectoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

// Prueba de humo: levanta el build de produccion de Next.js real (el mismo
// `next start` que corre en Render) y confirma que la pagina responde.
function esperarPuerto(url, intentos = 30) {
  return new Promise((resolve, reject) => {
    const intentar = (restantes) => {
      fetch(url)
        .then(resolve)
        .catch((error) => {
          if (restantes <= 0) return reject(error);
          setTimeout(() => intentar(restantes - 1), 500);
        });
    };
    intentar(intentos);
  });
}

test("el build de produccion responde con la pagina principal", async () => {
  const puerto = 3799;
  const proceso = spawn(nextBin, ["start", "-p", String(puerto)], {
    cwd: proyectoRoot,
    stdio: "ignore",
    shell: process.platform === "win32",
  });

  try {
    const respuesta = await esperarPuerto(`http://localhost:${puerto}/`);
    assert.equal(respuesta.status, 200);
    assert.match(respuesta.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await respuesta.text();
    assert.match(html, /Buenaventura se levanta/i);
  } finally {
    proceso.kill();
  }
});

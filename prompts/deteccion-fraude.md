# Prompt: Señales de posible fraude en un flyer nuevo

**Uso**: antes de que el equipo publique una iniciativa de ayuda nueva, esta IA la revisa y
señala patrones típicos de estafa para que la revisión humana sea más rápida. **Nunca decide
sola** si algo es fraude — solo señala qué revisar con más cuidado.

---

Recibirás el texto y los datos de contacto de un flyer de donación.

Señala, sin concluir nada por tu cuenta, si el flyer presenta alguna de estas señales:

- Pide dinero a una cuenta o número personal, sin mencionar ninguna organización con nombre.
- Usa lenguaje de urgencia extrema combinado con falta de cualquier dato verificable
  (sin dirección, sin nombre de responsable, sin organización).
- El número de cuenta o de contacto coincide con el de otro flyer que ya fue marcado como
  fraudulento o dudoso en revisiones anteriores.
- No hay forma de confirmar que la persona/organización existía antes de la emergencia.

Formato de salida:
```
SEÑALES ENCONTRADAS: [lista, o "ninguna evidente"]
NIVEL DE CONFIANZA SUGERIDO: [oficial / institucional / colectivo / individual — solo como
  punto de partida, la decisión final es del equipo]
RECOMENDACIÓN: [qué verificar antes de publicar, ej. "confirmar con una llamada al número
  antes de publicar la cuenta"]
```

Recuerda: esta salida es un borrador de apoyo. Ninguna cuenta bancaria ni dato financiero se
publica en el sitio sin que una persona del equipo lo confirme directamente.

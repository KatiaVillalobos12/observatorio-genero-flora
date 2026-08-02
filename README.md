# Flora - Asistenta del Observatorio de Género en Educación Superior

**Estudiante:** Katia Villalobos Carlos

**Curso:** E-Government Intelligence: Desarrollo de Aplicaciones y Chatbots para la Gestión Pública - QLAB PUCP (2026-1)

**Profesor:** Cristian Muñoz Villalobos

**Entrega:** Trabajo final: Diseño y prototipo de un sistema de IA

## Qué es

**Flora** es el asistente conversacional planteado en la ficha de diagnóstico inicial del
curso para el **Observatorio de Género en Educación Superior** (Oficina para la Igualdad de
Género y Diversidad, PUCP). Su nombre es un homenaje a Flora Tristán, pensadora y pionera del
feminismo peruano. El Observatorio publica indicadores, estudios y buenas prácticas sobre
igualdad de género en la educación superior; a medida que el catálogo crece, se vuelve más
difícil ubicar el dato o informe exacto que se necesita.

Flora responde preguntas en lenguaje natural y cita siempre la fuente original
(indicador y fuente estadística, o título del estudio/práctica).

## Cómo funciona (arquitectura)

En vez de un pipeline de embeddings + base vectorial, el asistente usa un enfoque de
**recuperación agéntica**: el LLM tiene acceso a una herramienta de terminal bash virtual
(`bash-tool` + `just-bash`) con los documentos del Observatorio cargados como archivos de
texto. El modelo decide cuándo usar `grep`/`cat`/`ls` para buscar la información relevante
antes de responder — sin necesidad de generar ni almacenar embeddings.

```
knowledge/
  indicadores/   8 archivos .txt (series de datos: matrícula, graduación, docencia, investigación, liderazgo)
  estudios/      54 archivos .txt (investigaciones académicas)
  practicas/     15 archivos .txt (programas/intervenciones documentadas)
```

- **LLM:** vía [OpenRouter](https://openrouter.ai), usando el router `openrouter/free` (modelos gratuitos seleccionados automáticamente; el usuario pega su propia API key)
- **Framework:** Next.js 16 + Vercel AI SDK (`streamText`, tool use)
- **Datos:** ya incluidos en el repositorio — no requiere configuración adicional

## Uso

1. Entra a la app (local o el deploy en Vercel)
2. Haz clic en el ⚙️ y pega tu API key de OpenRouter ([consíguela gratis aquí](https://openrouter.ai/keys))
3. **Deja el modelo en "Auto (recomendado)"**. El catálogo de modelos gratuitos de OpenRouter cambia constantemente (algunos dejan de ser gratis sin aviso); "Auto" elige en tiempo real entre los modelos gratuitos vigentes que soportan herramientas, en vez de depender de un modelo fijo que puede fallar.
4. Pregunta, por ejemplo:
   - *"¿Cuál es la brecha de matrícula femenina en carreras STEM?"*
   - *"¿Qué estudios hay sobre acoso y hostigamiento sexual en universidades?"*
   - *"¿Qué buenas prácticas existen para atraer mujeres a carreras STEM?"*

> **Nota:** las cuentas gratuitas de OpenRouter tienen un límite de 50 solicitudes/día (se resetea diariamente). Es más que suficiente para una evaluación normal; si se agota, el mensaje de error lo indica claramente en la interfaz.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy

Conectar el repositorio desde el dashboard de Vercel. No requiere variables de entorno: la
API key la pega cada usuario/a en la interfaz.

## Diseño y riesgos

Ver el documento de diseño adjunto a la entrega (problema, usuarios, datos, riesgos y
mitigaciones, y aprendizajes del curso que cambiaron el diseño original).

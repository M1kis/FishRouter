# 🐟 FishRouter

Puente (*Bridge / Proxy*) universal de Text-to-Speech (TTS) que convierte peticiones compatibles con **OpenAI (`/v1/audio/speech`)** y mods de **Minecraft (Verity Mod)** a la API de **Fish Audio**, con soporte nativo para el modelo 100% gratuito `s2.1-pro-free`.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FM1kis%2FFishRouter)

---

## ✨ Características

- 🎯 **Sin Servidores Locales**: Corre en Edge Functions de Vercel (arranca en milisegundos a nivel global).
- 💸 **100% Gratuito**: Diseñado para aprovechar la API gratuita `s2.1-pro-free` de Fish Audio.
- 👥 **Multi-usuario y Público**: Cada persona puede pasar su propia API Key y Voice ID por:
  - Header HTTP estándar (`Authorization: Bearer <key>`)
  - Parámetros de URL (`?voiceId=...&apiKey=...`)
  - Cuerpo de petición estándar OpenAI (`{ "voice": "...", "input": "..." }`)
- 🌐 **Web Interactiva**: Incluye probador de voz en vivo en el navegador y generador de configuración automática.
- 🎮 **Compatible con Minecraft**: Diseñado a medida para resolver los endpoints y rutas de `Verity Mod`.

---

## 🚀 Uso Rápido (Sin programar)

1. Entra a la web oficial de FishRouter: [**fish-router.vercel.app**](https://fish-router.vercel.app/)
2. Pega tu API Key de [Fish Audio](https://fish.audio/) y el Voice Reference ID de tu personaje.
3. Prueba la voz en vivo con el botón **Probar Voz**.
4. Copia el bloque de configuración generado y pégalo en tu cliente o juego.

---

## 🎮 Configuración en Minecraft (`verity-common.toml`)

En tu carpeta `.minecraft/config/verity-common.toml`, edita la sección `[GeneralSettings.VoiceSettings]`:

```toml
[GeneralSettings.VoiceSettings]
    useTTS = true
    ttsProvider = "KOKORO"
    ttsEndpoint = "https://fish-router.vercel.app/api/tts"
    ttsApiKey = "TU_FISH_API_KEY"
    ttsVoice = "TU_VOICE_REFERENCE_ID"
    ttsLanguage = "Spanish"
```

> **Alternativa por URL Todo-en-Uno:**
> Si tu mod no envía `ttsApiKey`, usa directamente en `ttsEndpoint`:
> `https://fish-router.vercel.app/api/tts?voiceId=TU_VOICE_ID&apiKey=TU_KEY`

---

## 🌐 Endpoints Compatibles

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/tts` | POST | Endpoint principal optimizado para Verity |
| `/api/tts/audio/speech` | POST | Endpoint de redirección para Verity KOKORO |
| `/audio/speech` | POST | Alias estándar Kokoro/OpenAI |
| `/v1/audio/speech` | POST | Endpoint estándar OpenAI (SillyTavern, OpenWebUI, Python, etc.) |

---

## 🛠️ Despliegue Propio en Vercel (Opcional)

Si deseas tener tu propia instancia privada de FishRouter:

1. Haz un fork de este repositorio.
2. Impórtalo en [Vercel](https://vercel.com).
3. *(Opcional)* Configura tus variables en **Settings > Environment Variables**:
   - `FISH_API_KEY`: Tu clave por defecto de Fish Audio.
   - `FISH_VOICE_ID`: Tu ID de voz por defecto.
   - `FISH_MODEL`: `s2.1-pro-free` (por defecto).

---

## 📄 Licencia

MIT License. ¡Libre para usar, modificar y compartir con la comunidad!

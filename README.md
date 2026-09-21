# FishRouter 🐟

Puente (Proxy/Bridge) de TTS entre **Fish Audio** (usando el modelo gratuito `s2.1-pro-free`) y el mod **Verity** de Minecraft.

## 🚀 Despliegue en Vercel

1. El repositorio está desplegado en Vercel.
2. Variables de entorno configuradas en Vercel (**Settings > Environment Variables**):
   - `FISH_API_KEY`: Tu clave de Fish Audio.
   - `FISH_VOICE_ID`: El Reference ID de tu voz en Fish Audio.
   - `FISH_MODEL` *(opcional)*: Por defecto usa `s2.1-pro-free`.
3. Tu endpoint de producción activo:
   ```
   https://fish-router.vercel.app/api/tts
   ```

---

## 🧪 Probar el endpoint

```powershell
'{"input":"Hola Verity"}' | curl.exe -s -X POST "https://fish-router.vercel.app/api/tts" -H "Content-Type: application/json" -d "@-" -o prueba.wav
```

---

## 🎮 Configuración en Minecraft (`verity-common.toml`)

En tu carpeta de Minecraft, edita `config/verity-common.toml`:

```toml
[GeneralSettings.VoiceSettings]
	#Use the text to speech at all
	useTTS = true
	#Provider to use for Text To Speech
	ttsProvider = "KOKORO"
	#URL de tu Edge Function en Vercel
	ttsEndpoint = "https://fish-router.vercel.app/api/tts"
	#Choose the voice Verity has (GROQ, Local)
	voice = "Daniel"
	#Your TTS API Key (Cartesia)
	ttsApiKey = ""
	#The language Verity speaks (Cartesia)
	ttsLanguage = "Spanish"
	#The voice the selected TTS Provider uses
	endpointVoice = "default"
	#Model for Kokoro
	kokoroModel = ""
```

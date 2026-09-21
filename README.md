# FishRouter 🐟

Puente (Proxy/Bridge) de TTS entre **Fish Audio** y el mod **Verity** de Minecraft.

## 🚀 Despliegue en Vercel

1. Sube este proyecto a tu repositorio de GitHub (o conéctalo directamente desde Vercel CLI / Web).
2. En tu proyecto de Vercel, dirígete a:
   **Settings > Environment Variables**
3. Añade las dos variables:
   - `FISH_API_KEY`: Tu API Key obtenida en [fish.audio](https://fish.audio) (sección API / Developers).
   - `FISH_VOICE_ID`: El Reference ID de tu voz (32 caracteres alfanuméricos).
4. Guarda y despliega. El endpoint quedará disponible en:
   ```
   https://tu-proyecto.vercel.app/api/tts
   ```

---

## 🧪 Prueba local o remota

### Local:
```bash
npm install
npm run dev
```

Prueba en terminal:
```bash
curl -X POST http://localhost:3000/api/tts -H "Content-Type: application/json" -d "{\"input\":\"Hola Verity\"}" --output prueba.wav
```

### Producción:
```bash
curl -X POST https://tu-proyecto.vercel.app/api/tts -H "Content-Type: application/json" -d "{\"input\":\"Hola Verity\"}" --output prueba.wav
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
	ttsEndpoint = "https://tu-proyecto.vercel.app/api/tts"
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

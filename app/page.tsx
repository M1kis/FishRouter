export default function HomePage() {
  return (
    <main style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h1>FishRouter Activo 🐟</h1>
      <p>Puente TTS entre Fish Audio y Verity Mod (Minecraft).</p>
      <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h3>Endpoint de audio:</h3>
        <code>POST /api/tts</code>
      </div>
    </main>
  );
}

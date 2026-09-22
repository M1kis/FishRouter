'use client';

import React, { useState } from 'react';

export default function HomePage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [voiceId, setVoiceId] = useState('7bf8c51e041348d2bc0032fcfc3dc162');
  const [model, setModel] = useState('s2.1-pro-free');
  const [sampleText, setSampleText] = useState('¡Hola! Soy tu asistente de Minecraft con voz realista de Fish Audio. ¿Listo para la aventura?');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Voces de muestra sugeridas
  const sampleVoices = [
    { label: 'Español Femenino (Verity)', id: '7bf8c51e041348d2bc0032fcfc3dc162' },
    { label: 'Voz Cálida y Clara', id: '161e05dcfd2f4d6d87e07ad76e033d83' },
    { label: 'Narrador Aventurero', id: '2c219665bc7f48b18cfb7512284c49ad' },
  ];

  const handleTestTTS = async () => {
    if (!apiKey.trim()) {
      setError('Por favor ingresa tu API Key de Fish Audio para realizar la prueba.');
      return;
    }
    if (!voiceId.trim()) {
      setError('Por favor ingresa un Voice Reference ID de Fish Audio.');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          input: sampleText,
          reference_id: voiceId.trim(),
          model: model,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Error HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con Fish Audio.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://fish-router.vercel.app';
  const effectiveKey = apiKey.trim() || 'TU_FISH_API_KEY_AQUI';
  const effectiveVoice = voiceId.trim() || 'TU_VOICE_ID_AQUI';

  const tomlConfig = `[GeneralSettings.VoiceSettings]
    ttsProvider = "KOKORO"
    ttsEndpoint = "${currentOrigin}/api/tts"
    ttsApiKey = "${effectiveKey}"
    ttsVoice = "${effectiveVoice}"
    ttsLanguage = "es"`;

  const allInOneUrl = `${currentOrigin}/api/tts?voiceId=${effectiveVoice}&apiKey=${effectiveKey}`;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.badge}>🐟 Open Source TTS Bridge</div>
        <h1 style={styles.title}>FishRouter</h1>
        <p style={styles.subtitle}>
          Conecta las voces ultrarrealistas de <strong>Fish Audio</strong> directamente con el mod{' '}
          <strong>Verity (Minecraft)</strong> o cualquier cliente compatible con OpenAI TTS.
        </p>
      </header>

      {/* GRID DE CONFIGURACIÓN & PROBADOR */}
      <div style={styles.grid}>
        {/* PANEL DE CONFIGURACIÓN */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>⚙️ 1. Tu Configuración de Voz</h2>
          <p style={styles.cardDescription}>
            Tus credenciales se procesan en memoria en tu navegador y en la solicitud segura. No almacenamos tus claves.
          </p>

          <div style={styles.field}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Fish Audio API Key</label>
              <a
                href="https://fish.audio/es/blog/s2-1-pro-free-api/"
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                ¿Cómo obtenerla gratis? ↗
              </a>
            </div>
            <div style={styles.inputWrapper}>
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="fk_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={styles.toggleBtn}
              >
                {showKey ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <div style={styles.field}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Voice Reference ID</label>
              <a
                href="https://fish.audio/discovery"
                target="_blank"
                rel="noreferrer"
                style={styles.link}
              >
                Explorar catálogo de voces ↗
              </a>
            </div>
            <input
              type="text"
              placeholder="Ej: 7bf8c51e041348d2bc0032fcfc3dc162"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              style={styles.input}
            />
            {/* Voces sugeridas */}
            <div style={styles.tagsContainer}>
              <span style={styles.tagLabel}>Sugerencias:</span>
              {sampleVoices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoiceId(v.id)}
                  style={voiceId === v.id ? styles.tagActive : styles.tag}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Modelo de Voz</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="model"
                  value="s2.1-pro-free"
                  checked={model === 's2.1-pro-free'}
                  onChange={(e) => setModel(e.target.value)}
                />
                <span>s2.1-pro-free (100% Gratis)</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="model"
                  value="s2.1"
                  checked={model === 's2.1'}
                  onChange={(e) => setModel(e.target.value)}
                />
                <span>s2.1 (Pro / Saldo)</span>
              </label>
            </div>
          </div>
        </div>

        {/* PROBADOR DE VOZ EN VIVO */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔊 2. Probar Voz en Vivo</h2>
          <p style={styles.cardDescription}>
            Escribe cualquier texto y escucha la voz sintetizada al instante antes de abrir Minecraft.
          </p>

          <div style={styles.field}>
            <label style={styles.label}>Texto a sintetizar</label>
            <textarea
              rows={3}
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <button
            onClick={handleTestTTS}
            disabled={loading}
            style={loading ? styles.btnDisabled : styles.btnPrimary}
          >
            {loading ? 'Generando audio...' : '▶ Probar Voz'}
          </button>

          {error && (
            <div style={styles.errorBox}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {audioUrl && (
            <div style={styles.audioBox}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#10b981' }}>
                ✓ Audio generado exitosamente:
              </p>
              <audio controls autoPlay src={audioUrl} style={{ width: '100%' }} />
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DE INTEGRACIÓN MINECRAFT (VERITY) */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🎮 3. Configuración para Minecraft (Verity Mod)</h2>
        <p style={styles.sectionText}>
          Abre el archivo <code>verity-common.toml</code> ubicado en{' '}
          <code>.minecraft/config/verity-common.toml</code> y reemplaza la sección{' '}
          <code>[GeneralSettings.VoiceSettings]</code> con lo siguiente:
        </p>

        <div style={styles.codeBlock}>
          <div style={styles.codeHeader}>
            <span style={styles.codeTitle}>verity-common.toml</span>
            <button
              onClick={() => copyToClipboard(tomlConfig, 'toml')}
              style={styles.copyBtn}
            >
              {copiedType === 'toml' ? '¡Copiado! ✓' : 'Copiar Configuración'}
            </button>
          </div>
          <pre style={styles.pre}>{tomlConfig}</pre>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
            Alternativa: Endpoint Todo-en-Uno (por URL)
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
            Si tu cliente o mod no soporta <code>ttsApiKey</code>, puedes colocar directamente esta URL completa en <code>ttsEndpoint</code>:
          </p>
          <div style={styles.codeBlock}>
            <div style={styles.codeHeader}>
              <span style={styles.codeTitle}>URL Todo-en-Uno</span>
              <button
                onClick={() => copyToClipboard(allInOneUrl, 'url')}
                style={styles.copyBtn}
              >
                {copiedType === 'url' ? '¡Copiado! ✓' : 'Copiar URL'}
              </button>
            </div>
            <pre style={{ ...styles.pre, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{allInOneUrl}</pre>
          </div>
        </div>
      </section>

      {/* COMPATIBILIDAD CON OTRAS APPS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🌐 Compatible con Clientes OpenAI</h2>
        <p style={styles.sectionText}>
          FishRouter emula la API estándar de <code>/v1/audio/speech</code>. Puedes usarlo en SillyTavern, OpenWebUI, LibreChat, scripts de Python o bots de Discord configurando:
        </p>
        <ul style={styles.list}>
          <li><strong>Base URL:</strong> <code>{currentOrigin}/v1</code> o <code>{currentOrigin}/api/tts</code></li>
          <li><strong>API Key:</strong> Tu Fish Audio API Key</li>
          <li><strong>Voice:</strong> Tu Voice Reference ID</li>
          <li><strong>Model:</strong> <code>s2.1-pro-free</code></li>
        </ul>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>
          Desarrollado con ❤️ para la comunidad de Minecraft y entusiastas de IA. Compatible con{' '}
          <a href="https://fish.audio" target="_blank" rel="noreferrer" style={styles.link}>
            Fish Audio
          </a>{' '}
          y{' '}
          <a href="https://curseforge.com/minecraft/mc-mods/verity" target="_blank" rel="noreferrer" style={styles.link}>
            Verity Mod
          </a>.
        </p>
      </footer>
    </div>
  );
}

// ESTILOS MODERNOS OSCUROS
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    color: '#f8fafc',
    lineHeight: '1.6',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    background: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '1rem',
    border: '1px solid rgba(56, 189, 248, 0.3)',
  },
  title: {
    fontSize: '2.75rem',
    fontWeight: 800,
    margin: '0 0 0.75rem 0',
    letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.15rem',
    color: '#94a3b8',
    maxWidth: '680px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  card: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '1.75rem',
    border: '1px solid #334155',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
    color: '#f1f5f9',
  },
  cardDescription: {
    fontSize: '0.88rem',
    color: '#94a3b8',
    margin: '0 0 1.25rem 0',
  },
  field: {
    marginBottom: '1.25rem',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.4rem',
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#e2e8f0',
  },
  link: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontSize: '0.82rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: '8px',
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    borderRadius: '8px',
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f8fafc',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    position: 'absolute',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    fontSize: '0.8rem',
    padding: '0.3rem 0.6rem',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  tagLabel: {
    fontSize: '0.78rem',
    color: '#64748b',
  },
  tag: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: '#94a3b8',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  tagActive: {
    background: 'rgba(56, 189, 248, 0.15)',
    border: '1px solid #38bdf8',
    borderRadius: '6px',
    color: '#38bdf8',
    padding: '0.2rem 0.5rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  radioGroup: {
    display: 'flex',
    gap: '1.25rem',
    marginTop: '0.4rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    color: '#cbd5e1',
    cursor: 'pointer',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    marginTop: 'auto',
  },
  btnDisabled: {
    background: '#475569',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.25rem',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'not-allowed',
    marginTop: 'auto',
  },
  errorBox: {
    marginTop: '1rem',
    padding: '0.75rem',
    borderRadius: '8px',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    fontSize: '0.85rem',
  },
  audioBox: {
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    background: '#0f172a',
    border: '1px solid #334155',
  },
  section: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid #334155',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
    color: '#f8fafc',
  },
  sectionText: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    margin: '0 0 1rem 0',
  },
  codeBlock: {
    background: '#0f172a',
    borderRadius: '10px',
    border: '1px solid #334155',
    overflow: 'hidden',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 1rem',
    background: 'rgba(51, 65, 85, 0.4)',
    borderBottom: '1px solid #334155',
  },
  codeTitle: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  copyBtn: {
    background: '#334155',
    border: 'none',
    color: '#f8fafc',
    borderRadius: '6px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.78rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  pre: {
    margin: 0,
    padding: '1rem',
    fontFamily: 'monospace',
    fontSize: '0.88rem',
    color: '#38bdf8',
    overflowX: 'auto',
  },
  list: {
    margin: '0.5rem 0 0 1.25rem',
    padding: 0,
    color: '#cbd5e1',
    fontSize: '0.92rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#64748b',
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #334155',
  },
};

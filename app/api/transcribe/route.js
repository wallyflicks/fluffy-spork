export async function POST(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!audio) {
      return Response.json({ error: 'No audio provided' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return Response.json({ error: 'Transcription service unavailable' }, { status: 503 });
    }

    // Determine file extension from the blob's content type so Whisper can parse the format
    const contentType = audio.type || 'audio/mp4';
    const ext = contentType.includes('mp4') ? 'mp4'
      : contentType.includes('ogg') ? 'ogg'
      : contentType.includes('webm') ? 'webm'
      : 'mp4';

    const filename = `recording.${ext}`;
    console.log(`[transcribe] Sending to Whisper: ${filename} (${audio.size} bytes, type: ${contentType})`);

    const fd = new FormData();
    fd.append('file', new Blob([await audio.arrayBuffer()], { type: contentType }), filename);
    fd.append('model', 'whisper-1');
    fd.append('language', 'en');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}` },
      body: fd,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[transcribe] Whisper error:', errText);
      return Response.json({ error: 'Transcription failed' }, { status: 500 });
    }

    const data = await res.json();
    return Response.json({ transcript: data.text || '' });
  } catch (err) {
    console.error('[transcribe] error:', err);
    return Response.json({ error: err.message || 'Transcription failed' }, { status: 500 });
  }
}

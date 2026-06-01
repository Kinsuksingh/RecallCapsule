const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const generateVoice = async (text, voiceId) => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is missing. Check your .env file.');
  }
  
  if (!voiceId) {
    throw new Error('Voice ID is missing for this persona.');
  }

  const API_URL = `/api/elevenlabs/v1/text-to-speech/${voiceId}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Good for Hinglish / Indian accents
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs API Error: ${response.status} - ${errorData.detail?.message || response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error('Error generating voice:', error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob) => {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key is missing. Check your .env file.');
  }

  const API_URL = '/api/elevenlabs/v1/speech-to-text';
  
  const formData = new FormData();
  // Name the blob as an audio file so the API accepts it
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model_id', 'scribe_v1'); // ElevenLabs STT model

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        // Do NOT set Content-Type header manually when sending FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs STT API Error: ${response.status} - ${errorData.detail?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

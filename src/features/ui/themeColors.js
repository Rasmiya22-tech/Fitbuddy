export function getTheme(dark) {
  if (dark) {
    // Softer, slightly transparent dark theme tokens to reduce eye strain
    return {
      background: 'rgba(15,23,36,0.95)',
      card: 'rgba(17,24,39,0.88)',
      text: '#d6e1ea',
      muted: '#8f9aa6',
      primary: 'rgba(247,115,22,0.85)',
      border: 'rgba(31,41,55,0.6)',
      inputBg: 'rgba(11,18,32,0.72)',
      dangerBg: 'rgba(59,15,15,0.48)',
      surface: 'rgba(11,18,32,0.72)',
      placeholder: '#6f7d8a'
    };
  }

  return {
    background: '#f8f8f8',
    card: '#ffffff',
    text: '#111827',
    muted: '#666666',
    primary: '#944545',
    border: '#e6e6e6',
    inputBg: '#ffffff',
    dangerBg: '#ffecec',
    surface: '#ffffff',
    placeholder: '#aaa'
  };
}

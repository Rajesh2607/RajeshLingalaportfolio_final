export default function logError(context, error) {
  try {
    console.error(context, error);
  } catch (e) {
    // ignore
  }

  const message = (error && (error.message || String(error))) || 'Unknown error';
  try {
    // Keep user-facing alert but include the underlying message for debugging
    alert(`${context}: ${message}`);
  } catch (e) {
    // If alert is blocked, still surface via console
    console.error('logError alert failed', e);
  }
}

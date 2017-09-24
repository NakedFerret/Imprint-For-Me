module.exports = function(inputMessage) {
  const parts = inputMessage.split('\n');

  if (parts.length < 4) {
    return { success: false };
  }

  const signature = parts.pop();
  const publicKey = parts.pop();
  const timestamp = parts.pop();
  const message = parts.join('\n');

  return {
    success: true,
    message,
    timestamp,
    publicKey,
    signature
  };
}

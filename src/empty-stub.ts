export default {};

declare global {
  interface Window {
    ViteWS?: typeof WebSocket;
  }
}

export const WebSocket =
  typeof window !== 'undefined' ? window.ViteWS || window.WebSocket : undefined;

export default {};
export const WebSocket = typeof window !== 'undefined' ? window.ViteWS || window.WebSocket : undefined;

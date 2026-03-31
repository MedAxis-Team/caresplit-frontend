import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function bootstrap() {
  // Start MSW in development — must be ready before app renders
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

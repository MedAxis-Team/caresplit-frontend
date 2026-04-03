import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

async function bootstrap() {
  // Start MSW — mock backend for both dev and production (no real backend yet)
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();

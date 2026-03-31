import { worker } from './browser';

if (import.meta.env.DEV) {
  worker.start();
}

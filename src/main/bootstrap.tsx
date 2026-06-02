import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/presentation/App';
import { createAppControllers } from '@/main/composition';
import '@/presentation/styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const controllers = createAppControllers();

createRoot(rootElement).render(
  <StrictMode>
    <App controllers={controllers} />
  </StrictMode>,
);

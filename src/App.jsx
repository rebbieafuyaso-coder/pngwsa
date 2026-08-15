import AppRoutes from './routes/AppRoutes';
import { HelmetProvider } from 'react-helmet-async';
export default function App() {
  return(
    <HelmetProvider>
      <AppRoutes />
    </HelmetProvider>
  )
}
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AppRouter } from './app/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

/**
 * Custom MUI theme overrides.
 *
 * - `primary.main` → Trigger brand orange (#ec5b13), used on accent buttons.
 * - `secondary.main` → Dark (#221610), for secondary UI elements.
 * - `typography.fontFamily` → "Public Sans" with "Inter" fallback.
 * - Button defaults: rounded corners (8px), no uppercase text.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#ec5b13',
    },
    secondary: {
      main: '#221610',
    },
  },
  typography: {
    fontFamily: '"Public Sans", "Inter", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

import { Toaster } from 'react-hot-toast';
import { GlobalErrorBoundary } from './components/feedback/GlobalErrorBoundary';

/**
 * Root application component.
 *
 * **Provider wrapping order (outermost → innermost):**
 * 1. `GlobalErrorBoundary` — catches React rendering errors.
 * 2. `Provider` (Redux) — makes the store available to all children.
 * 3. `ThemeProvider` (MUI) — injects the custom theme.
 * 4. `CssBaseline` — resets browser default styles for MUI.
 * 5. `Toaster` — renders react-hot-toast popups (top-right).
 * 6. `AppRouter` — handles routing and renders the correct page.
 */
const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-right" />
          <AppRouter />
        </ThemeProvider>
      </Provider>
    </GlobalErrorBoundary>
  );
};

export default App;

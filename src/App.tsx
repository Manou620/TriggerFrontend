import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AppRouter } from './app/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

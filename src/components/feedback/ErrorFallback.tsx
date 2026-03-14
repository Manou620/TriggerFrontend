import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  type?: '404' | '500' | 'generic';
  error?: any;
  resetErrorBoundary?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ type = 'generic', error, resetErrorBoundary }) => {
  const is404 = type === '404' || error?.status === 404;
  const is500 = type === '500' || error?.status === 500;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
        {is404 ? 'Page non trouvée' : is500 ? 'Erreur serveur' : 'Oups ! Quelque chose s\'est mal passé'}
      </h1>
      
      <p className="text-slate-500 max-w-md mb-8">
        {is404 
          ? "La page que vous recherchez n'existe pas ou a été déplacée." 
          : "Nous rencontrons des difficultés techniques. Veuillez réessayer plus tard."}
      </p>

      <div className="flex gap-4">
        {resetErrorBoundary && (
          <button 
            onClick={resetErrorBoundary}
            className="flex items-center gap-2 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Réessayer
          </button>
        )}
        <Link 
          to="/"
          className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      {error && process.env.NODE_ENV !== 'production' && (
        <div className="mt-12 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left w-full max-w-2xl overflow-auto">
          <p className="text-xs font-mono text-slate-500 uppercase mb-2">Détails de l'erreur :</p>
          <pre className="text-xs font-mono text-red-500">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

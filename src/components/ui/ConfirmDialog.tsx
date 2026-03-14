import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger'
}) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onCancel}
      PaperProps={{
        className: "rounded-2xl dark:bg-slate-900 dark:text-white max-w-md w-full"
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            type === 'danger' ? 'bg-red-100 text-red-600' : 
            type === 'warning' ? 'bg-amber-100 text-amber-600' : 
            'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <DialogTitle className="p-0 text-xl font-bold mb-2">{title}</DialogTitle>
        <DialogContent className="p-0">
          <p className="text-slate-500 dark:text-slate-400">{message}</p>
        </DialogContent>
        
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            className="flex-1"
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

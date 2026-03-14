import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

/**
 * Props for the ConfirmDialog component.
 */
interface ConfirmDialogProps {
  /** Controls whether the dialog is visible. */
  isOpen: boolean;
  /** Dialog heading (e.g. "Supprimer le client"). */
  title: string;
  /** Explanatory text shown in the dialog body. */
  message: string;
  /** Called when the user clicks the confirm (destructive) button. */
  onConfirm: () => void;
  /** Called when the user clicks cancel or the X button. */
  onCancel: () => void;
  /** Shows a loading spinner on the confirm button (while the API call runs). */
  isLoading?: boolean;
  /** Label for the confirm button (default: "Confirmer"). */
  confirmText?: string;
  /** Label for the cancel button (default: "Annuler"). */
  cancelText?: string;
  /** Visual style: `danger` (red), `warning` (amber), or `info` (blue). */
  type?: 'danger' | 'warning' | 'info';
}

/**
 * A modal confirmation dialog used before destructive actions like delete.
 *
 * **Usage pattern in pages:**
 * 1. User clicks a delete button → page sets `confirmDelete.isOpen = true`.
 * 2. `ConfirmDialog` renders with the message.
 * 3. User clicks "Supprimer" → `onConfirm` fires the actual delete API call.
 * 4. User clicks "Annuler" → `onCancel` closes the dialog without side effects.
 *
 * Built on top of MUI's `<Dialog>` for accessibility (focus trap, ESC to close).
 */
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
      {/* Dialog body — padded container inside the MUI Dialog */}
      <div className="p-6">
        {/* Top row — colored warning icon (left) + close X button (right) */}
        <div className="flex items-center justify-between mb-4">
          {/* Warning icon — colored based on type: red/amber/blue */}
          <div className={`p-3 rounded-xl ${
            type === 'danger' ? 'bg-red-100 text-red-600' : 
            type === 'warning' ? 'bg-amber-100 text-amber-600' : 
            'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          {/* Close button — top-right corner */}
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Dialog title */}
        <DialogTitle className="p-0 text-xl font-bold mb-2">{title}</DialogTitle>
        {/* Dialog message — descriptive text */}
        <DialogContent className="p-0">
          <p className="text-slate-500 dark:text-slate-400">{message}</p>
        </DialogContent>
        
        {/* Action buttons — Cancel (left) + Confirm (right) */}
        <div className="mt-8 flex gap-3">
          {/* Cancel button — outline style */}
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          {/* Confirm/Delete button — red for danger type */}
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

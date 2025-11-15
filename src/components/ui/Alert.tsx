'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title: string;
  message?: string;
  onClose?: () => void;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Alert({ type, title, message, onClose, closable = true, action }: AlertProps) {
  const getStyles = () => {
    const styles = {
      success:
        'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
      error:
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
      warning:
        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    };
    return styles[type];
  };

  const getIcon = () => {
    const icons = {
      success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
      error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
      warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
      info: <Info className="w-5 h-5 flex-shrink-0" />,
    };
    return icons[type];
  };

  return (
    <div className={`rounded-lg border p-4 flex items-start gap-3 ${getStyles()}`}>
      {getIcon()}
      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-semibold mt-3 hover:opacity-80 transition-opacity"
          >
            {action.label}
          </button>
        )}
      </div>
      {closable && (
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

interface ToastProps extends AlertProps {
  autoClose?: number;
}

export function Toast({
  type,
  title,
  message,
  onClose,
  closable = true,
  action,
  autoClose = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  // Auto close timer
  if (autoClose) {
    setTimeout(() => handleClose(), autoClose);
  }

  return (
    <Alert
      type={type}
      title={title}
      message={message}
      onClose={handleClose}
      closable={closable}
      action={action}
    />
  );
}

interface AlertGroupProps {
  alerts: AlertProps[];
  onClose: (index: number) => void;
}

export function AlertGroup({ alerts, onClose }: AlertGroupProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert, idx) => (
        <Alert key={idx} {...alert} onClose={() => onClose(idx)} />
      ))}
    </div>
  );
}

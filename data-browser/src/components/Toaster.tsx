import React from 'react';
import toast, { ToastBar, Toaster as ReactHotToast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import { Button } from './Button';

/**
 * Makes themed toast notifications available in the Context. Render this
 * somewhere high up in the app
 */
export function Toaster() {
  const theme = useTheme();
  return (
    <ReactHotToast
      position='bottom-right'
      toastOptions={{
        style: {
          background: theme.colors.bg,
          color: theme.colors.text,
        },
      }}
    >
      {t => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <Button
                  icon
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                  }}
                  onClick={() => toast.dismiss(t.id)}
                >
                  <FaTimes />
                </Button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </ReactHotToast>
  );
}

import React from 'react';
import toast, { ToastBar, Toaster as ReactHotToast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import { zIndex } from '../styling';
import { Button } from './Button';

/**
 * Makes themed toast notifications available in the Context. Render this
 * somewhere high up in the app
 */
export function Toaster(): JSX.Element {
  const theme = useTheme();

  return (
    <ReactHotToast
      position='bottom-right'
      toastOptions={{
        style: {
          zIndex: zIndex.toast,
          background: theme.colors.bg,
          color: theme.colors.text,
          wordBreak: 'break-word',
        },
      }}
    >
      {t => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            border: `solid 1px ${theme.colors.bg2}`,
            position: 'relative',
            animation: t.visible
              ? 'toast-enter .5s ease'
              : 'toast-exit 1s ease',
          }}
        >
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <Button
                  title='Clear'
                  subtle
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

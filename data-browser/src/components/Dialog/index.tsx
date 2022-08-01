import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaTimes } from 'react-icons/fa';
import styled, { keyframes } from 'styled-components';
import { effectTimeout } from '../../helpers/effectTimeout';
import { Button } from '../Button';
import { Slot } from '../Slot';
import { DialogPortalContext, DialogTreeContext } from './dialogContext';
import { useDialog } from './useDialog';

export interface InternalDialogProps {
  show: boolean;
  onClose: () => void;
  onClosed: () => void;
}

export type WrappedDialogType = React.FC<React.PropsWithChildren<unknown>>;

export enum DialogSlot {
  Title = 'title',
  Content = 'content',
  Actions = 'actions',
}

const ANIM_MS = 200;
const ANIM_SPEED = `${ANIM_MS}ms`;

type DialogSlotComponent = React.FC<React.PropsWithChildren<unknown>>;

/**
 * Component to build a dialog. The content of this component are rendered in a
 * portal outside of the main tree. The children are rendered in slots. You can
 * use the following components or provide your own by using the {@link Slot}
 * component: `<Slot slot="title">` or {@link DialogTitle}, `<Slot
 * slot="content">` or {@link DialogContent}, `<Slot slot="actions">` or
 * {@link DialogActions}
 *
 * Example:
 *
 * ```jsx
 * const { props, show, close } = useDialog();
 * return (
 * <button onClick={show}>Open</button>
 * <Dialog {...props}>
 *    <DialogTitle>Title</DialogTitle>
 *    ...
 *  </Dialog>
 *  );
 * ```
 */
export const Dialog: React.FC<React.PropsWithChildren<InternalDialogProps>> = ({
  children,
  show,
  onClose,
  onClosed,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerDialogRef = useRef<HTMLDivElement>(null);
  const portalRef = useContext(DialogPortalContext);

  const handleOutSideClick = useCallback<
    React.MouseEventHandler<HTMLDialogElement>
  >(
    e => {
      if (
        !innerDialogRef.current.contains(e.target as HTMLElement) &&
        innerDialogRef.current !== e.target
      ) {
        onClose();
      }
    },
    [innerDialogRef.current],
  );

  // Close the dialog when the escape key is pressed
  useHotkeys(
    'esc',
    () => {
      onClose();
    },
    { enabled: show },
  );

  // When closing the `data-closing` attribute must be set before rendering so the animation has started when the regular useEffect is called.
  useLayoutEffect(() => {
    if (!show && dialogRef.current && dialogRef.current.hasAttribute('open')) {
      dialogRef.current.setAttribute('data-closing', 'true');
    }
  }, [show]);

  useEffect(() => {
    if (!dialogRef.current) {
      return;
    }

    if (show) {
      if (!dialogRef.current.hasAttribute('open'))
        // @ts-ignore
        dialogRef.current.showModal();
    }

    if (dialogRef.current.hasAttribute('data-closing')) {
      // TODO: Use getAnimations() api to wait for the animations to complete instead of a timeout.
      return effectTimeout(() => {
        // @ts-ignore
        dialogRef.current.close();
        dialogRef.current.removeAttribute('data-closing');
        onClosed();
      }, ANIM_MS);
    }
  }, [show]);

  if (!portalRef.current) {
    return null;
  }

  return createPortal(
    <StyledDialog ref={dialogRef} onClick={handleOutSideClick}>
      <DialogTreeContext.Provider value={true}>
        <StyledInnerDialog ref={innerDialogRef}>
          <CloseButtonSlot slot='close'>
            <Button icon onClick={onClose} aria-label='close'>
              <FaTimes />
            </Button>
          </CloseButtonSlot>
          {children}
        </StyledInnerDialog>
      </DialogTreeContext.Provider>
    </StyledDialog>,
    portalRef.current,
  );
};

export const DialogTitle: DialogSlotComponent = ({ children }) => (
  <Slot slot={DialogSlot.Title} as='header'>
    {children}
  </Slot>
);

export const DialogContent: DialogSlotComponent = ({ children }) => (
  <DialogContentSlot slot={DialogSlot.Content} as='main'>
    {children}
  </DialogContentSlot>
);

export const DialogActions: DialogSlotComponent = ({ children }) => (
  <DialogActionsSlot slot={DialogSlot.Actions} as='footer'>
    {children}
  </DialogActionsSlot>
);

const CloseButtonSlot = styled(Slot)`
  justify-self: end;
`;

const DialogContentSlot = styled(Slot)`
  overflow: auto;
  max-height: 80vh;
  padding-bottom: ${({ theme }) => theme.margin}rem;
  // Position the scrollbar against the side of the dialog without any spacing inbetween.
  margin-right: -${p => p.theme.margin}rem;
  padding-right: ${p => p.theme.margin}rem;
`;

const DialogActionsSlot = styled(Slot)`
  display: flex;
  gap: ${p => p.theme.margin}rem;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid ${props => props.theme.colors.bg2};
  padding-top: 1rem;
`;

const StyledInnerDialog = styled.div`
  display: grid;
  grid-template-columns: auto 2rem;
  grid-template-rows: 1fr auto 1fr;
  grid-template-areas: 'title close' 'content content' 'actions actions';
  max-height: 100%;
`;

const fadeInForground = keyframes`
  from {
    opacity: 0;
    transform: translateY(5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInBackground = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
  }
  to {
    background-color: rgba(0, 0, 0, 0.383);
    backdrop-filter: blur(5px);
  }
`;

const StyledDialog = styled.dialog`
  --animation-speed: 500ms;
  box-sizing: border-box;
  inset: 0px;
  z-index: 10000;
  padding: ${props => props.theme.margin}rem;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.radius};
  border: solid 1px ${props => props.theme.colors.bg2};
  max-inline-size: min(90vw, 75ch);
  max-block-size: 100vh;

  overflow: hidden;
  box-shadow: 0px 1.5px 2.2px rgba(0, 0, 0, 0.02),
    0px 3.5px 5.3px rgba(0, 0, 0, 0.028), 0px 6.6px 10px rgba(0, 0, 0, 0.035),
    0px 11.8px 17.9px rgba(0, 0, 0, 0.042),
    0px 22.1px 33.4px rgba(0, 0, 0, 0.05), 0px 53px 80px rgba(0, 0, 0, 0.07);

  // Animation props
  opacity: 0;
  transform: translateY(5rem);
  // Use a transition when animating out (for some reason keyframe animations don't work on outgoing dialog).
  transition: opacity ${ANIM_SPEED} ease-in-out,
    transform ${ANIM_SPEED} ease-in-out;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    transition: background-color ${ANIM_SPEED} ease-out,
      backdrop-filter ${ANIM_SPEED} ease-out;
    // Make sure the browser paints the backdrop on another layer so the animation is less expensive.
    will-change: background-color, backdrop-filter;
  }

  &[open] {
    opacity: 1;
    transform: translateY(0);
    // Use a keyframe animation when animating in (transitions don't work on incomming dialog for some reason).
    animation: ${fadeInForground} ${ANIM_SPEED} ease-in-out;
  }

  &[data-closing='true'] {
    opacity: 0;
    transform: translateY(5rem);
  }

  &[open]::backdrop {
    background-color: rgba(0, 0, 0, 0.383);
    backdrop-filter: blur(5px);
    animation: ${fadeInBackground} ${ANIM_SPEED} ease-out;
  }

  &[data-closing='true']::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
  }

  @media (max-width: ${props => props.theme.containerWidth}rem) {
    max-inline-size: 100%;
    max-block-size: 100vh;
  }
`;

export { useDialog };

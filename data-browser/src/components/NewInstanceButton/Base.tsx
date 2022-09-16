import { useStore } from '@tomic/react';
import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { paths } from '../../routes/paths';
import { Button } from '../Button';

export interface InstanceButtonBaseProps {
  onClick: () => void;
  subtle?: boolean;
  title: string;
  icon?: boolean;
  label?: string;
  className?: string;
}

export function Base({
  children,
  subtle,
  title,
  icon,
  onClick,
  label,
  className,
}: React.PropsWithChildren<InstanceButtonBaseProps>): JSX.Element {
  const store = useStore();
  const agent = store.getAgent();

  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (!agent) {
      toast.error('You need to be logged in to create new things');
      navigate(paths.agentSettings);

      return;
    }

    onClick();
  }, [agent, navigate]);

  return (
    <Button
      onClick={handleClick}
      subtle={subtle}
      title={agent ? `Create a new ${title}` : 'No User set - sign in first'}
      className={className}
    >
      {icon ? (
        <IconWrapper>
          <FaPlus />
          {label}
        </IconWrapper>
      ) : (
        label ?? title
      )}
      {children}
    </Button>
  );
}

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

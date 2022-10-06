import styled from 'styled-components';
import { AtomicLink } from '../AtomicLink';
import { Logo } from '../Logo';
import { SideBarHeader } from './SideBarHeader';
import React from 'react';
import { FaGithub, FaDiscord, FaBook } from 'react-icons/fa';

interface AboutItem {
  icon: React.ReactNode;
  helper: string;
  href: string;
}

const aboutMenuItems: AboutItem[] = [
  {
    icon: <FaGithub />,
    helper: 'Github; View the source code for this application',
    href: 'https://github.com/atomicdata-dev/atomic-data-browser',
  },
  {
    icon: <FaDiscord />,
    helper: 'Discord; Chat with the Atomic Data community',
    href: 'https://discord.gg/a72Rv2P',
  },
  {
    icon: <FaBook />,
    helper: 'Docs; Read the Atomic Data documentation',
    href: 'https://docs.atomicdata.dev',
  },
];

export function About() {
  return (
    <>
      <SideBarHeader>
        <Logo style={{ height: '1.1rem', maxWidth: '100%' }} />
      </SideBarHeader>
      <AboutWrapper>
        {aboutMenuItems.map(p => (
          <AboutIcon key={p.helper} {...p} />
        ))}
      </AboutWrapper>
    </>
  );
}

const AboutWrapper = styled.div`
  --inner-padding: 0.5rem;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  gap: 0.5rem;
  margin-left: calc(1rem - var(--inner-padding));
`;

interface AboutIconProps {
  href?: string;
  icon: React.ReactNode;
  helper: string;
}

function AboutIcon({ icon, helper, href }: AboutIconProps) {
  return (
    <StyledAtomicLink href={href} clean title={helper}>
      {icon}
    </StyledAtomicLink>
  );
}

const StyledAtomicLink = styled(AtomicLink)`
  padding: 0.5rem;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  border-radius: ${p => p.theme.radius};
  color: ${p => p.theme.colors.textLight};
  font-size: 1.6rem;
  transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out;
  &:hover,
  &:focus {
    background: ${p => p.theme.colors.bg1};
    color: ${p => p.theme.colors.text};
  }
`;

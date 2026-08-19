import type { ReactNode } from 'react';
import './breadcrumbs.css';

export interface AgentDuelBreadcrumbItem {
  href?: string;
  label: string;
}

export interface AgentDuelBreadcrumbLinkProps {
  children: ReactNode;
  href: string;
}

export type AgentDuelBreadcrumbLinkComponent = (
  props: AgentDuelBreadcrumbLinkProps
) => ReactNode;

export interface AgentDuelBreadcrumbsProps {
  ariaLabel: string;
  className?: string;
  items: readonly AgentDuelBreadcrumbItem[];
  linkComponent?: AgentDuelBreadcrumbLinkComponent;
}

function DefaultLink({ children, href }: AgentDuelBreadcrumbLinkProps) {
  return <a href={href}>{children}</a>;
}

export function AgentDuelBreadcrumbs({
  ariaLabel,
  className,
  items,
  linkComponent: Link = DefaultLink
}: AgentDuelBreadcrumbsProps) {
  return (
    <nav
      className={['duel-breadcrumbs', className ?? ''].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !current
                ? <Link href={item.href}>{item.label}</Link>
                : <span aria-current={current ? 'page' : undefined}>{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export const Breadcrumbs = AgentDuelBreadcrumbs;
export type BreadcrumbItem = AgentDuelBreadcrumbItem;
export type BreadcrumbLinkComponent = AgentDuelBreadcrumbLinkComponent;
export type BreadcrumbLinkProps = AgentDuelBreadcrumbLinkProps;
export type BreadcrumbsProps = AgentDuelBreadcrumbsProps;

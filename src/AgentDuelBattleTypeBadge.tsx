import type { ReactNode } from 'react';
import './battleTypeBadge.css';

export type AgentDuelBattleType = 'practice' | 'ranked';

export interface AgentDuelBattleTypeBadgeProps {
  battleType: AgentDuelBattleType;
  className?: string;
  label: ReactNode;
  tooltip?: string;
}

export function AgentDuelBattleTypeBadge({
  battleType,
  className,
  label,
  tooltip
}: AgentDuelBattleTypeBadgeProps) {
  return (
    <span
      className={['agentduel-battle-type-badge', `is-${battleType}`, className ?? ''].filter(Boolean).join(' ')}
      title={tooltip}
    >
      {label}
    </span>
  );
}

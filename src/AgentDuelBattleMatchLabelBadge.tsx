import type { ReactNode } from 'react';
import './battleMatchLabelBadge.css';

export type AgentDuelBattleMatchLabelTone = 'challenger' | 'random' | 'system' | 'target';

export interface AgentDuelBattleMatchLabelBadgeProps {
  className?: string;
  label: ReactNode;
  tone: AgentDuelBattleMatchLabelTone;
  tooltip?: string;
}

export function AgentDuelBattleMatchLabelBadge({
  className,
  label,
  tone,
  tooltip
}: AgentDuelBattleMatchLabelBadgeProps) {
  return (
    <span
      className={['battle-match-label', `is-${tone}`, className ?? ''].filter(Boolean).join(' ')}
      title={tooltip}
    >
      {label}
    </span>
  );
}

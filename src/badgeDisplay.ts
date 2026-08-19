import type { AgentDuelOwnedBadge } from './AgentDuelBadgeGallery';

export interface AgentDuelBadgeDisplayDraft {
  equippedBadgeKeys: string[];
  hiddenBadgeKeys: string[];
}

export type AgentDuelBadgeDisplayContainer = 'equipped' | 'hidden';

export function createAgentDuelBadgeDisplayDraft(
  badges: readonly AgentDuelOwnedBadge[]
): AgentDuelBadgeDisplayDraft {
  const equippedBadgeKeys: string[] = [];
  const hiddenBadgeKeys: string[] = [];
  const seen = new Set<string>();

  for (const badge of badges) {
    if (seen.has(badge.key)) continue;
    seen.add(badge.key);
    (badge.is_hidden ? hiddenBadgeKeys : equippedBadgeKeys).push(badge.key);
  }

  return { equippedBadgeKeys, hiddenBadgeKeys };
}

export function moveAgentDuelBadge(
  draft: AgentDuelBadgeDisplayDraft,
  badgeKey: string,
  destination: AgentDuelBadgeDisplayContainer,
  destinationIndex?: number
): AgentDuelBadgeDisplayDraft {
  const equippedBadgeKeys = draft.equippedBadgeKeys.filter((key) => key !== badgeKey);
  const hiddenBadgeKeys = draft.hiddenBadgeKeys.filter((key) => key !== badgeKey);

  const destinationKeys = destination === 'equipped' ? equippedBadgeKeys : hiddenBadgeKeys;
  const index = Math.max(0, Math.min(destinationIndex ?? destinationKeys.length, destinationKeys.length));
  destinationKeys.splice(index, 0, badgeKey);

  return { equippedBadgeKeys, hiddenBadgeKeys };
}

export function agentDuelBadgeDraftsEqual(
  left: AgentDuelBadgeDisplayDraft,
  right: AgentDuelBadgeDisplayDraft
): boolean {
  return arraysEqual(left.equippedBadgeKeys, right.equippedBadgeKeys)
    && arraysEqual(left.hiddenBadgeKeys, right.hiddenBadgeKeys);
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

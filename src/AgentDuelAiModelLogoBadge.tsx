import './aiModelLogoBadge.css';
import {
  getAgentDuelAiModelLogo,
  getAgentDuelAiModelLogoAssetUrl
} from './aiModelLogos';

export interface AgentDuelAiModelLogoBadgeProps {
  aiModel: string | null;
  className?: string;
  fallbackLabel: string;
  hideWhenLogoMissing?: boolean;
}

export function AgentDuelAiModelLogoBadge({
  aiModel,
  className,
  fallbackLabel,
  hideWhenLogoMissing = false
}: AgentDuelAiModelLogoBadgeProps) {
  const displayLabel = typeof aiModel === 'string' && aiModel.trim().length > 0
    ? aiModel.trim()
    : fallbackLabel;
  const logo = getAgentDuelAiModelLogo(aiModel);

  if ((hideWhenLogoMissing && !logo) || displayLabel.length === 0) {
    return null;
  }

  const rootClassName = [
    'ai-model-logo-badge',
    logo ? 'has-logo' : '',
    className ?? ''
  ].filter(Boolean).join(' ');

  return (
    <span
      className={rootClassName}
      title={logo ? `${logo.label}: ${displayLabel}` : displayLabel}
    >
      {logo ? (
        <img
          alt=""
          decoding="async"
          height="18"
          loading="lazy"
          src={getAgentDuelAiModelLogoAssetUrl(logo.fileName)}
          width="18"
        />
      ) : null}
      <span>{displayLabel}</span>
    </span>
  );
}

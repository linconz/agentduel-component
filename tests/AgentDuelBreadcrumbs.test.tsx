import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AgentDuelBreadcrumbs } from '../src/AgentDuelBreadcrumbs';
import { AgentDuelBattleMatchLabelBadge } from '../src/AgentDuelBattleMatchLabelBadge';
import { AgentDuelBattleTypeBadge } from '../src/AgentDuelBattleTypeBadge';

describe('AgentDuelBreadcrumbs', () => {
  it('renders linked ancestors and marks only the final item as current', () => {
    const html = renderToStaticMarkup(
      <AgentDuelBreadcrumbs
        ariaLabel="当前位置"
        items={[
          { href: '/dashboard', label: '备战室' },
          { href: '/dashboard/deathmatch/battles', label: '死斗模式' },
          { label: '当前战斗' }
        ]}
      />
    );

    expect(html).toContain('class="duel-breadcrumbs"');
    expect(html).toContain('<a href="/dashboard">备战室</a>');
    expect(html).toContain('<a href="/dashboard/deathmatch/battles">死斗模式</a>');
    expect(html).toContain('<span aria-current="page">当前战斗</span>');
  });

  it('uses the host link component for linked items', () => {
    const html = renderToStaticMarkup(
      <AgentDuelBreadcrumbs
        ariaLabel="Location"
        items={[{ href: '/dashboard', label: 'Dashboard' }, { label: 'Battle' }]}
        linkComponent={({ children, href }) => <a data-router-link="true" href={href}>{children}</a>}
      />
    );

    expect(html).toContain('data-router-link="true"');
  });
});

describe('AgentDuelBattleMatchLabelBadge', () => {
  it('renders its tone and tooltip without depending on a host i18n instance', () => {
    const html = renderToStaticMarkup(
      <AgentDuelBattleMatchLabelBadge
        label="随机匹配"
        tone="random"
        tooltip="我发起了这场练习赛"
      />
    );

    expect(html).toContain('class="battle-match-label is-random"');
    expect(html).toContain('title="我发起了这场练习赛"');
  });
});

describe('AgentDuelBattleTypeBadge', () => {
  it('renders the shared practice or ranked presentation class', () => {
    const html = renderToStaticMarkup(
      <AgentDuelBattleTypeBadge battleType="ranked" label="排位赛" />
    );

    expect(html).toContain('class="agentduel-battle-type-badge is-ranked"');
  });
});

// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  AgentDuelBadgeGallery,
  AgentDuelOwnedBadgeGallery,
  agentDuelBadgeDraftsEqual,
  createAgentDuelBadgeDisplayDraft,
  moveAgentDuelBadge,
  type AgentDuelOwnedBadgeGalleryLabels
} from '../src';

const labels: AgentDuelOwnedBadgeGalleryLabels = {
  title: 'Badges', equippedTitle: 'Equipped', hiddenTitle: 'Hidden',
  count: (count) => `${count}`, awardedAt: (date) => date, edit: 'Edit', save: 'Save', cancel: 'Cancel',
  saving: 'Saving', hide: 'Hide', show: 'Show', visitorHint: 'Visible to visitors',
  equippedDropEmpty: 'Equip here', hiddenDropEmpty: 'Hide here', saveFailed: 'Save failed',
  dragInstructions: 'Drag', dragStarted: (name) => `Start ${name}`, dragOverEquipped: (name) => `Equip ${name}`,
  dragOverHidden: (name) => `Hide ${name}`, draggedToEquipped: (name) => `Equipped ${name}`,
  draggedToHidden: (name) => `Hidden ${name}`, dragCancelled: 'Cancelled'
};

const badges = [
  { key: 'first', category: 'test', name: 'First', description: 'First badge', icon_svg: null, icon_url: null, awarded_at: '2026-08-01T00:00:00.000Z', is_hidden: false },
  { key: 'second', category: 'test', name: 'Second', description: 'Second badge', icon_svg: null, icon_url: null, awarded_at: '2026-08-02T00:00:00.000Z', is_hidden: true }
] as const;

describe('AgentDuel badge galleries', () => {
  it('does not reserve space for an empty guest gallery', () => {
    expect(renderToStaticMarkup(createElement(AgentDuelBadgeGallery, { badges: [], labels }))).toBe('');
  });

  it('renders guest badge metadata and owner edit action', () => {
    const guest = renderToStaticMarkup(createElement(AgentDuelBadgeGallery, { badges, labels }));
    const owner = renderToStaticMarkup(createElement(AgentDuelOwnedBadgeGallery, {
      badges,
      labels,
      onSave: async () => undefined
    }));
    expect(guest).toContain('First');
    expect(guest).not.toContain('Second');
    expect(owner).toContain('Edit');
    expect(owner).toContain('Visible to visitors');
  });

  it('shows the original styled metadata tooltip for guest and owner badges', () => {
    const guest = render(createElement(AgentDuelBadgeGallery, { badges, labels }));
    const guestBadge = screen.getByRole('article', { name: 'First' });

    expect(guestBadge.getAttribute('title')).toBeNull();
    fireEvent.mouseMove(guestBadge, { clientX: 120, clientY: 80 });
    expect(screen.getByRole('tooltip').textContent).toContain('First badge');
    expect(screen.getByRole('tooltip').textContent).toContain('2026');
    fireEvent.mouseLeave(guestBadge);
    expect(screen.queryByRole('tooltip')).toBeNull();

    guest.unmount();
    const owner = render(createElement(AgentDuelOwnedBadgeGallery, { badges, labels, onSave: async () => undefined }));
    const ownerBadge = screen.getByRole('article', { name: 'First' });
    fireEvent.focus(ownerBadge);
    expect(screen.getByRole('tooltip').textContent).toContain('First badge');
    fireEvent.mouseMove(screen.getByRole('article', { name: 'Second' }), { clientX: 180, clientY: 100 });
    expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    expect(screen.getByRole('tooltip').textContent).toContain('Second badge');
    fireEvent.mouseLeave(screen.getByRole('article', { name: 'Second' }));
    expect(screen.queryByRole('tooltip')).toBeNull();
    owner.unmount();
  });

  it('moves badge keys without mutating the saved draft', () => {
    const saved = createAgentDuelBadgeDisplayDraft(badges);
    const hidden = moveAgentDuelBadge(saved, 'first', 'hidden');
    const reorderedHidden = moveAgentDuelBadge(hidden, 'first', 'hidden', 0);
    const restored = moveAgentDuelBadge(hidden, 'second', 'equipped', 0);
    expect(saved).toEqual({ equippedBadgeKeys: ['first'], hiddenBadgeKeys: ['second'] });
    expect(hidden).toEqual({ equippedBadgeKeys: [], hiddenBadgeKeys: ['second', 'first'] });
    expect(reorderedHidden).toEqual({ equippedBadgeKeys: [], hiddenBadgeKeys: ['first', 'second'] });
    expect(restored).toEqual({ equippedBadgeKeys: ['second'], hiddenBadgeKeys: ['first'] });
    expect(agentDuelBadgeDraftsEqual(saved, hidden)).toBe(false);
  });

  it('keeps the editor open and reports an asynchronous save failure', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('network'));
    render(createElement(AgentDuelOwnedBadgeGallery, { badges, labels, onSave }));

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hide' }));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Save failed'));
    expect(onSave).toHaveBeenCalledWith([], ['second', 'first']);
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });
});

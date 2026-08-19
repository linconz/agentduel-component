import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import {
  agentDuelBadgeDraftsEqual,
  createAgentDuelBadgeDisplayDraft,
  moveAgentDuelBadge,
  type AgentDuelBadgeDisplayContainer,
  type AgentDuelBadgeDisplayDraft
} from './badgeDisplay';
import './badgeGallery.css';

export interface AgentDuelBadge {
  key: string;
  category: string;
  name: string;
  description: string;
  icon_svg: string | null;
  icon_url: string | null;
  awarded_at: string;
}

export interface AgentDuelOwnedBadge extends AgentDuelBadge {
  is_hidden: boolean;
}

export interface AgentDuelBadgeGalleryLabels {
  title: string;
  count(count: number): string;
  awardedAt(date: string): string;
}

export interface AgentDuelOwnedBadgeGalleryLabels extends AgentDuelBadgeGalleryLabels {
  equippedTitle: string;
  hiddenTitle: string;
  edit: string;
  save: string;
  cancel: string;
  saving: string;
  hide: string;
  show: string;
  visitorHint: string;
  equippedDropEmpty: string;
  hiddenDropEmpty: string;
  saveFailed: string;
  dragInstructions: string;
  dragStarted(name: string): string;
  dragOverEquipped(name: string): string;
  dragOverHidden(name: string): string;
  draggedToEquipped(name: string): string;
  draggedToHidden(name: string): string;
  dragCancelled: string;
}

export interface AgentDuelBadgeGalleryProps {
  badges: readonly AgentDuelBadge[];
  className?: string;
  labels: AgentDuelBadgeGalleryLabels;
  locale?: string;
}

export interface AgentDuelOwnedBadgeGalleryProps {
  badges: readonly AgentDuelOwnedBadge[];
  className?: string;
  labels: AgentDuelOwnedBadgeGalleryLabels;
  locale?: string;
  onSave(
    equippedBadgeKeys: readonly string[],
    hiddenBadgeKeys: readonly string[]
  ): Promise<void>;
}

interface BadgeDragData {
  type: 'badge';
  badgeKey: string;
  badgeName: string;
  container: AgentDuelBadgeDisplayContainer;
}

interface ContainerDragData {
  type: 'container';
  container: AgentDuelBadgeDisplayContainer;
}

type BadgeDndData = BadgeDragData | ContainerDragData;

interface BadgeTooltipState {
  awardedAt: string;
  description: string;
  left: number;
  ownerId: string;
  top: number;
}

interface BadgeTooltipHandlers {
  onHideTooltip(ownerId: string): void;
  onShowTooltip(badge: AgentDuelBadge, ownerId: string, left: number, top: number): void;
  tooltip: BadgeTooltipState | null;
  tooltipId: string;
}

export function AgentDuelBadgeGallery({ badges, className, labels, locale = 'zh-CN' }: AgentDuelBadgeGalleryProps) {
  const titleId = useId();
  const tooltipId = useId();
  const [tooltip, setTooltip] = useState<BadgeTooltipState | null>(null);
  const visibleBadges = badges.filter((badge) => (badge as Partial<AgentDuelOwnedBadge>).is_hidden !== true);
  if (visibleBadges.length === 0) return null;

  const tooltipHandlers: BadgeTooltipHandlers = {
    tooltip,
    tooltipId,
    onShowTooltip: (badge, ownerId, left, top) => setTooltip({ ownerId, description: badge.description, awardedAt: badge.awarded_at, left, top }),
    onHideTooltip: (ownerId) => setTooltip((current) => current?.ownerId === ownerId ? null : current)
  };

  return (
    <section
      className={['agentduel-badge-gallery', className ?? ''].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <GalleryHeading count={visibleBadges.length} labels={labels} titleId={titleId} />
      <BadgeList badges={visibleBadges} {...tooltipHandlers} />
      <BadgeTooltip labels={labels} locale={locale} tooltip={tooltip} tooltipId={tooltipId} />
    </section>
  );
}

export function AgentDuelOwnedBadgeGallery({
  badges,
  className,
  labels,
  locale = 'zh-CN',
  onSave
}: AgentDuelOwnedBadgeGalleryProps) {
  const titleId = useId();
  const hiddenTitleId = useId();
  const tooltipId = useId();
  const savedDraft = useMemo(() => createAgentDuelBadgeDisplayDraft(badges), [badges]);
  const [draft, setDraft] = useState<AgentDuelBadgeDisplayDraft>(savedDraft);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeBadgeKey, setActiveBadgeKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<BadgeTooltipState | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!isEditing) setDraft(savedDraft);
  }, [isEditing, savedDraft]);

  if (badges.length === 0) return null;

  const activeDraft = isEditing ? draft : savedDraft;
  const equippedBadges = orderBadges(badges, activeDraft.equippedBadgeKeys);
  const hiddenBadges = orderBadges(badges, activeDraft.hiddenBadgeKeys);
  const activeBadges = activeBadgeKey === null ? [] : badges.filter((badge) => badge.key === activeBadgeKey);
  const tooltipHandlers: BadgeTooltipHandlers = {
    tooltip,
    tooltipId,
    onShowTooltip: (badge, ownerId, left, top) => setTooltip({ ownerId, description: badge.description, awardedAt: badge.awarded_at, left, top }),
    onHideTooltip: (ownerId) => setTooltip((current) => current?.ownerId === ownerId ? null : current)
  };
  const announcements: Announcements = {
    onDragStart({ active }) {
      const data = readBadgeDragData(active.data.current);
      return data ? labels.dragStarted(data.badgeName) : undefined;
    },
    onDragOver({ active, over }) {
      const data = readBadgeDragData(active.data.current);
      const destination = readContainer(over?.data.current);
      if (!data || !destination) return undefined;
      return destination === 'equipped'
        ? labels.dragOverEquipped(data.badgeName)
        : labels.dragOverHidden(data.badgeName);
    },
    onDragEnd({ active, over }) {
      const data = readBadgeDragData(active.data.current);
      const destination = readContainer(over?.data.current);
      if (!data || !destination) return labels.dragCancelled;
      return destination === 'equipped'
        ? labels.draggedToEquipped(data.badgeName)
        : labels.draggedToHidden(data.badgeName);
    },
    onDragCancel: () => labels.dragCancelled
  };

  function beginEditing(): void {
    setDraft(cloneDraft(savedDraft));
    setSaveError(null);
    setTooltip(null);
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setDraft(cloneDraft(savedDraft));
    setSaveError(null);
    setActiveBadgeKey(null);
    setTooltip(null);
    setIsEditing(false);
  }

  function handleDragStart(event: DragStartEvent): void {
    setActiveBadgeKey(readBadgeDragData(event.active.data.current)?.badgeKey ?? null);
    setSaveError(null);
    setTooltip(null);
  }

  function handleDragEnd(event: DragEndEvent): void {
    setActiveBadgeKey(null);
    setTooltip(null);
    const activeData = readBadgeDragData(event.active.data.current);
    const destination = readContainer(event.over?.data.current);
    if (!activeData || !destination || isSaving) return;
    setDraft((current) => {
      const overBadge = readBadgeDragData(event.over?.data.current);
      const destinationKeys = destination === 'equipped' ? current.equippedBadgeKeys : current.hiddenBadgeKeys;
      const index = overBadge ? destinationKeys.indexOf(overBadge.badgeKey) : -1;
      return moveAgentDuelBadge(
        current,
        activeData.badgeKey,
        destination,
        index < 0 ? destinationKeys.length : index
      );
    });
  }

  async function saveChanges(): Promise<void> {
    if (agentDuelBadgeDraftsEqual(savedDraft, draft)) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(draft.equippedBadgeKeys, draft.hiddenBadgeKeys);
      setIsEditing(false);
    } catch {
      setSaveError(labels.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      className={['agentduel-badge-gallery', 'agentduel-badge-gallery-owned', className ?? ''].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
    >
      <div className="agentduel-badge-gallery-heading">
        <div className="agentduel-badge-gallery-heading-copy">
          <h2 id={titleId}>{labels.equippedTitle}</h2>
          <div className="agentduel-badge-gallery-actions">
            {isEditing ? (
              <>
                <button disabled={isSaving} onClick={() => void saveChanges()} type="button">
                  {isSaving ? labels.saving : labels.save}
                </button>
                <button disabled={isSaving} onClick={cancelEditing} type="button">{labels.cancel}</button>
              </>
            ) : (
              <button
                aria-label={labels.edit}
                className="agentduel-badge-gallery-icon-button"
                onClick={beginEditing}
                title={labels.edit}
                type="button"
              >
                <PencilIcon />
              </button>
            )}
          </div>
        </div>
        <span>{labels.count(equippedBadges.length)}</span>
      </div>

      {isEditing ? (
        <DndContext
          accessibility={{
            announcements,
            screenReaderInstructions: { draggable: labels.dragInstructions }
          }}
          collisionDetection={badgeCollisionDetection}
          sensors={sensors}
          onDragCancel={() => {
            setActiveBadgeKey(null);
            setTooltip(null);
          }}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <EditableBadgeList
            badges={equippedBadges}
            badgeKeys={activeDraft.equippedBadgeKeys}
            container="equipped"
            disabled={isSaving}
            emptyLabel={labels.equippedDropEmpty}
            labels={labels}
            onMove={(badgeKey) => setDraft((current) => moveAgentDuelBadge(current, badgeKey, 'hidden'))}
            {...tooltipHandlers}
          />
          <p className="agentduel-badge-gallery-hint">{labels.visitorHint}</p>
          <div className="agentduel-badge-gallery-hidden" aria-labelledby={hiddenTitleId}>
            <div className="agentduel-badge-gallery-subheading">
              <h3 id={hiddenTitleId}>{labels.hiddenTitle}</h3>
              <span>{labels.count(hiddenBadges.length)}</span>
            </div>
            <EditableBadgeList
              badges={hiddenBadges}
              badgeKeys={activeDraft.hiddenBadgeKeys}
              container="hidden"
              disabled={isSaving}
              emptyLabel={labels.hiddenDropEmpty}
            labels={labels}
            onMove={(badgeKey) => setDraft((current) => moveAgentDuelBadge(current, badgeKey, 'equipped'))}
            {...tooltipHandlers}
            />
          </div>
          <DragOverlay dropAnimation={null}>
            {activeBadges.length > 0 ? (
              <div className="agentduel-badge-gallery-overlay">
                {activeBadges.map((badge) => <BadgeItem badge={badge} focusable={false} key={`${badge.key}:${badge.awarded_at}`} />)}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <>
          <BadgeList badges={equippedBadges} {...tooltipHandlers} />
          <p className="agentduel-badge-gallery-hint">{labels.visitorHint}</p>
          {hiddenBadges.length > 0 ? (
            <div className="agentduel-badge-gallery-hidden" aria-labelledby={hiddenTitleId}>
              <div className="agentduel-badge-gallery-subheading">
                <h3 id={hiddenTitleId}>{labels.hiddenTitle}</h3>
                <span>{labels.count(hiddenBadges.length)}</span>
              </div>
              <BadgeList badges={hiddenBadges} {...tooltipHandlers} />
            </div>
          ) : null}
        </>
      )}
      {saveError ? <p className="agentduel-badge-gallery-error" role="alert">{saveError}</p> : null}
      <BadgeTooltip labels={labels} locale={locale} tooltip={tooltip} tooltipId={tooltipId} />
    </section>
  );
}

function PencilIcon() {
  return (
    <svg aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

const badgeCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  return pointerCollisions.length > 0 ? pointerCollisions : closestCenter(args);
};

function GalleryHeading({ count, labels, titleId }: { count: number; labels: AgentDuelBadgeGalleryLabels; titleId: string }) {
  return (
    <div className="agentduel-badge-gallery-heading">
      <h2 id={titleId}>{labels.title}</h2>
      <span>{labels.count(count)}</span>
    </div>
  );
}

function EditableBadgeList({
  badges,
  badgeKeys,
  container,
  disabled,
  emptyLabel,
  labels,
  onMove,
  onHideTooltip,
  onShowTooltip,
  tooltip,
  tooltipId
}: {
  badges: readonly AgentDuelBadge[];
  badgeKeys: readonly string[];
  container: AgentDuelBadgeDisplayContainer;
  disabled: boolean;
  emptyLabel: string;
  labels: AgentDuelOwnedBadgeGalleryLabels;
  onMove(badgeKey: string): void;
  onHideTooltip(ownerId: string): void;
  onShowTooltip(badge: AgentDuelBadge, ownerId: string, left: number, top: number): void;
  tooltip: BadgeTooltipState | null;
  tooltipId: string;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `badge-container:${container}`,
    data: { type: 'container', container } satisfies ContainerDragData
  });
  const groups = groupBadges(badges, badgeKeys);
  return (
    <div
      className={['agentduel-badge-gallery-list', 'is-drop-zone', isOver ? 'is-over' : '', groups.length === 0 ? 'is-empty' : ''].filter(Boolean).join(' ')}
      data-badge-container={container}
      ref={setNodeRef}
    >
      <SortableContext items={groups.map(({ badgeKey }) => `badge:${badgeKey}`)} strategy={rectSortingStrategy}>
        {groups.map(({ badgeKey, records }) => (
          <SortableBadgeGroup
            badgeKey={badgeKey}
            badges={records}
            container={container}
            disabled={disabled}
            key={badgeKey}
            labels={labels}
            onMove={() => onMove(badgeKey)}
            onHideTooltip={onHideTooltip}
            onShowTooltip={onShowTooltip}
            tooltip={tooltip}
            tooltipId={tooltipId}
          />
        ))}
      </SortableContext>
      {groups.length === 0 ? <p className="agentduel-badge-gallery-empty">{emptyLabel}</p> : null}
    </div>
  );
}

function SortableBadgeGroup({ badgeKey, badges, container, disabled, labels, onMove, onHideTooltip, onShowTooltip, tooltip, tooltipId }: {
  badgeKey: string;
  badges: readonly AgentDuelBadge[];
  container: AgentDuelBadgeDisplayContainer;
  disabled: boolean;
  labels: AgentDuelOwnedBadgeGalleryLabels;
  onMove(): void;
  onHideTooltip(ownerId: string): void;
  onShowTooltip(badge: AgentDuelBadge, ownerId: string, left: number, top: number): void;
  tooltip: BadgeTooltipState | null;
  tooltipId: string;
}) {
  const representative = badges[0];
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: `badge:${badgeKey}`,
    data: {
      type: 'badge',
      badgeKey,
      badgeName: representative?.name ?? badgeKey,
      container
    } satisfies BadgeDragData,
    disabled
  });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div className={`agentduel-badge-gallery-sortable${isDragging ? ' is-dragging' : ''}`} ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} className="agentduel-badge-gallery-drag-handle">
        {badges.map((badge) => <BadgeItem badge={badge} key={`${badge.key}:${badge.awarded_at}`} onHideTooltip={onHideTooltip} onShowTooltip={onShowTooltip} tooltip={tooltip} tooltipId={tooltipId} />)}
      </div>
      <button disabled={disabled} onClick={onMove} type="button">
        {container === 'equipped' ? labels.hide : labels.show}
      </button>
    </div>
  );
}

function BadgeList({ badges, onHideTooltip, onShowTooltip, tooltip, tooltipId }: { badges: readonly AgentDuelBadge[] } & BadgeTooltipHandlers) {
  return (
    <div className="agentduel-badge-gallery-list">
      {badges.map((badge) => <BadgeItem badge={badge} key={`${badge.key}:${badge.awarded_at}`} onHideTooltip={onHideTooltip} onShowTooltip={onShowTooltip} tooltip={tooltip} tooltipId={tooltipId} />)}
    </div>
  );
}

function BadgeItem({ badge, focusable = true, onHideTooltip, onShowTooltip, tooltip, tooltipId }: {
  badge: AgentDuelBadge;
  focusable?: boolean;
  onHideTooltip?(ownerId: string): void;
  onShowTooltip?(badge: AgentDuelBadge, ownerId: string, left: number, top: number): void;
  tooltip?: BadgeTooltipState | null;
  tooltipId?: string;
}) {
  const ownerId = `${badge.key}:${badge.awarded_at}`;
  const tooltipVisible = tooltip?.ownerId === ownerId;
  return (
    <article
      aria-describedby={tooltipVisible ? tooltipId : undefined}
      aria-hidden={focusable ? undefined : true}
      aria-label={focusable ? badge.name : undefined}
      className="agentduel-badge-gallery-item"
      onBlur={focusable && onHideTooltip ? () => onHideTooltip(ownerId) : undefined}
      onFocus={focusable && onShowTooltip ? (event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        onShowTooltip(badge, ownerId, bounds.right + 12, bounds.bottom + 12);
      } : undefined}
      onMouseLeave={focusable && onHideTooltip ? () => onHideTooltip(ownerId) : undefined}
      onMouseMove={focusable && onShowTooltip ? (event) => onShowTooltip(badge, ownerId, event.clientX + 12, event.clientY + 12) : undefined}
      tabIndex={focusable ? 0 : undefined}
    >
      <span className="agentduel-badge-gallery-mark" aria-hidden="true">
        {badge.icon_svg !== null ? (
          <span className="agentduel-badge-gallery-inline-svg" dangerouslySetInnerHTML={{ __html: badge.icon_svg }} />
        ) : badge.icon_url !== null ? <img alt="" loading="lazy" src={badge.icon_url} /> : null}
      </span>
      <strong>{badge.name}</strong>
    </article>
  );
}

function BadgeTooltip({ labels, locale, tooltip, tooltipId }: {
  labels: AgentDuelBadgeGalleryLabels;
  locale: string;
  tooltip: BadgeTooltipState | null;
  tooltipId: string;
}) {
  return (
    <span
      aria-hidden={tooltip === null}
      className={`agentduel-badge-gallery-tooltip${tooltip === null ? '' : ' is-visible'}`}
      id={tooltipId}
      role="tooltip"
      style={tooltip === null ? undefined : { left: tooltip.left, top: tooltip.top }}
    >
      <span className="agentduel-badge-gallery-tooltip-description">{tooltip?.description ?? ''}</span>
      <span className="agentduel-badge-gallery-tooltip-awarded-at">{tooltip === null ? '' : labels.awardedAt(formatAwardedAt(tooltip.awardedAt, locale))}</span>
    </span>
  );
}

function readBadgeDragData(value: unknown): BadgeDragData | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const data = value as Partial<BadgeDndData>;
  return data.type === 'badge'
    && typeof data.badgeKey === 'string'
    && typeof data.badgeName === 'string'
    && (data.container === 'equipped' || data.container === 'hidden')
    ? data as BadgeDragData
    : null;
}

function readContainer(value: unknown): AgentDuelBadgeDisplayContainer | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const container = (value as Partial<BadgeDndData>).container;
  return container === 'equipped' || container === 'hidden' ? container : null;
}

function cloneDraft(draft: AgentDuelBadgeDisplayDraft): AgentDuelBadgeDisplayDraft {
  return { equippedBadgeKeys: [...draft.equippedBadgeKeys], hiddenBadgeKeys: [...draft.hiddenBadgeKeys] };
}

function groupBadges(badges: readonly AgentDuelBadge[], badgeKeys: readonly string[]) {
  return badgeKeys.flatMap((badgeKey) => {
    const records = badges.filter((badge) => badge.key === badgeKey);
    return records.length === 0 ? [] : [{ badgeKey, records }];
  });
}

function orderBadges(badges: readonly AgentDuelBadge[], badgeKeys: readonly string[]): AgentDuelBadge[] {
  return groupBadges(badges, badgeKeys).flatMap(({ records }) => records);
}

function formatAwardedAt(value: string, locale: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

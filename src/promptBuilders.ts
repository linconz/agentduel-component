const AGENT_CODE_GUIDE_PATH = '/AGENT_CODE_GUIDE.md';

export interface AgentOptimizationPromptMessages<CharacterClassId extends string = string> {
  apiKey(apiKey: string): string;
  currentClass(classId: CharacterClassId, className: string): string;
  followGuide(url: string): string;
}

export interface AgentOptimizationPromptInput<CharacterClassId extends string = string> {
  apiKey: string;
  characterClassId: CharacterClassId;
  characterClassName: string;
  guideOrigin: string;
  messages: AgentOptimizationPromptMessages<CharacterClassId>;
}

export interface TeamOptimizationPromptUnit<CharacterClassId extends string = string> {
  slot_no: number;
  class_id: CharacterClassId;
}

export interface TeamOptimizationPromptMessages {
  apiKey(apiKey: string): string;
  currentComposition(composition: string): string;
  followGuide(url: string): string;
}

export interface TeamOptimizationPromptInput<CharacterClassId extends string = string> {
  apiKey: string;
  guideOrigin: string;
  units: readonly TeamOptimizationPromptUnit<CharacterClassId>[];
  messages: TeamOptimizationPromptMessages;
}

export type BattleReviewPromptSide = 'red' | 'blue';
export type BattleReviewPromptWinnerSide = BattleReviewPromptSide | 'draw';
export type BattleReviewPromptResult = 'win' | 'loss' | 'draw' | 'unknown';

export interface BattleReviewPromptAnalysis {
  ownSide: BattleReviewPromptSide;
  result: BattleReviewPromptResult;
}

export interface BattleReviewPromptMessages {
  apiKey(apiKey: string): string;
  readEntryGuide(url: string): string;
  readReviewContext(url: string): string;
  analyzeReplay(analysis: BattleReviewPromptAnalysis): string;
  optimizeAndSubmit: string;
}

export interface BattleReviewPromptInput {
  apiKey: string;
  ownSide: BattleReviewPromptSide;
  winnerSide: BattleReviewPromptWinnerSide | null;
  guideOrigin: string;
  reviewContextUrl: string;
  messages: BattleReviewPromptMessages;
}

export function buildAgentOptimizationPrompt<CharacterClassId extends string>({
  apiKey,
  characterClassId,
  characterClassName,
  guideOrigin,
  messages
}: AgentOptimizationPromptInput<CharacterClassId>): string {
  return [
    messages.apiKey(apiKey),
    messages.currentClass(characterClassId, characterClassName),
    messages.followGuide(`${guideOrigin}${AGENT_CODE_GUIDE_PATH}`)
  ].join('\n');
}

export function buildTeamOptimizationPrompt<CharacterClassId extends string>({
  apiKey,
  guideOrigin,
  units,
  messages
}: TeamOptimizationPromptInput<CharacterClassId>): string {
  const composition = units
    .slice()
    .sort((a, b) => a.slot_no - b.slot_no)
    .map((unit) => `slot ${unit.slot_no}: ${unit.class_id}`)
    .join(', ');

  return [
    messages.apiKey(apiKey),
    messages.currentComposition(composition),
    messages.followGuide(`${guideOrigin}${AGENT_CODE_GUIDE_PATH}`)
  ].join('\n');
}

export function buildBattleReviewPrompt({
  apiKey,
  ownSide,
  winnerSide,
  guideOrigin,
  reviewContextUrl,
  messages
}: BattleReviewPromptInput): string {
  return [
    messages.apiKey(apiKey),
    messages.readEntryGuide(`${guideOrigin}${AGENT_CODE_GUIDE_PATH}`),
    messages.readReviewContext(reviewContextUrl),
    messages.analyzeReplay({ ownSide, result: getBattleReviewPromptResult(ownSide, winnerSide) }),
    messages.optimizeAndSubmit
  ].join('\n');
}

export function getBattleReviewPromptResult(
  ownSide: BattleReviewPromptSide,
  winnerSide: BattleReviewPromptWinnerSide | null
): BattleReviewPromptResult {
  if (winnerSide === ownSide) {
    return 'win';
  }

  if (winnerSide === 'draw') {
    return 'draw';
  }

  if (winnerSide === 'red' || winnerSide === 'blue') {
    return 'loss';
  }

  return 'unknown';
}

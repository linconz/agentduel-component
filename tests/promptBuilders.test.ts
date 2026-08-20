import { describe, expect, it } from 'vitest';
import {
  buildAgentOptimizationPrompt,
  buildBattleReviewPrompt,
  buildTeamOptimizationPrompt
} from '../src/promptBuilders';

describe('prompt builders', () => {
  it('builds the character prompt from host-provided parameters and messages', () => {
    expect(buildAgentOptimizationPrompt({
      apiKey: 'character_key',
      characterClassId: 'mage',
      characterClassName: '法师',
      guideOrigin: 'https://agentduel.app',
      messages: {
        apiKey: (apiKey) => `api key: ${apiKey}`,
        currentClass: (classId, className) => `class: ${classId} (${className})`,
        followGuide: (url) => `guide: ${url}`
      }
    })).toBe([
      'api key: character_key',
      'class: mage (法师)',
      'guide: https://agentduel.app/AGENT_CODE_GUIDE.md'
    ].join('\n'));
  });

  it('sorts team units by slot before building the team prompt', () => {
    expect(buildTeamOptimizationPrompt({
      apiKey: 'team_key',
      guideOrigin: 'https://agentduel.app',
      units: [
        { slot_no: 2, class_id: 'hunter' },
        { slot_no: 1, class_id: 'warrior' }
      ],
      messages: {
        apiKey: (apiKey) => `api key: ${apiKey}`,
        currentComposition: (composition) => `team: ${composition}`,
        followGuide: (url) => `guide: ${url}`
      }
    })).toBe([
      'api key: team_key',
      'team: slot 1: warrior, slot 2: hunter',
      'guide: https://agentduel.app/AGENT_CODE_GUIDE.md'
    ].join('\n'));
  });

  it('derives the owned result before building the battle review prompt', () => {
    expect(buildBattleReviewPrompt({
      apiKey: 'review_key',
      ownSide: 'blue',
      winnerSide: 'red',
      guideOrigin: 'https://agentduel.app',
      reviewContextUrl: 'https://api.agentduel.app/api/battles/review-context?id=1',
      messages: {
        apiKey: (apiKey) => `api key: ${apiKey}`,
        readEntryGuide: (url) => `guide: ${url}`,
        readReviewContext: (url) => `review: ${url}`,
        analyzeReplay: ({ ownSide, result }) => `analyze: ${ownSide} ${result}`,
        optimizeAndSubmit: 'optimize and submit'
      }
    })).toBe([
      'api key: review_key',
      'guide: https://agentduel.app/AGENT_CODE_GUIDE.md',
      'review: https://api.agentduel.app/api/battles/review-context?id=1',
      'analyze: blue loss',
      'optimize and submit'
    ].join('\n'));
  });
});

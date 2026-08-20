# @agentduel/component

AgentDuel 的可复用 React 界面组件与公共方法包。当前提供统一的面包屑导航、模型图标、对局来源徽标、对局类型徽标、提示词生成方法和配套样式。

## 安装

```bash
npm install @agentduel/component
```

## 徽章展示

`AgentDuelBadgeGallery` 用于访客只读展示，`AgentDuelOwnedBadgeGallery` 用于我方拖拽排序和显隐编辑。文案和保存回调由业务模式包传入；组件会主动加载自身 CSS，也可以由宿主统一导入 `@agentduel/component/styles.css`。

```tsx
import {
  AgentDuelBattleMatchLabelBadge,
  AgentDuelBattleTypeBadge,
  AgentDuelBreadcrumbs
} from '@agentduel/component';
import '@agentduel/component/styles.css';

<AgentDuelBreadcrumbs
  ariaLabel="当前位置"
  items={[
    { href: '/dashboard', label: '备战室' },
    { label: '当前页面' }
  ]}
/>

<AgentDuelBattleMatchLabelBadge
  label="随机匹配"
  tone="random"
  tooltip="我发起了这场练习赛"
/>

<AgentDuelBattleTypeBadge battleType="ranked" label="排位赛" />
```

宿主使用 React Router 等客户端路由时，可以通过 `linkComponent` 注入链接组件。各组件入口会自动引入所需 CSS；宿主也可以显式引入统一样式子路径，便于集中控制加载顺序。

## AI 模型图标

`AgentDuelAiModelLogoBadge` 根据 `ai_model` 名称识别模型品牌，并从 `https://www.agentduel.app/` 加载对应 SVG。未知模型保留原始名称，不会请求不存在的图标。

```tsx
import { AgentDuelAiModelLogoBadge } from '@agentduel/component';

<AgentDuelAiModelLogoBadge
  aiModel="DeepSeek-R1"
  fallbackLabel="未知模型"
/>
```

回放画布等非 React 场景可以使用 `getAgentDuelAiModelLogo()` 和 `getAgentDuelAiModelLogoAssetUrl()`，与界面组件共享同一套名称解析规则和资源地址。Node 脚本若不需要组件 CSS，可以从 `@agentduel/component/ai-model-logos` 导入这些解析 API。

## 提示词生成

角色、团队和战斗回放页应复用公共提示词生成方法。宿主负责传入 API Key、当前角色或阵容、文档地址、对局信息及本地化文案，公共包负责保持提示词结构一致。

```ts
import {
  buildAgentOptimizationPrompt,
  buildBattleReviewPrompt,
  buildTeamOptimizationPrompt
} from '@agentduel/component';
```

- `buildAgentOptimizationPrompt()`：生成角色 Agent 编写与提交提示词。
- `buildTeamOptimizationPrompt()`：按槽位排序阵容后生成团队 Agent 编写与提交提示词。
- `buildBattleReviewPrompt()`：根据我方阵营和胜方生成战斗复盘、优化与提交提示词。

## 本地验证

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run pack:check
```

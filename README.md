# @agentduel/component

AgentDuel 的可复用 React 界面组件包。当前提供统一的面包屑导航、对局来源徽标、对局类型徽标和配套样式。

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

## 本地验证

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run pack:check
```

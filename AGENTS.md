# AGENTS.md

## 项目背景

这是一个 Vite + React + TypeScript 的人生画廊 APP。用户通过情绪确认、情绪对谈、选择画笔风格，最终生成一幅画作。当前画作生成是前端伪生成，后续目标是接入真实 AI 图像生成。

## 创建画作流程相关文件

- `src/app/App.tsx`: 管理页面状态和创建流程跳转，当前主流程为 `emotion-confirm -> emotional-dialogue -> generating -> artwork-detail`。
- `src/app/components/GalleryHome.tsx`: 首页中的记录入口会进入创建画作流程。
- `src/app/components/BottomNav.tsx`: 底部导航中间创建按钮会跳转到情绪确认。
- `src/app/components/EmotionConfirmation.tsx`: 情绪类型和强度确认页面。
- `src/app/components/EmotionalDialogue.tsx`: 情绪对谈页面，目前使用固定对话选项推进流程。
- `src/app/components/ArtworkGenerating.tsx`: 画笔/媒介风格选择和伪生成进度页面，是后续接入真实 AI 图像生成的主要前端衔接点。
- `src/app/components/ArtworkDetail.tsx`: 生成后作品展示页面，目前展示 `mockData.ts` 中的假作品。
- `src/app/components/mockData.ts`: 当前作品、风格标签和画廊数据的 mock 数据来源。

## Codex 后续开发规则

- 不要重构 UI，除非当前 PR 明确以 UI 重构为目标。
- 保留现有视觉风格，包括移动端画框、玻璃拟态、暖色画廊质感、字体层级和动效节奏。
- 每个 PR 只做一个小功能，避免把无关修复、格式化、重命名或重构混在一起。
- OpenAI API Key 只能放后端，不能出现在前端代码、构建产物、客户端环境变量或提交历史中。
- 所有 OpenAI 调用必须通过后端 API，前端只调用本项目后端提供的接口。
- 每次完成后运行 `npm run build`，并在交付说明中写明构建结果。

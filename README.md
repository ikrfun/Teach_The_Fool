# Teach the Fool — Learn by Teaching

## English
- Concept: Learn a topic from an AI Teacher, then consolidate understanding by teaching a playful Fool. The Teacher intervenes only when the explanation is wrong or missing key points. Chat continues until you click End. Start a new chat to learn a new topic.
- Tech: Next.js (App Router) + API routes, Prisma + SQLite as a simple DB, optional integration with xAI Grok and memU.
- Screens: Topic Input, Teacher Lesson, Teach-the-Fool Chat, Report.
- Quick Start:
  - Prerequisites: Node.js 18+, npm
  - Setup: `cd web && npm install && npm run dev`
  - Environment: `XAI_API_KEY`, `XAI_BASE_URL`, `XAI_MODEL`, `MEMU_API_KEY`, `MEMU_API_URL`
- Repo: single Git repo at project root. The former nested repo under `web/` was removed; commit from project root.
- Workspace: Next.js warning about multiple lockfiles is silenced by `turbopack.root` in `web/next.config.ts`.
- Behavior:
  - Material generation is async; lesson shows a “Generating...” placeholder and auto-refreshes when ready.
  - Enter to send, Shift+Enter for newline; double-submit guarded.
- APIs:
  - POST `/api/topic` → create session and start generation (async update)
  - GET `/api/session/:id` → fetch session (teacherMaterial, keyConcepts)
  - POST `/api/teacher/chat` → Teacher Q&A
  - POST `/api/teach/chat` → Fool reply + optional Teacher intervention
  - GET `/api/history` → list sessions
- API Draft:
  - POST `/api/topic` → create session and teacher material
  - POST `/api/teacher/chat` → Q&A with Teacher
  - POST `/api/teach/chat` → Fool reply + Teacher intervention
  - GET `/api/history` → list sessions

## 日本語
- コンセプト: 先生から学んだ後に「お馬鹿さん」に教えて理解を定着。説明の誤りや重要な抜けがある場合のみ先生が優しく介入。終了ボタンを押すまでチャット継続。「新しいチャット」で初期画面へ。
- 技術: Next.js（App Router）+ APIルート、Prisma + SQLiteの簡易DB、xAI GrokとmemUは将来統合可能。
- 画面: トピック入力、先生の授業、教えるチャット、レポート。
- 使い方:
  - 必要条件: Node.js 18+、npm
  - 手順: `cd web && npm install && npm run dev`
  - 環境変数: `XAI_API_KEY`, `XAI_BASE_URL`, `XAI_MODEL`, `MEMU_API_KEY`, `MEMU_API_URL`
- リポジトリ: Gitはプロジェクト直下で一元管理。`web/`の入れ子リポジトリは削除済み。コミットはプロジェクト直下で行う。
- ワークスペース: `web/next.config.ts` に `turbopack.root` を設定してロックファイル警告を抑止。
- 挙動:
  - 教材生成は非同期。授業画面は「作成中」を表示し、準備ができ次第自動で教材に差し替え。
  - Enterで送信、Shift+Enterで改行。送信中の二重送信は防止。
- API:
  - POST `/api/topic` → セッション作成と生成開始（非同期更新）
  - GET `/api/session/:id` → セッション取得（teacherMaterial, keyConcepts）
  - POST `/api/teacher/chat` → 先生とのQ&A
  - POST `/api/teach/chat` → お馬鹿さん応答＋先生介入
  - GET `/api/history` → セッション一覧

## 中文
- 概念：先从 AI 老师学习，再通过教“笨笨”来巩固。只有当解释错误或遗漏关键点时，老师才会温柔介入。聊天持续到点击结束，新主题点击“开始新聊天”返回首页。
- 技术：Next.js（App Router）+ API 路由，Prisma + SQLite 简易数据库，未来可集成 xAI Grok 与 memU。
- 页面：主题输入、老师授课、教笨笨聊天、学习报告。
- 使用:
  - 前提：Node.js 18+、npm
  - 步骤：`cd web && npm install && npm run dev`
  - 环境变量：`XAI_API_KEY`, `XAI_BASE_URL`, `XAI_MODEL`, `MEMU_API_KEY`, `MEMU_API_URL`
- 仓库：Git 在项目根目录统一管理；`web/` 的嵌套仓库已移除。请在根目录提交。
- 工作区：在 `web/next.config.ts` 设置 `turbopack.root` 以消除锁文件警告。
- 行为：
  - 教材生成为异步；课程页先显示“生成中”，准备后自动替换为教材。
  - Enter 发送，Shift+Enter 换行；防止重复发送。
- API：
  - POST `/api/topic` → 创建会话并启动生成（异步更新）
  - GET `/api/session/:id` → 获取会话（teacherMaterial, keyConcepts）
  - POST `/api/teacher/chat` → 老师问答
  - POST `/api/teach/chat` → 笨笨回复 + 老师介入
  - GET `/api/history` → 会话列表

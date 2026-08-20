# caro-game-fe

Next.js 16 client for a real-time Caro (Gomoku) game. Pairs with
[caro-game-be](https://github.com/nhutha/caro-game-be).

Rooms, live play, leaderboard, and match history over GraphQL + ActionCable.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19.2 + React Compiler |
| Styling | Tailwind CSS 4 (CSS-first `@theme`, no config file) |
| GraphQL | Apollo Client 4 + `graphql-ws` |
| Real-time | `@rails/actioncable` |
| State | RxJS |
| Language | TypeScript 5 |

## Setup

Start [caro-game-be](https://github.com/nhutha/caro-game-be) first — it serves
GraphQL and the WebSocket endpoint on port 3000.

```bash
git clone https://github.com/nhutha/caro-game-fe
cd caro-game-fe

cp .env.example .env.local
npm install
npm run dev
```

Then open **http://localhost:3001**.

The `dev` script pins port **3001** on purpose: Next's default is 3000, which
the Rails backend already occupies.

Sign in with any seeded backend account, e.g. `player_1@example.com` /
`password123`.

## Layout

```
src/
├── app/                 # App Router pages: browse, game/[id], room/[id],
│                        # leaderboard, history, login, register
├── components/
│   ├── game/            # GameBoard, PlayerInfo
│   ├── modals/          # CreateRoomModal
│   └── ui/              # Navbar, RoomCard, Avatar, ThemeSwitcher, …
├── contexts/            # AuthContext
├── hooks/               # useGame, useRooms, useCreateRoom, useLeaderboard,
│                        # useActionCableSubscription, …
├── lib/
│   ├── apollo.ts        # Apollo Client setup
│   ├── actioncable.ts   # ActionCable consumer
│   ├── constants.ts     # UI tokens + API_ENDPOINTS
│   └── graphql/         # queries, mutations, subscriptions
└── utils/gameUtils.ts   # win detection, board helpers
```

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

## Pointing at a different backend port

`API_ENDPOINTS` in `src/lib/constants.ts` reads `NEXT_PUBLIC_GRAPHQL_URL` and
`NEXT_PUBLIC_WS_URL`, and both `src/lib/apollo.ts` and `src/lib/actioncable.ts`
consume it. So if the backend runs somewhere other than port 3000, set those two
variables in `.env.local` and nothing else needs changing:

```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3100/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:3100/cable
```

## Benchmark tags

Tags matching `bench/v*` pin an exact tree used in a published AI-coding-agent
benchmark, so results stay reproducible as `main` moves on. Both repos are
tagged together — check out the same tag in each.

```bash
git checkout bench/v001-tailwind4
```

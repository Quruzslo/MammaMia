# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — dev server on http://localhost:3000
- `npm run build` — production build (note: `next.config.ts` sets `typescript.ignoreBuildErrors: true`, so the build does **not** catch type errors; run `npx tsc --noEmit` to check types)
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript)

There is no test suite.

## Project overview

MammaMia Kifőzde: an ordering site for a Hungarian kitchen, built on Next.js 16 (App Router), React 19, Tailwind v4. Everything users see (UI text, route names, comments, error messages) is in Hungarian. Keep it that way. Routes: `/napimenu` (weekly daily menu), `/etlap` (à la carte), `/penztar` (checkout), `/fizetve` (payment success), `/fiokom` (account), `/belepes` (login). The `@/*` alias maps to the repo root. Files are a mix of `.tsx`/`.ts` and plain `.jsx`/`.js`.

Required env vars (`.env.local`): `MONGO_URI`, `TENANT_ID`, `AUTH_CLIENT_ID`, `AUTH_SECRET` (Google OAuth + NextAuth), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, plus `NEXT_PUBLIC_PUSHER_APP_*` for `lib/pusherServer.ts`. Remote images load from a Cloudflare R2 bucket whitelisted in `next.config.ts`.

## Architecture

**Data layer: MongoDB, multi-tenant.** `lib/mongodb.ts` exports a shared `clientPromise` (it is cached on `global` in dev so hot reload doesn't open new connections). Every route uses `client.db("MammaMia")`. Collections are `menu`, `alacarteFoods`, `users` and `orders`. Documents are scoped by `tenantId: new ObjectId(process.env.TENANT_ID)`, so new queries and inserts must include that filter or field. There is no ORM or schema layer; route handlers in `app/api/*/route.ts` query collections directly.

**Auth: NextAuth v5 (beta) split config.** The config is split so that `middleware.ts` can run without database access:
- `auth.config.ts` holds the Google provider, the JWT session strategy and the `session` callback. It has no DB imports, and `middleware.ts` builds its auth from this file alone.
- `auth.ts` extends that config with `signIn` and `jwt` callbacks. These dynamically import `lib/handleUserLogin.ts`, which creates the Mongo user on first login (it generates a `userId` uuid and sets `role: "user"`) and puts `userId` and `role` into the token.
- `session.user.userId` / `session.user.role` are typed in `next-auth.d.ts`.
- `middleware.ts` guards `/fiokom` and `/admin/*` (subpaths require `role === "admin"`). Next 16 has deprecated the `middleware` convention in favour of `proxy`; see `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.
- On the server, read the session with `auth()` from `@/auth`, or wrap a handler as `export const POST = auth(async (req) => …)` and read `req.auth`. Routes that take a `userId` from the client must compare it with the session's `userId` (see `app/api/user-orders/route.ts`).

**Client state.** `app/layout.tsx` wraps the whole app in `UserProvider` (NextAuth `SessionProvider` plus a `logout` helper) and then `CartProvider`. Header, SideCart, the toast container and Footer are rendered globally there.
- `components/contexts/cartProvider.jsx` keeps the cart in `localStorage` under the key `MyCartItems`, and it renders `null` until it has mounted.
- The cart is grouped by day: `[{ date, dayName, items: [{ ...product, quantity }] }]`. À la carte items go into a group with `date: "alacarte"`. Items are matched by `name`, not by id.

**Checkout / payment flow.**
1. `app/penztar/CheckoutInputs.jsx` POSTs `{ cartItems, formData, userId }` to `/api/create-payment-intent`.
2. That route rejects menu days that have already passed, and same-day orders after 12:00 Europe/Budapest time. It **recomputes the total from the DB** (it matches `menu` items by date and name and never trusts client prices), inserts an `orders` document with `status: "pending"`, and creates a Stripe PaymentIntent in HUF whose `metadata.orderId` is the Mongo `_id`.
3. `CheckoutStripe.jsx` confirms the payment with `redirect: "if_required"`, clears the cart and goes to `/fizetve`.
- No webhook in this repo sets orders to `succeeded` (`/api/user-orders` lists only `succeeded` orders). `STRIPE_WEBHOOK_SECRET` and the Pusher server client suggest this happens in a separate service.
- The payment-intent route currently prices only `menu` items, so à la carte items in the cart are ignored. A draft that supports `alacarteFoods` is commented out at the bottom of the same file.

**Caching.** `/api/menu` sets `Cache-Control: s-maxage` to the number of seconds until the next full hour. Client pages fetch the API routes from `useEffect`; they do not use server components to fetch data.

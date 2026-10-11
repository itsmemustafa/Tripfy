# Tripfy Postman collection

This directory is generated from the backend implementation currently registered in `server/app.js` and `server/routes/*.js`. It covers all **33 registered HTTP method/path combinations** under `/api/v1`. It does not include the static `/uploads` mount because that is file serving, not a registered API endpoint.

## Files

- `tripfy.postman_collection.json` — Postman Collection v2.1
- `tripfy.postman_environment.json` — safe local defaults and empty credential/token slots
- `README.md` — setup, workflow, coverage, and limitations

No application, configuration, database, or test file was changed to generate these artifacts.

## Backend setup

Requirements:

- Node.js compatible with the installed dependencies
- MongoDB reachable through `MONGO_URL`
- `server/.env` or `server/.env.local` containing at least `MONGO_URL` and `JWT_SECRET`
- Optional external configuration:
  - AI planner: one or more of `GEMINI_API_KEY`, `GEMINI_API_KEY2`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`
  - Image upload: `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
  - CSRF: `CSRF_ENABLED=true` plus optional cookie/header-name overrides

From the repository root:

```powershell
npm install
npm run dev:server
```

The implemented default API is `http://localhost:3000/api/v1`. The environment uses that value. Change `baseUrl` if the backend is hosted elsewhere. Do not append a trailing slash.

Optional local-only demo data can be loaded with `npm run seed`; the seed command refuses non-local MongoDB URLs. Seeding changes local database data.

## Import

1. In Postman, import `tripfy.postman_collection.json`.
2. Import `tripfy.postman_environment.json`.
3. Select **Tripfy Local**.
4. Confirm `baseUrl`.
5. Supply your own `adminEmail` and `adminPassword` if testing admin routes. No real credentials are included.
6. Leave token and ID variables empty; successful requests capture them.

Postman should keep cookies enabled for `localhost`. Signup/login set signed `token` and `refreshToken` cookies. Protected API requests use captured Bearer tokens so user and administrator workflows can coexist. Refresh and logout specifically require the refresh cookie.

## Authentication and CSRF

The auth middleware accepts either:

- signed `token` cookie, or
- `Authorization: Bearer {{userAccessToken}}` / `{{adminAccessToken}}`.

Signup and login return an access token and set both signed cookies. Refresh rotates cookies but returns only `{ "msg": "Token refreshed" }`, so it cannot update a Bearer variable. Logout clears the database refresh token and cookies but does not revoke a previously issued Bearer JWT.

When `CSRF_ENABLED=false` (the example/default), the included `x-csrf-token` header may be empty. When enabled, run **Authentication → Get CSRF Token** first; its script stores `csrfToken`, and Postman's cookie jar stores the matching cookie. The current server applies CSRF checks to every unsafe method, including login and signup.

## Recommended execution order

A full run needs both a normal user and an existing administrator:

1. Health → Get API Health.
2. Authentication → Get CSRF Token when CSRF is enabled.
3. Authentication → Sign Up User (creates a unique email when `userEmail` is empty), or set an existing `userEmail` and run Login User.
4. Authentication → Login Admin after supplying local admin credentials.
5. Places → List Places to capture `placeId`.
6. Run public reads and the review workflow: Create Review → Update Own Review → Delete Own Review.
7. Run plans: Create Plan → List/Get → Publish → Get Shared → Delete.
8. Run admin managed-user workflow: Create → Update Role → Delete.
9. Run place creation/update/upload/delete only with disposable data.
10. Run AI Planner and Weather only after their external requirements are available.
11. Run Refresh Session before Logout if you want to verify rotation; Logout should be last for cookie-session checks.

Postman folder order is descriptive, not a safe one-click destructive test suite. Review deletion and place deletion can affect shared data.

## Dependency and side-effect matrix

| Request | Dependency/setup | Side effect or limitation |
|---|---|---|
| Sign Up User | MongoDB | Creates a user and session |
| Login User/Admin | Existing credentials | Rotates stored refresh token |
| Refresh Session | Signed refresh cookie | Rotates refresh cookie; prior token becomes reuse-detected |
| Logout | Signed refresh cookie | Clears stored refresh token and cookies |
| Create/Update/Delete Place | Admin token | Mutates place data; delete does not cascade references |
| Upload Place Image | Admin token, manual image selection, ImageKit config/network | Max 5 MiB, `image/*`; uploads externally |
| Create/Update/Delete Review | User token; valid `placeId`; owner for update | Mutates review data |
| Plan CRUD | User token | Mutates only the authenticated user's plans |
| Shared Plan | Published `planId` | Public read |
| Admin user mutations | Admin token | Mutates account data; self-delete is blocked |
| Admin place delete | Admin token and manually set disposable `adminDeletePlaceId` | Destructive |
| Admin review delete | Admin token and disposable `adminDeleteReviewId` | Known route/controller parameter defect; see below |
| AI Planner | User token, populated places, provider key/network | Non-deterministic external call; rate limited |
| Weather | Valid place with coordinates, Open-Meteo network | External call; cached 10 minutes |

To reset generated test data, run the corresponding delete requests before logging out. If a run stops early, remove disposable records through the admin UI/API or directly from a local test database. Never aim destructive requests at shared or production data.

## Registered-route inventory and coverage

Every row below has a matching request in the collection. “Test” means the request contains Postman assertions for the implemented success contract; it does not mean the request was executed against a live backend during generation.

| # | Method | Registered path | Access | Postman request | Verification |
|---:|---|---|---|---|---|
| 1 | GET | `/api/v1/health` | Public | Get API Health | Automated assertion |
| 2 | GET | `/api/v1/auth/csrf-token` | Public | Get CSRF Token | Automated assertion |
| 3 | POST | `/api/v1/auth/login` | Public/rate-limited | Login User/Admin | Automated assertion |
| 4 | POST | `/api/v1/auth/signup` | Public/rate-limited | Sign Up User | Automated assertion |
| 5 | POST | `/api/v1/auth/logout` | Signed refresh cookie | Logout | Automated assertion |
| 6 | POST | `/api/v1/auth/refresh-token` | Signed refresh cookie/rate-limited | Refresh Session | Automated assertion |
| 7 | GET | `/api/v1/auth/me` | Authenticated | Get Current User | Automated assertion |
| 8 | POST | `/api/v1/place/upload-image` | Admin | Upload Place Image | Manual file/external config; automated response assertion |
| 9 | GET | `/api/v1/place` | Public | List/Search Places | Automated assertion |
| 10 | POST | `/api/v1/place` | Admin | Create Place | Automated assertion |
| 11 | GET | `/api/v1/place/:id` | Public | Get Place | Automated assertion |
| 12 | PATCH | `/api/v1/place/:id` | Admin | Update Place | Automated assertion |
| 13 | DELETE | `/api/v1/place/:id` | Admin | Delete Place | Automated assertion; destructive |
| 14 | POST | `/api/v1/reviews` | Authenticated | Create Review | Automated assertion |
| 15 | GET | `/api/v1/reviews/:placeId` | Public | List Reviews for Place | Automated assertion |
| 16 | DELETE | `/api/v1/reviews/:reviewId` | Owner or admin | Delete Own Review | Automated assertion; destructive |
| 17 | PUT | `/api/v1/reviews/:reviewId` | Owner | Update Own Review | Automated assertion |
| 18 | GET | `/api/v1/admin/users` | Admin | List All Users | Automated assertion |
| 19 | POST | `/api/v1/admin/users` | Admin | Create Managed User | Automated assertion |
| 20 | DELETE | `/api/v1/admin/users/:id` | Admin | Delete Managed User | Automated assertion; destructive |
| 21 | PATCH | `/api/v1/admin/users/:id/role` | Admin | Update Managed User Role | Automated assertion |
| 22 | GET | `/api/v1/admin/places` | Admin | List All Places (Admin) | Automated assertion |
| 23 | DELETE | `/api/v1/admin/places/:id` | Admin | Delete Place (Admin Route) | Manual disposable ID; automated assertion |
| 24 | GET | `/api/v1/admin/reviews` | Admin | List All Reviews (Admin) | Automated assertion |
| 25 | DELETE | `/api/v1/admin/reviews/:id` | Admin | Delete Review (Admin Route — Known Defect) | Manual verification; assertion exposes defect |
| 26 | GET | `/api/v1/plan/shared/:id` | Public, published only | Get Shared Published Plan | Automated assertion |
| 27 | POST | `/api/v1/plan` | Authenticated | Create Plan | Automated assertion |
| 28 | GET | `/api/v1/plan` | Authenticated | List My Plans | Automated assertion |
| 29 | GET | `/api/v1/plan/:id` | Owner | Get My Plan | Automated assertion |
| 30 | DELETE | `/api/v1/plan/:id` | Owner | Delete My Plan | Automated assertion; destructive |
| 31 | PATCH | `/api/v1/plan/:id` | Owner | Publish Plan | Automated assertion |
| 32 | POST | `/api/v1/ai-planner` | Authenticated/rate-limited | Generate AI Plan | External config/manual verification; automated response assertion |
| 33 | GET | `/api/v1/weather/:placeId` | Public | Get Weather for Place | External network/manual verification; automated response assertion |

Coverage: **33/33 registered endpoints represented (100%)**. All 33 have contract-focused Postman assertions. Four endpoint requests require manual/environment-dependent verification: upload image, admin-route place deletion, AI planner, and weather. The admin-route review deletion additionally cannot satisfy its intended success contract with the current parameter mismatch.

## Implemented validation and relevant errors

- Central validation failures use HTTP 400 with `{ code, message, msg }`.
- Missing/invalid auth returns 401; insufficient role returns 403.
- Public signup rejects a supplied `role`.
- Place create requires name/category/city/lat/lng; image URLs must be HTTP(S).
- Review create requires placeId/comment and rating 1–5. Review update's controller effectively requires both text/comment and rating even though validator fields are optional.
- Plan type: `leisure | adventure | family | solo | romantic | business`.
- Plan status: `draft | published`.
- Budget currency: `USD | EUR | GBP | JPY | CNY`.
- Published non-empty `days` arrays must have the same length as duration.
- Global JSON/urlencoded body limit is 512 KiB; upload limit is 5 MiB.
- Global rate limit is 1000 requests per 15 minutes; auth is 15; AI planner is 30.

## Known backend contract issues (not modified)

1. **Admin delete-review parameter mismatch:** `DELETE /api/v1/admin/reviews/:id` calls a controller that reads `req.params.reviewId`. The registered request is represented exactly, and its strict 200 test is expected to fail until the backend is fixed.
2. **Login dead fallback branch:** `login.js` references `BadRequestError` without importing it, but route validators reject missing email/password before that branch is normally reached.
3. **Place-by-ID malformed identifier behavior:** `getPlace` catches Mongoose CastError itself and returns 500 with `{message}`, unlike the centralized handler's 404 CastError mapping.
4. **Unused places query input:** `listPlaces` destructures `tags` but never applies it to the database query; it is omitted from the documented supported filters.
5. **Admin user disclosure:** `getAllUsers` excludes `password` and `refreshToken`, but not `previousRefreshToken`.
6. **Published empty plans:** the plan pre-save rule checks day-count equality only when `days.length > 0`, so a published plan with zero days is currently accepted.
7. **No referential cascade:** place/user deletions do not remove or repair dependent reviews/plans.

## Validation status

Both generated JSON files were parsed locally. The collection was also validated successfully with Ajv against the official Postman Collection v2.1 JSON schema. It contains 37 requests representing all 33 unique static route registrations, every referenced variable is defined in the environment, all embedded pre-request/test scripts compile as JavaScript, and no copied secrets are present. The repository's existing Vitest suite also passed: 3 files and 6 tests.

A runtime probe found a listener on `127.0.0.1:3000`, but it returned the application's `{"msg":"Route does not exist"}` 404 response for the source tree's registered `GET /api/v1/health` route. That listener therefore does not match the inspected checkout and was not used to claim endpoint execution. External provider behavior, credentials, cookie policy under a deployed domain, and destructive database workflows still require a safe matching local/test instance.

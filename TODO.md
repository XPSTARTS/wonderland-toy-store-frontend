- [ ] Inspect auth-related code (useAuthStore/login/register, api axios interceptors)
- [ ] Fix useAuthStore.login to use the axios response correctly (api.ts interceptor returns response.data already)
- [x] Improve frontend error logging to include status/url/body for network vs backend failures
- [x] Retest login/register on localhost (confirmed backend returns empty response)
- [ ] If ERR_EMPTY_RESPONSE persists, verify backend is actually responding on http://localhost:7069/api/* (server logs / curl/postman)



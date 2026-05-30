# TODO - Local-first Cart Updates

## Step 1: Decide single source of truth
- [x] Pick `src/stores/cartStore.tsx` as the cart source of truth.
- [ ] Update `src/pages/*.tsx` and any components currently importing `useCartStore` to import/use the `useCartStore` from `cartStore.tsx` instead.


## Step 2: Implement local-only cart behavior
- [ ] Modify the chosen store so add/update/remove only update local persisted state.
- [ ] Remove `syncWithBackend` and any cart write API calls from add/update/remove.

## Step 3: Ensure UI correctness
- [ ] Verify `Cart.tsx`, `ProductDetail.tsx`, `Home.tsx`, `Checkout.tsx` compute totals from the same local state.

## Step 4: Checkout behavior
- [ ] Ensure order placement uses backend only for creating the order (single API call), using cart totals/items from local state.

## Step 5: Remove backend-id coupling
- [ ] Eliminate reliance on backend `cartItemId` when updating quantities locally.

## Step 6: Smoke test
- [ ] Run dev server and manually test: add item, increment/decrement, remove, refresh, proceed to checkout.


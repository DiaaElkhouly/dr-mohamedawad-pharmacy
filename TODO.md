# TODO - Fix Data Source Inconsistency

## Problem:

- Admin panel uses `data/products.json` (correct)
- Customer page uses `models/mockData.js` (wrong)
- This causes products added/edited in admin to not appear on customer page

## Tasks:

- [x] Update `app/(customer)/page.js` to fetch products from `/api/admin/products` API instead of importing from mockData

## Completed:

The customer page now fetches products from the API, ensuring both admin and customer pages use the same data source.

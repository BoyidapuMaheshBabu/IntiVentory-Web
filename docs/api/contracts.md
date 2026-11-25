# API Contracts

*To be defined when API layer is implemented.*

## Planned Endpoints (Future)

### Authentication
- Already handled by Supabase Auth client directly

### Inventory (Future)
- `GET /inventory/items` — List household items
- `POST /inventory/items` — Create item
- `PATCH /inventory/items/:id` — Update item
- `DELETE /inventory/items/:id` — Archive/delete item

### Stock Movements (Future)
- `POST /inventory/movements` — Add stock
- `POST /inventory/movements` — Use stock
- `GET /inventory/movements` — Transaction history

### Expenses (Future)
- `GET /expenses` — List expenses
- `POST /expenses` — Record expense (inventory-linked)
- `GET /expenses/summary` — Category/monthly totals

## Conventions

- RESTful JSON
- Supabase RLS for authorization
- Zod schemas for validation
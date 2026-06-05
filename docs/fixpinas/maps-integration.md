# Maps Integration

> Google Maps JS API for the picker + Google Geocoding API for reverse geocoding. **Server-proxied. Never expose the key in the client bundle.**

## What we use Google Maps for

| Use | API |
|---|---|
| Show map picker on report submission | Maps JavaScript API |
| Convert lat/lng → province + municipality + address text | Geocoding API (reverse geocoding) |
| Show report location on detail page | Static Maps API (single image, no JS) |
| Show report list on a map (Phase 5+) | Maps JavaScript API |

## API key handling

Two separate keys, both stored in `.env.local`:

| Key | Used by | Restrictions |
|---|---|---|
| `GOOGLE_MAPS_SERVER_KEY` | Next.js API routes (server-only) | IP-restricted to Vercel deployment IPs + localhost |
| `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` | Maps JS in browser | HTTP referrer restricted to fixpinas.com + localhost, scoped to Maps JS API only |

The browser key is intentionally weaker — it can only render maps, not geocode. All geocoding goes through the server.

## Reverse geocoding flow

User picks a location → frontend gets `(lat, lng)` → calls `/api/geocode/reverse` → server uses `GOOGLE_MAPS_SERVER_KEY` → returns:

```ts
type ReverseGeocodeResult = {
  address_text: string;        // formatted address
  province: { name: string; psgc_match?: string };
  municipality: { name: string; type: 'city' | 'municipality' };
  components: GoogleAddressComponent[]; // raw, for debugging
};
```

Server logic (`src/app/api/geocode/reverse/route.ts`):
1. Call Google Geocoding API with `latlng=${lat},${lng}`
2. Extract `administrative_area_level_1` → province name
3. Extract `administrative_area_level_2` → municipality name
4. Match province name against `provinces` table (use slug + fuzzy match for naming variants like "Davao del Sur" vs "Davao Del Sur")
5. Upsert municipality:
   ```sql
   insert into municipalities (province_id, name, type)
   values ($1, $2, $3)
   on conflict (province_id, name) do nothing
   returning id;
   ```
6. Return resolved IDs to the client

## Province name matching

Google returns names in slightly different formats. We normalize:

```ts
function matchProvince(googleName: string): Province | null {
  const normalized = googleName.toLowerCase().replace(/[^a-z]/g, '');
  return provinces.find(p => 
    p.slug.replace(/-/g, '') === normalized
    || p.name.toLowerCase().replace(/[^a-z]/g, '') === normalized
  );
}
```

If no match: log to `unmatched_province_lookups` table (Phase 4+ debug table) and return `null`. Report submission can still proceed with `province_id = null`, but it lands in the unrouted queue.

## Map picker UX (Phase 2)

`<ReportLocationPicker>` client component:
1. On mount, requests browser geolocation (`navigator.geolocation.getCurrentPosition`)
2. Shows map centered on user's GPS
3. User can drag the pin to refine
4. On confirm, fires `/api/geocode/reverse` to populate `address_text`, `province_id`, `municipality_id`
5. Shows the resolved address for confirmation
6. Submit button disabled until reverse geocoding succeeds

Fallback if browser geolocation denied:
- Show map centered on user's known region (from IP or last submission)
- Require manual pin placement

## Cost management

Google Maps pricing (as of 2026 — verify before launch):
- Maps JS loads: $7/1k loads
- Geocoding: $5/1k requests
- Static Maps: $2/1k images

Defenses:
- Cache reverse geocoding results in `reports.address_text` — never re-geocode an existing report
- Debounce map drag events — only geocode on pin release, not while dragging
- Static Maps API for detail pages (cheaper than embedding live JS map)
- Set Google Cloud daily budget alerts at $5 / $20 / $50

Phase 5+: explore Mapbox or OpenStreetMap as a cheaper alternative if Google costs balloon.

## Offline / poor connectivity

The Philippines has variable mobile signal. Mitigations:
- Photo capture works offline (held in IndexedDB)
- Location capture works offline (browser GPS doesn't need network)
- Reverse geocoding requires network — if it fails, store the report locally and retry on reconnect (Phase 4+)
- Show clear "saved locally, will submit when you're back online" message

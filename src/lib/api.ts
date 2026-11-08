/**
 * Krishi Saarthi API Client
 * Automatically connects to Render production backend in deployment,
 * or localhost:8000 during local development.
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.port !== '5173'
    ? window.location.origin
    : 'http://127.0.0.1:8000')
).replace(/\/$/, '');


export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: String(err) };
  }
}

export async function predictDisease(imageFile: File) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${API_BASE_URL}/api/v1/predict/disease`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Disease analysis failed: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function predictCropRecommendation(params: {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph_level: number;
  rainfall_mm: number;
  temperature_c: number;
  humidity_pct: number;
}) {
  const res = await fetch(`${API_BASE_URL}/api/v1/predict/crop-recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Crop recommendation failed: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function fetchMandiRates(state?: string) {
  const url = state
    ? `${API_BASE_URL}/api/v1/mandi/rates?state=${encodeURIComponent(state)}`
    : `${API_BASE_URL}/api/v1/mandi/rates`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch mandi rates: HTTP ${res.status}`);
  return await res.json();
}

export async function fetchMarketplaceListings(category?: string) {
  const url = category && category !== 'all'
    ? `${API_BASE_URL}/api/v1/marketplace/listings?category=${encodeURIComponent(category)}`
    : `${API_BASE_URL}/api/v1/marketplace/listings`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch marketplace listings: HTTP ${res.status}`);
  return await res.json();
}

export async function createMarketplaceOrder(orderPayload: {
  listing_id?: number;
  buyer_name: string;
  buyer_phone: string;
  delivery_address: string;
  pin_code: string;
  quantity_quintals: number;
  payment_mode: 'COD' | 'RAZORPAY';
  payment_id?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/v1/marketplace/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Order placement failed: HTTP ${res.status}`);
  }
  return await res.json();
}


# 🌾 Krishi Saarthi (कृषि सारथी) — Enterprise AI Agritech Platform

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/anshmishra185/smart-crop)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/anshmishra185/smart-crop)

An enterprise-grade precision agriculture and APMC mandi trading terminal built with **React 19**, **FastAPI**, **SQLAlchemy**, and **Scikit-Learn/ResNet AI models**.

---

## ⚡ Instant Cloud Deployment

### 1. Backend Microservice + Cloud PostgreSQL (Render)
Click the button below to provision the **FastAPI Web Service** and **Managed Cloud PostgreSQL Database** automatically via the included `render.yaml` Blueprint:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/anshmishra185/smart-crop)

### 2. Frontend Web Terminal (Netlify)
Click the button below to build and deploy the React 19 Frontend on Netlify's global edge network:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/anshmishra185/smart-crop)

*Note: In Netlify Site Settings > Environment Variables, add `VITE_API_URL` pointing to your Render backend URL.*

---

## 🌟 Core Architecture & Features

1. **AI Vision Crop Disease Diagnosis**:
   - 38-class CIB&RC pathology classifier with lesion severity estimation.
   - Dual curative chemical prescription and biological bio-control remedies (Trichoderma, Pseudomonas).

2. **Agronomic Soil & Crop Recommendation**:
   - Multi-variable matching on Soil N-P-K mineral levels, pH buffering, seasonal rainfall, temperature, and humidity.
   - Yield projection (q/acre) and estimated gross margins (₹/acre).

3. **APMC Mandi Marketplace & Dual Escrow**:
   - Verified farmer lot listings with cryptographic SHA-256 batch hashes (`KS-APMC-...`).
   - Dual settlement gateways: **Razorpay Online Escrow** and **Cash on Delivery (COD)**.

4. **Real-Time APMC Mandi Rate Telemetry**:
   - Live modal prices, MSP benchmarks, and 7-day predictive curves across North Indian mandis.

---

## 💻 Local Development

Run both the Frontend and Backend simultaneously with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173/](http://localhost:5173/)
- **Backend Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Telemetry**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

## 🧪 Automated Testing

Run the full Python test suite covering database persistence, ML vision diagnosis, crop suitability, and order escrow:

```bash
python -m pytest backend/tests/test_backend.py -v
```

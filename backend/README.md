# backend

.NET 11 Web API, Onion mimarisi (Domain → Application → Infrastructure / Persistence → WebAPI) ve PostgreSQL 19.

Henüz iskelet kurulmadı. Kurallar:

- Repo public: bağlantı cümlesi, OAuth secret, JWT anahtarı gibi hiçbir sır commit edilmez.
  Hepsi ortam değişkenlerinden okunur; repoda yalnızca yer tutucu değerli `.env.example` bulunur.
- PostgreSQL yalnızca docker ağı içinde erişilebilir, dışarıya port açılmaz.

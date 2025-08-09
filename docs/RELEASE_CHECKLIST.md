# Crowe Logic™ — MPDET Release Checklist
- [ ] Secrets set in GitHub (CLX_API_KEY, CLX_LICENSE_SECRET, INFLUX_TOKEN, GF_SECURITY_ADMIN_PASSWORD)
- [ ] CI green on main; Trivy scan clean (no critical/high)
- [ ] SBOM generated (make sbom) and attached to tag/release
- [ ] docker-compose.prod.yml verified in staging
- [ ] License bundling smoke: clx license-bundle demo_partner R&D --term-years 5
- [ ] API /health, /api/bootstrap/files (with key), /api/ei/alert-sim tested
- [ ] Grafana reachable; admin password rotated
- [ ] README updated with version & date

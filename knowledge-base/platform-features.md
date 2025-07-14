# CroweOS Platform Features

## 1. Live Telemetry & "Grow-room Health" Dashboard
- **Sensor Integration**: Temp, RH, CO₂, VOC, light from low-cost MycoSoft or AC Infinity probes
- **Visual Indicators**: Auto-flags out-of-range values with red/yellow/green tiles
- **Historical Data**: "Drill-in" charts for last 24h, 7d, 30d with CSV export
- **Offline Capability**: Edge-mode cache keeps recording even if Wi-Fi drops

## 2. Substrate & Batch Builder
- **Species Templates**: Auto-loads proven substrate recipes (e.g., 50% sawdust / 50% soy hull for lion's mane)
- **Customization**: Sliders for bag size, hydration %, supplements
- **Auto-Calculations**: Water, dry mix and sterilisation cycle calculations
- **Traceability**: Saves as CroweLayer™ recipe for complete batch tracking

## 3. Batch Timeline + QR-Code Traceability
- **Workflow Management**: Drag-and-drop Kanban (Soak → Bag → Sterilise → Colonise → Fruit → Harvest)
- **Documentation**: Each card holds photos, notes, sensor snapshots and mini-SOP
- **Quality Assurance**: QR sticker links to batch log for quality assurance or chef marketing

## 4. AI Decision Assistant ("Crowe Logic")
- **Predictive Alerts**: Contamination alerts based on moisture %, PSI, colonisation speed vs. historical failures
- **Yield Optimization**: Suggests tweaks (e.g., "cut soy hulls to 40% for Phoenix oyster in >26°C rooms")
- **Transparency**: JSON explanation tree shows why alerts fired and which variables mattered

### Example Decision Logic
```json
{
  "if": "CO2 > 1500 ppm AND species = 'Pleurotus eryngii'",
  "then": "Risk: tall stems / tiny caps",
  "action": "Increase FAE to 8 air-exchanges·h⁻¹ or drop block count by 15%"
}
```

## 5. SOP & Protocol Library
- **Smart Search**: Searchable by tag: [PHASE] Fruiting, [SUBSTRATE] MastersMix, [PROBLEM] Trichoderma
- **Multi-Format**: One-page "quick cards" + long-form guides + embedded video
- **Version Control**: Team always sees latest revision and Knowledge-Delta since last login

## 6. Inventory & Task Automation
- **Stock Management**: Track bags, grain, supplements with low-stock alerts
- **Purchasing Integration**: Alerts tie into purchasing API
- **Automated Scheduling**: Recurring tasks (shake spawn day 7, cold-shock shiitake day 60) to calendar/Slack

## 7. Sales, COA & Margin Snapshot
- **Efficiency Tracking**: Record harvest weight → auto-compute biological efficiency
- **Customer Management**: Tap-to-invoice restaurants or farmers-market customers
- **Quality Documentation**: Batch QR opens COA / harvest date / recipe ideas

## 8. Community & Training Hub
- **Peer Support**: Built-in chat for photo-based crowd-diagnosis
- **AI Assistant**: "Ask-the-AI" pulls from private SOPs first, then wider library
- **Knowledge Sharing**: Community-driven problem solving

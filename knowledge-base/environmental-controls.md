# Environmental Controls - CO₂ Management

## CO₂ Set-Points and Alert Bands

### Updated Alert Bands & Dashboard Colours

| Phase      | Green (OK)    | Yellow (Watch)           | Red (Action)           |
|------------|---------------|--------------------------|------------------------|
| Fruiting   | 400–600 ppm  | 350–399 ppm / 601–800 ppm | <350 ppm or >800 ppm |
| Colonise   | ≤1,000 ppm   | 1,001–1,500 ppm         | >1,500 ppm            |
| Incubate   | ≤1,200 ppm   | 1,201–1,800 ppm         | >1,800 ppm            |

### Alert System Rules
- UI tiles flip colour instantly when crossing a band
- Alerts push after 3 min sustained breach to avoid flapping
- Edge firmware (ESP32) pushes co2_target=500 property with every MQTT packet

## Decision Tree - CO₂ Control

### High Priority (Fruiting Phase Out of Range)
```json
{
  "if": "phase = 'Fruiting' AND (co2_ppm < 400 OR co2_ppm > 600)",
  "then": {
    "severity": "HIGH",
    "action": [
      "Verify fan/FAE cycle timer",
      "Run fresh-air exchange for +2 min now",
      "Retest CO₂ after 10 min"
    ],
    "escalate": "If CO₂ not in 400-600 ppm after 3 cycles → open intake damper 10%"
  }
}
```

### Medium Priority (Fruiting Phase Watch Zone)
```json
{
  "else_if": "phase = 'Fruiting' AND co2_ppm BETWEEN 601 AND 800",
  "then": {
    "severity": "MEDIUM",
    "action": ["Increase FAE by 10%", "Schedule follow-up reading in 30 min"]
  }
}
```

### Low Priority (Fruiting Phase Minor Adjustment)
```json
{
  "else_if": "phase = 'Fruiting' AND co2_ppm BETWEEN 350 AND 399",
  "then": {
    "severity": "LOW",
    "action": ["Slightly reduce FAE (-5%) to avoid desiccation"]
  }
}
```

## CroweLayer Tag Example
```
[MUSHROOM] Lion's Mane
[PHASE] Fruiting
[ALERT] CO2_HIGH
[CO2_SETPOINT] 400–600 ppm
[AUTOMATION] HVAC-02
```

## Technical Implementation

### TelemetryFrame Validation Rule (v1.2)
```json
{
  "field": "co2_ppm",
  "phase": "Fruiting",
  "must_be_between": [400, 600],
  "on_violation": "flag: CO2_OUT_OF_RANGE"
}
```

### System Updates
- Alert engine references new 400-600 ppm look-up table
- Explainable AI contamination-risk model retrained with capped CO₂ feature (values clamped at 600 ppm when phase = Fruiting)
- Offline logic matches cloud rules for consistent behavior

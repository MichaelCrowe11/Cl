# Substrate Recipes & Species Guidelines

## Lion's Mane (Hericium erinaceus)

### Standard Substrate Recipe
- **Composition**: 50% hardwood sawdust + 50% soy hulls
- **Hydration**: 60%
- **Supplements**: Optional nitrogen boost for faster colonization

### Environmental Parameters
- **Colonization**: 65-75°F, High humidity, CO₂ <1,500 ppm
- **Fruiting**: 55-65°F, 85-95% humidity, CO₂ 400-600 ppm
- **FAE Requirements**: 4-6 air exchanges per hour during fruiting

### CroweLayer Tag Example
```
[MUSHROOM] Lion's Mane (Hericium erinaceus)
[SUBSTRATE] 50/50 HW sawdust + soy hulls
[HYDRATION] 60%
[PHASE] Incubation – day 12
[ALERT] CO₂ 1800 ppm – FAE ↑
```

## Phoenix Oyster (Pleurotus pulmonarius)

### High-Temperature Adaptation
- **Temperature Tolerance**: Performs well in >26°C rooms
- **Substrate Adjustment**: Reduce soy hulls to 40% in warm conditions
- **Reason**: Prevents over-aggressive growth that leads to poor formation

## Shiitake (Lentinula edodes)

### Cold-Shock Protocol
- **Timing**: Day 60 of colonization cycle
- **Method**: Temperature drop to 45-50°F for 24-48 hours
- **Purpose**: Triggers pinning and improves fruit quality

## Pleurotus eryngii (King Oyster)

### CO₂ Sensitivity Alert
```json
{
  "if": "CO2 > 1500 ppm AND species = 'Pleurotus eryngii'",
  "then": "Risk: tall stems / tiny caps",
  "action": "Increase FAE to 8 air-exchanges·h⁻¹ or drop block count by 15%"
}
```

## General Substrate Guidelines

### Master's Mix Base
- Commonly referenced in SOP library
- Versatile substrate for multiple species
- Tag searchable as [SUBSTRATE] MastersMix

### Sterilization Protocols
- Auto-calculated based on substrate composition and bag size
- Integrated with batch builder for consistent results
- Temperature and pressure cycles optimized per recipe

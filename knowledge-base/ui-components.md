# UI Components & Technical Specifications

## CO₂ Monitoring Tile

### Component Overview
Real-time CO₂ monitoring with visual indicators, trend analysis, and alert integration.

### Technical Specifications
```typescript
interface CO2TileProps {
  /** Latest CO₂ reading in ppm */
  value: number;
  /** Min set‑point (ppm) */
  targetMin: number;
  /** Max set‑point (ppm) */
  targetMax: number;
  /** Last N telemetry points for sparkline (ordered oldest→newest) */
  history: TelemetryPoint[];
  /** Severity band – 'OK' | 'WARN' | 'ALERT'  */
  severity: "OK" | "WARN" | "ALERT";
  /** Optional: timestamp of latest alert */
  lastAlertTs?: string;
}
```

### Visual Design Elements
- **Circular Progress Ring**: Shows current value relative to target range
- **Color Coding**: Green (OK), Yellow (Watch), Red (Action)
- **Sparkline**: Historical trend visualization
- **Numeric Display**: Large, clear current reading
- **Alert Indicators**: Icon-based status communication

### Color Mapping
```typescript
const ringColor: Record<CO2TileProps["severity"], string> = {
  OK: "stroke-green-500",
  WARN: "stroke-yellow-400", 
  ALERT: "stroke-red-500",
};
```

### Animation Features
- Smooth ring transitions with easeInOut timing
- Alert state changes with fade in/out effects
- Sparkline updates with real-time data
- Badge animations for status changes

## Dashboard Layout Principles

### Tile System
- **Consistent Sizing**: 48x64 grid units for uniform layout
- **Responsive Design**: Adapts to different screen sizes
- **Information Hierarchy**: Critical data prominently displayed
- **Quick Scanning**: Color-coded status at a glance

### Data Visualization
- **Real-time Updates**: Live sensor feed integration
- **Historical Context**: Trend information for decision making
- **Alert Integration**: Immediate notification of out-of-range conditions
- **Export Capability**: CSV download for detailed analysis

## Telemetry Integration

### Data Structure
```typescript
interface TelemetryPoint {
  ts: string; // ISO timestamp
  value: number;
}
```

### Update Frequency
- **Live Data**: 30-second intervals during active monitoring
- **Historical Storage**: 24h, 7d, 30d retention periods
- **Alert Timing**: 3-minute sustained breach before notification
- **Offline Caching**: Edge-mode data retention during connectivity loss

## CroweLayer Tag System

### Visual Implementation
- **Compact Format**: Badge-style display for space efficiency
- **Color Coding**: Consistent with alert severity levels
- **Searchable**: Tag-based filtering and organization
- **Dynamic Updates**: Real-time status reflection

### Example Tag Display
```
[MUSHROOM] Lion's Mane
[PHASE] Fruiting  
[ALERT] CO2_HIGH
[CO2_SETPOINT] 400–600 ppm
[AUTOMATION] HVAC-02
```

## Interactive Elements

### Click Actions
- **Drill-down**: Access detailed historical charts
- **Alert Management**: Acknowledge or snooze notifications
- **Manual Override**: Emergency control access
- **Export Functions**: Data download and sharing

### Touch Interfaces
- **Gesture Support**: Swipe for timeline navigation
- **Responsive Touch**: Large tap targets for mobile use
- **Haptic Feedback**: Confirmation for critical actions
- **Accessibility**: Screen reader and keyboard navigation support

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load historical data on demand
- **Data Compression**: Efficient telemetry transmission
- **Caching**: Local storage for frequently accessed data
- **Progressive Enhancement**: Core functionality without JavaScript

### Browser Compatibility
- **Modern Standards**: ES2020+ features with polyfills
- **Mobile Responsive**: Touch-optimized interactions
- **Offline Capability**: Service worker for offline access
- **Performance Metrics**: Core Web Vitals optimization

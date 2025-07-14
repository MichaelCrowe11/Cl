# CroweOS Logo System Documentation

## Brand Hierarchy

### 1. **Crowe Logic AI** (Product Level)
- **Logo File**: `crowe-avatar.png`
- **Usage**: Mycology research platform, AI chat interfaces, user avatars
- **Colors**: CroweOS Purple (#332057) with Gold accents (#C6A351)
- **Context**: Specific AI product within the CroweOS ecosystem

### 2. **CroweOS Systems** (Platform Level)
- **Logo Files**: 
  - `croweos1.png` - Art-Deco Monogram (favicons, small sizes)
  - `croweos2.png` - Crown/Wordmark (presentations, headers)
  - `croweos3.png` - Rounded Emblem (UI icons, modern interfaces)
- **Usage**: Platform branding, system-wide headers, corporate materials
- **Colors**: Official CroweOS brand palette
- **Context**: Enterprise platform encompassing multiple products

## Component Usage Guide

### For Crowe Logic AI:
```tsx
import { CroweLogicAvatar, CroweLogicHeaderLogo, CroweAutoLogo } from '@/components/croweos-logo-system'

// Chat avatars, user profiles
<CroweLogicAvatar size={32} />

// Navigation headers
<CroweLogicHeaderLogo showText={true} />

// Auto-selection for Crowe Logic AI
<CroweAutoLogo context="chat" brand="crowe-logic" />
```

### For CroweOS Systems:
```tsx
import { CroweOSLogo, CroweOSAvatar, CroweOSHeaderLogo, CroweAutoLogo } from '@/components/croweos-logo-system'

// Platform logos with variants
<CroweOSLogo variant="logo1" size="lg" showText={true} />

// System avatars
<CroweOSAvatar variant="logo2" size={48} />

// Platform headers
<CroweOSHeaderLogo variant="logo2" showText={true} />

// Auto-selection for CroweOS Systems
<CroweAutoLogo context="header" brand="croweos-systems" />
```

## Logo Decision Tree

### Size-Based Selection:
- **< 64px**: Use Art-Deco Monogram (`croweos1.png` or `crowe-avatar.png`)
- **64-128px**: Use appropriate brand logo
- **> 128px**: Use Crown/Wordmark (`croweos2.png`) for presentations

### Context-Based Selection:
- **Chat/AI Interfaces**: Always use `crowe-avatar.png` for Crowe Logic AI
- **Platform Headers**: Use `croweos2.png` (Crown/Wordmark)
- **Favicons**: Use `croweos1.png` (Art-Deco Monogram)
- **Modern UI**: Use `croweos3.png` (Rounded Emblem)
- **Corporate/Presentations**: Use `croweos2.png` (Crown/Wordmark)

## Brand Colors (Tailwind Classes)

```tsx
// Primary colors
text-croweos-purple    // #332057 - Royal Purple
text-croweos-gold      // #C6A351 - Deep Gold
text-croweos-lilac     // #7F6BAA - Soft Lilac
text-croweos-charcoal  // #17141E - Obsidian Charcoal

// Background colors
bg-croweos-purple
bg-croweos-gold
bg-croweos-lilac
bg-croweos-charcoal

// Ring/border colors
ring-croweos-gold/30   // Gold ring with 30% opacity
border-croweos-purple
```

## Implementation Examples

### Current Platform Usage:
1. **Chat Interface**: Uses `crowe-avatar.png` for Crowe Logic AI responses
2. **Navigation**: Can use either brand depending on context
3. **Landing Page**: Should use CroweOS Systems branding
4. **Product Pages**: Use Crowe Logic AI branding for specific products

### Migration Guide:
- Keep all existing `crowe-avatar.png` references for Crowe Logic AI
- Use new CroweOS logos for platform-level branding
- Update headers and navigation based on context
- Maintain consistency within each product area

## File Structure:
```
public/
├── crowe-avatar.png          # Crowe Logic AI (always use for AI product)
├── croweos1.png             # CroweOS Art-Deco Monogram
├── croweos2.png             # CroweOS Crown/Wordmark
├── croweos3.png             # CroweOS Rounded Emblem
└── favicon.svg              # Uses monogram design
```

This system maintains clear brand hierarchy while providing flexibility for different contexts and use cases.

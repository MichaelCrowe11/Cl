# CroweOS Systems Logo Usage Guidelines

## 🎯 **Official Logo Usage Policy**

### **CroweOS Systems Branding**
**Use ONLY the official CroweOS Systems logos for system/platform branding:**

#### **Available Official Variants:**
1. **Circle with Mycelium Pattern** (`official-circle`)
   - File: `croweos-systems-official-circle.png` 
   - Usage: Main platform headers, navigation, system branding
   - Best for: Navigation bars, headers, official documentation

2. **Minimal Concentric Circles** (`official-minimal`) 
   - File: `croweos-systems-official-minimal.png`
   - Usage: Compact spaces, secondary branding, IDE headers
   - Best for: Small UI elements, loading states, compact layouts

#### **Implementation Example:**
```tsx
// ✅ CORRECT - CroweOS Systems branding
<CroweLogo 
  variant="official-circle"
  size={40}
  systemBranding={true}  // Required flag
/>

// ✅ CORRECT - Minimal variant
<CroweLogo 
  variant="official-minimal"
  size={32}
  systemBranding={true}
/>
```

---

### **Crowe Logic AI Branding**
**Use ONLY crowe-avatar.png for Crowe Logic AI assistant:**

#### **Available Components:**
1. **CroweLogicAvatar** - Primary avatar component
2. **CroweLogicAvatarCompact** - For chat bubbles and inline usage

#### **Implementation Example:**
```tsx
// ✅ CORRECT - Crowe Logic AI avatar
<CroweLogicAvatar 
  size={40}
  variant="circle"
  showText={true}
/>

// ✅ CORRECT - Compact version for chat
<CroweLogicAvatarCompact size={24} />
```

---

## 🚫 **What NOT to Use**

### **Deprecated/Legacy Options:**
- ❌ `variant="image"` - Legacy option, do not use for new implementations
- ❌ Generic gradient circles/placeholders
- ❌ Mixing Crowe Logic avatar with CroweOS Systems branding
- ❌ Using CroweOS Systems logos for AI assistant contexts

---

## 📍 **Current Implementation Status**

### **Updated Components:**
- ✅ `navigation-bar.tsx` - Uses official CroweOS Systems logo
- ✅ `professional-landing-page.tsx` - Uses official CroweOS Systems logo  
- ✅ `crowe-logic-chat-interface.tsx` - Uses Crowe Logic avatar
- ✅ `crowe-logic-ide.tsx` - Uses both appropriately

### **Component Files:**
- 📁 `components/crowe-logo.tsx` - CroweOS Systems logo system
- 📁 `components/crowe-logic-avatar.tsx` - Crowe Logic AI avatar system

### **Asset Files:**
- 🖼️ `public/croweos-systems-official-circle.png` - Primary CroweOS logo
- 🖼️ `public/croweos-systems-official-minimal.png` - Minimal CroweOS logo  
- 🖼️ `public/crowe-avatar.png` - Crowe Logic AI avatar (DO NOT CHANGE)

---

## 🎨 **Visual Identity Rules**

### **CroweOS Systems:**
- **Colors:** Royal purple (#6B46C1) and golden accent (#F59E0B)
- **Typography:** Bold, technical, system-focused
- **Context:** Platform features, system capabilities, enterprise branding

### **Crowe Logic AI:**
- **Colors:** Purple-to-blue gradient, green activity indicators
- **Typography:** Friendly, approachable, assistant-focused  
- **Context:** Chat interactions, AI responses, knowledge assistance

---

## 🔄 **Migration Notes**

If you encounter legacy implementations:

1. **Replace** `variant="image"` with `variant="official-circle"` + `systemBranding={true}`
2. **Replace** generic Brain icons with `CroweLogicAvatar` for AI contexts
3. **Ensure** proper context separation (Systems vs AI branding)

---

## ✅ **Quick Reference**

| Context | Component | Variant | Required Props |
|---------|-----------|---------|----------------|
| Platform Header | `CroweLogo` | `official-circle` | `systemBranding={true}` |
| IDE Header | `CroweLogo` | `official-minimal` | `systemBranding={true}` |
| AI Chat Header | `CroweLogicAvatar` | `circle` | - |
| Chat Messages | `CroweLogicAvatarCompact` | - | `size={24}` |

---

**Last Updated:** July 13, 2025  
**Maintained by:** CroweOS Systems Development Team

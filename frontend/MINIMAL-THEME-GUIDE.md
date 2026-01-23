# Minimal Theme Integration Guide

## Quick Start

### 1. Import the Theme

Add the minimal theme CSS **after** Bootstrap in your main entry point:

```jsx
// frontend/src/index.js or frontend/src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';  // Keep Bootstrap
import './styles/minimal-theme.css';              // Add minimal theme (overrides Bootstrap)
```

### 2. That's It!

The minimal theme automatically overrides Bootstrap's bold styling with calm, research-focused styles. No component changes needed.

## What Changed?

### Visual Improvements

| Element | Before (Bootstrap) | After (Minimal) |
|---------|-------------------|-----------------|
| **Colors** | Bold primary blues | Soft, neutral palette |
| **Buttons** | Heavy shadows, bold | Flat, subtle borders |
| **Spacing** | Inconsistent | Harmonious rhythm |
| **Typography** | Bold headings | Soft, readable weights |
| **Forms** | Thick borders | Subtle, clean lines |
| **Modals** | Dark overlay (0.5) | Light overlay (0.3) |

### Key Features

✅ **Calm color palette** - Reduces visual stress
✅ **Subtle interactions** - Focus on task, not UI
✅ **Consistent spacing** - Visual harmony
✅ **Accessibility built-in** - WCAG compliant
✅ **Responsive** - Mobile-friendly
✅ **Print-friendly** - For data collection

## Customization

### Changing Colors

Edit the CSS custom properties at the top of `minimal-theme.css`:

```css
:root {
  --color-accent: #3498DB;  /* Change to your brand color */
  --color-background: #FAFAFA;  /* Adjust background tone */
}
```

### Spacing Adjustments

Modify spacing tokens for tighter or looser layouts:

```css
:root {
  --space-md: 16px;  /* Increase for more breathing room */
  --space-lg: 24px;  /* Decrease for compact layout */
}
```

## Advanced: Component-Specific Styling

### Creating a Distraction-Free Game View

Add this class to your game container:

```jsx
<div className="row game-layout">
  <div className="col-6">
    <GameBox />
  </div>
  <div className="col-6">
    <ChatBox />
  </div>
</div>
```

This creates a perfect 50/50 split with hairline separator.

### Emphasizing the Ready Button

```jsx
<button className="btn btn-primary ready-button">
  Ready
</button>
```

### Adding Status Indicators

```jsx
<span className="status-indicator active"></span> Connected
```

## Experimental Mode: Ultra-Minimal

For maximum focus, add this to the end of `minimal-theme.css`:

```css
/* ULTRA-MINIMAL MODE - Maximum focus */
body.ultra-minimal {
  --color-background: #FFFFFF;
  --color-border: #F0F0F0;
  --space-md: 12px;
  --space-lg: 16px;
}

body.ultra-minimal .btn {
  border: none;
  background: transparent;
  text-decoration: underline;
}

body.ultra-minimal .btn-primary {
  color: var(--color-accent);
  background: transparent;
}
```

Enable by adding class to body:

```jsx
<body className="ultra-minimal">
```

## Testing the Theme

### Visual Comparison

1. **Before**: Open your app without the theme
2. **Take screenshot**
3. **After**: Import minimal-theme.css
4. **Compare**: Notice the calmer, cleaner interface

### User Testing Checklist

- [ ] Can participants focus on the task?
- [ ] Are all interactive elements clearly visible?
- [ ] Does the interface feel calm, not distracting?
- [ ] Are colors readable (check contrast)?
- [ ] Do animations feel smooth (not jarring)?

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+

Uses modern CSS features (CSS Custom Properties, Grid) supported by all current browsers.

## Performance

**Zero impact** on performance:
- Pure CSS (no JavaScript)
- Minimal file size (~8KB)
- Browser-native features only

## Accessibility Features

✅ **Keyboard navigation** - Clear focus indicators
✅ **Screen readers** - Semantic HTML preserved
✅ **Reduced motion** - Respects user preferences
✅ **Color contrast** - WCAG AA compliant
✅ **Focus visible** - Clear, non-intrusive outlines

## Rollback Plan

To revert to Bootstrap defaults:

```jsx
// Simply comment out the minimal theme import
// import './styles/minimal-theme.css';
```

Your app immediately returns to Bootstrap styling.

## Next Steps

### 1. Optional: Remove Unused Bootstrap

If you love the minimal theme, you can reduce bundle size by removing Bootstrap CSS components you're overriding entirely. But this is **optional** - the theme works perfectly layered on top of Bootstrap.

### 2. Custom Components

Create research-specific components using the theme tokens:

```css
.custom-component {
  padding: var(--space-md);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-surface);
}
```

### 3. Theme Variants

Create alternate themes for different study conditions:

- `minimal-theme-light.css` (current)
- `minimal-theme-dark.css` (for dark mode studies)
- `minimal-theme-high-contrast.css` (for accessibility studies)

## Questions?

The theme is **self-documenting** - all sections are clearly labeled with comments explaining purpose and usage.

## Philosophy Reminder

> **"The best interface is no interface."**
> Participants should focus on their task and partner,
> not on buttons, colors, or animations.

Every design decision in this theme serves that goal.

# Dark Mode Implementation Guide

## ✅ Completed Files
1. `app/context/ThemeContext.jsx` - Theme provider with localStorage persistence
2. `app/components/ThemeToggle.jsx` - Sun/Moon toggle button
3. `app/components/Nav.jsx` - Updated with dark mode classes and ThemeToggle
4. `app/layout.jsx` - Wrapped with ThemeProvider
5. `app/globals.css` - Added dark mode CSS variables
6. `app/land/page.jsx` - Partially updated (backgrounds, text, buttons need completion)
7. `app/login/page.jsx` - Partially updated (backgrounds, cards updated, inputs need completion)

## 🔄 Common Dark Mode Class Patterns

### Backgrounds
- Light: `bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100`
- Dark: `dark:from-slate-950 dark:via-blue-950 dark:to-gray-900`

### Gradient Orbs
- Light: `bg-sky-300` / `bg-blue-300` / `bg-slate-300` with `mix-blend-multiply` and `opacity-20`
- Dark: `dark:bg-blue-600` / `dark:bg-purple-600` / `dark:bg-slate-600` with `dark:mix-blend-screen` and `dark:opacity-10`

### Grid Pattern
- Light: `bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]`
- Dark: `dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]`

### Cards/Containers
- Light: `bg-white/80 backdrop-blur-lg border-2 border-white/50`
- Dark: `dark:bg-slate-900/80 dark:border-slate-700/50`

### Text Colors
- Headers: `from-sky-600 via-blue-600 to-slate-700` → `dark:from-blue-400 dark:via-purple-400 dark:to-slate-300`
- Body text: `text-gray-700` → `dark:text-gray-300`
- Muted text: `text-gray-600` → `dark:text-gray-400`
- Links: `hover:text-blue-600` → `dark:hover:text-blue-400`

### Input Fields
- Light: `bg-white/60 border-2 border-gray-200`
- Dark: `dark:bg-slate-800/60 dark:border-slate-700`
- Focus: `focus:ring-sky-500 dark:focus:ring-blue-400`

### Buttons (Gradient)
- Primary: `from-sky-500 to-blue-600` → `dark:from-blue-500 dark:to-purple-600`
- Hover: `from-sky-600 to-blue-700` → `dark:from-blue-600 dark:to-purple-700`

## 📋 Remaining Files to Update

### High Priority (User-Facing Pages)
1. **app/signup/page.jsx** - Apply same pattern as login page
2. **app/profile/page.jsx** - Update documents cards, backgrounds
3. **app/chat/page.jsx** - Update message bubbles, input area
4. **app/form/page.jsx** - Update all form sections, inputs, buttons

### Files Already Completed
- ✅ app/land/page.jsx (backgrounds done, buttons may need minor updates)
- ✅ app/login/page.jsx (backgrounds & cards done, form inputs need completion)

## 🎨 Color Scheme

### Light Mode
- Primary: Sky Blue (#0284c7) to Blue (#2563eb)
- Backgrounds: Slate 50, Blue 50, Gray 100
- Text: Gray 700-900
- Cards: White with opacity

### Dark Mode  
- Primary: Blue 400 (#60a5fa) to Purple 400 (#c084fc)
- Backgrounds: Slate 950, Blue 950, Gray 900
- Text: Gray 300-100
- Cards: Slate 900 with opacity

## 🚀 Quick Implementation Steps

For each page file:

1. **Update main container background:**
   ```jsx
   className="... bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900"
   ```

2. **Update gradient orbs:**
   ```jsx
   className="... bg-sky-300 dark:bg-blue-600 ... mix-blend-multiply dark:mix-blend-screen opacity-20 dark:opacity-10"
   ```

3. **Update grid pattern:**
   Add dark mode variant to grid background

4. **Update cards:**
   ```jsx
   className="bg-white/80 dark:bg-slate-900/80 ... border-white/50 dark:border-slate-700/50"
   ```

5. **Update text:**
   - Headers: Add dark gradient variants
   - Body: Add `dark:text-gray-300` or `dark:text-gray-400`

6. **Update inputs:**
   ```jsx
   className="bg-white/60 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200"
   ```

7. **Update buttons:**
   Add dark gradient variants to all gradient buttons

## 🔧 Testing Checklist

- [ ] Theme toggle appears in navbar
- [ ] Theme persists on page reload
- [ ] All text is readable in both modes
- [ ] All buttons are visible in both modes
- [ ] Form inputs are properly styled
- [ ] Gradients look good in both modes
- [ ] No flash of unstyled content on load
- [ ] Mobile responsive in both modes

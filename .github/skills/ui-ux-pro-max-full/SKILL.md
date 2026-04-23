---
name: ui-ux-pro-max-full
description: 'Comprehensive UI/UX design intelligence for web and mobile interfaces. Use when designing screens, refactoring components, choosing style/color/typography, improving accessibility/usability, and making product-level visual interaction decisions.'
argument-hint: 'Context: product type, audience, platform, style keywords, constraints, screen or component goal.'
user-invocable: true
disable-model-invocation: false
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications.

Use this skill to produce professional, accessible, and production-ready UI decisions with clear product reasoning.

## When to Apply

Apply this skill when working on:
- UI components or full screens
- New pages (landing page, dashboard, SaaS, mobile app)
- Color, typography, spacing, layout, and responsiveness
- UI/UX quality reviews and accessibility checks
- Navigation, feedback, motion, and interaction behavior
- Clarity, usability, and perceived quality improvements

## Must Use

This skill must be used when:
- Designing or refactoring UI
- Creating components (buttons, modals, forms, tables, charts)
- Making product-level design decisions
- Fixing UX or usability problems

## Skip

Do not use this skill for:
- Backend-only logic
- API or database work
- DevOps or infrastructure tasks
- Non-visual scripts

## Decision Rule

If the task changes how something looks, feels, moves, or is interacted with, apply this skill.

## Priority Order

Apply rules in this exact order:
1. Accessibility (critical)
2. Touch and interaction (critical)
3. Performance (high)
4. Style selection (high)
5. Layout and responsive behavior (high)
6. Typography and color (medium)
7. Animation (medium)
8. Forms and feedback (medium)
9. Navigation patterns (high)
10. Charts and data (low)

## Mandatory Workflow

### Step 1 - Analyze requirements
Capture:
- Product type
- Audience
- Style keywords
- Platform (web, mobile, both)
- Functional and business constraints

### Step 2 - Define design system
Specify:
- Visual style direction
- Semantic color tokens
- Typography scale and pairings
- Spacing rhythm (4px or 8px system)
- Core component behavior and states

### Step 3 - Apply rules by priority
Validate from critical to low.
Do not continue to visual refinements until critical checks pass.

### Step 4 - Generate solution
Deliver:
- UI structure
- Component decisions
- Implementation guidance and code if requested

## Output Format

Always structure responses as:
1. Analise
2. Sistema de Design
3. Implementacao
4. Problemas Encontrados
5. Melhorias

## Rules and Anti-Patterns

### 1) Accessibility (critical)
Required:
- Contrast ratio at least 4.5:1 for normal text
- Alt text for meaningful images
- aria-label for icon-only buttons
- Full keyboard navigation support
- Proper heading hierarchy
- Never rely on color alone to convey meaning
- Reduced motion support
- Logical reading and focus order

Anti-patterns:
- Removing focus states
- Icon-only buttons without accessible labels

### 2) Touch and interaction (critical)
Required:
- Minimum touch target size 44x44 px
- Minimum spacing between interactive targets 8 px
- Visible press/tap feedback
- No hover-only critical interaction
- Explicit loading and disabled states
- Avoid gesture conflicts

Anti-patterns:
- Tiny clickable areas
- Instant transitions without perceptible state change

### 3) Performance (high)
Required:
- Prefer WebP or AVIF for images
- Lazy-load non-critical content
- Prevent layout shift (target CLS under 0.1)
- Use skeletons for delayed content
- Minimize main-thread heavy work

Anti-patterns:
- Layout thrashing
- Content jumping during load or interaction

### 4) Style selection (high)
Required:
- Match visual language to product type
- Keep style consistency across pages/components
- Use SVG icon systems
- Maintain unified radius, shadows, and effects
- Align decisions with design system tokens

Anti-patterns:
- Random style mixing
- Emoji as UI iconography

### 5) Layout and responsive (high)
Required:
- Mobile-first approach
- No unintended horizontal scrolling
- Consistent breakpoints
- Spacing system consistency
- Safe-area support where applicable

Anti-patterns:
- Fixed pixel-only layouts
- Disabling zoom in mobile contexts

### 6) Typography and color (medium)
Required:
- Base body text at least 16 px
- Typical line-height near 1.5
- Semantic color tokens instead of hardcoded values
- Maintain readable contrast in all states
- Keep heading and body hierarchy explicit

Anti-patterns:
- Low-contrast gray-on-gray text
- Very small body copy
- Raw hex scattered in components

### 7) Animation (medium)
Required:
- Typical motion duration 150-300 ms
- Prefer transform and opacity for smoother animation
- Motion should communicate state change or hierarchy
- Respect reduced motion preference

Anti-patterns:
- Decorative-only motion everywhere
- Animating layout properties that cause jank

### 8) Forms and feedback (medium)
Required:
- Persistent visible labels
- Errors shown near relevant input
- Helper text when input rules are non-obvious
- Progressive disclosure for complex forms

Anti-patterns:
- Placeholder acting as the only label
- Error summary only at top without field context

### 9) Navigation (high)
Required:
- Predictable and consistent navigation model
- Clear active state
- Bottom navigation with 5 items or fewer when used
- Reliable back behavior

Anti-patterns:
- Overloaded navigation
- Broken or ambiguous navigation flow

### 10) Charts and data (low)
Required:
- Match chart type to data semantics
- Clear legend and labeling
- Accessible color encoding
- Tooltips or value details when needed

Anti-patterns:
- Color-only encoding without shape, labels, or patterns

## Core Principles

- Prioritize UX outcomes over visual novelty
- Keep behavior and visuals consistent
- Prefer clarity over complexity
- Avoid overengineering
- Optimize perceived performance

## Professional UI Rules

- Never use emoji as UI icons
- Use a consistent icon family/system
- Maintain spacing rhythm
- Keep touch targets at least 44x44 px
- Validate contrast in light and dark themes when both exist
- Avoid interaction-driven layout shifts

## Final Validation Checklist

Before final delivery, verify:
- Accessibility is compliant (contrast, semantics, keyboard)
- Touch target sizing is compliant
- Layout shift risks are addressed
- Responsive behavior works across intended breakpoints
- Visual consistency is maintained
- Dark mode contrast is valid when dark mode exists
- No emoji icons are used
- UX flow is clear and predictable

## Behavior Expectations

When this skill is invoked:
- Act as a senior designer plus product thinker
- Justify key decisions briefly and objectively
- Prefer practical production-ready outcomes
- Keep the response concise but complete
- Always answer in Portuguese (pt-BR)
- If requirements are ambiguous, ask focused clarifying questions before implementation

## Critical Enforcement Mode

This skill runs in strict mode.

If any critical item fails, do not finalize the solution as approved.
You must:
- Explicitly flag each failed critical item
- Propose direct corrections
- Return to validation after corrections
- Only mark delivery as final when all critical checks pass

Critical failure gates:
- Accessibility failures
- Touch target and interaction failures
- Broken navigation flow
- Severe layout shift or responsive breakage

## Stack Presets

When code implementation is requested, adapt guidance to the target stack:

### React
- Prefer composable components and semantic HTML
- Use design tokens via CSS variables or theme provider
- Ensure keyboard and aria support in reusable primitives

### Vue
- Keep props/events contracts explicit
- Use scoped styles with shared tokens
- Enforce accessibility in component slots and custom controls

### Angular
- Use standalone components when suitable
- Keep template semantics and ARIA attributes explicit
- Prefer reusable UI primitives over duplicated template logic

### Flutter
- Validate text scale, contrast, and hit areas in widgets
- Use theme extensions and semantic labels
- Avoid layout jumps during async state transitions

### React Native
- Respect platform navigation and back behavior
- Enforce minimum touch targets and spacing
- Use accessible roles/labels and predictable feedback states
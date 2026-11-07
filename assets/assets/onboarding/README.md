# Onboarding Illustrations

This directory contains illustrations for the onboarding flow.

## Requirements

All images should be generated with:
- **Format**: PNG
- **Size**: 800x800px (will be scaled down to 200x200 in UI)
- **Background**: Bright green (#00FF00, RGB 0,255,0) - will be removed programmatically
- **Edges**: Sharp, clean edges - NO anti-aliasing, NO feathering, NO soft edges
- **Style**: Modern 3D illustration, Duolingo-like aesthetic
- **Quality**: High quality, production-ready
- **Important**: No text, no branding, no "FamilyLearn.AI"

## Why Green Screen + Sharp Edges?

- LLMs struggle with transparent PNG but easily generate solid green
- Sharp edges ensure clean chroma key cutout without green halos
- No anti-aliasing = no partially transparent pixels = perfect removal

## Image Prompts for LLM Generation

### 1. Schedule Photo (`schedule.png`)
```
Create a modern 3D illustration in Duolingo's playful style. Show a teenage student's hands holding a smartphone, taking a photo of a paper school schedule/timetable laying on a desk. The schedule has visible text lines and subject names. AI magic sparkles and small stars are floating around the phone screen. Use bright, friendly colors with soft gradients - predominantly blues and purples for the phone, warm yellows for the sparkles. Isometric perspective with subtle shadows. The entire image has a bright green background (#00FF00, pure green screen, RGB 0,255,0). Sharp clean edges with no anti-aliasing or feathering between subject and background. No text or branding. PNG format, 800x800px, high quality, centered composition. Soft, rounded shapes. Cheerful and inviting mood. Production-ready, no technical artifacts.
```

### 2. Learning with AI (`learning.png`)
```
Create a modern 3D illustration in Duolingo's playful style. Show an open textbook or notebook in the center with glowing AI assistant icon (sparkle/star symbol) floating above it. To the left, wireless headphones (for podcasts). To the right, a large checkmark icon (for homework verification). Use bright blues and other vibrant colors as main colors with soft gradients and gentle shadows. Isometric 3D perspective. The entire image has a bright green background (#00FF00, pure green screen, RGB 0,255,0). Sharp clean edges with no anti-aliasing or feathering between subject and background. No text or branding. PNG format, 800x800px, high quality, centered composition. Soft lighting, friendly and encouraging atmosphere. Rounded, approachable shapes. Production-ready, no technical artifacts.
```

### 3. Parent Control (`parent.png`)
```
Create a modern 3D illustration in Duolingo's playful style. Show two smartphones - one slightly smaller (child's) on the left, one larger (parent's) on the right. They are connected by a glowing curved line or arc of light particles. In the center between them, a shield icon with a checkmark represents security and protection. The parent's phone shows a simple dashboard interface with colorful charts or icons. Use warm, trustworthy colors - soft blues, teals, and gentle orange accents. Isometric perspective with soft shadows. The entire image has a bright green background (#00FF00, pure green screen, RGB 0,255,0). Sharp clean edges with no anti-aliasing or feathering between subject and background. No text or branding. PNG format, 800x800px, high quality, centered composition. Reassuring and professional mood with friendly elements. Production-ready, no technical artifacts.
```

## Integration Steps

1. Generate images using LLM (DALL-E, Midjourney, etc.) with prompts above
2. Verify bright green (#00FF00) background is uniform
3. Check edges are sharp and clean (no soft blur)
4. Save images as `schedule.png`, `learning.png`, `parent.png`
5. Place files in this directory
6. Green background will be automatically removed by ChromaKeyImage widget

## Current Status

**Placeholder icons shown until images are generated.**

Green screen removal will happen automatically when images are added.

## Full Documentation

See `/ONBOARDING_IMAGES.md` in repository root for complete guide.

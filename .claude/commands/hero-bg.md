---
description: Inspects a project's hero and generates a guided two-image, one-video AI background workflow with loop-safe prompts and asset delivery steps.
argument-hint: (optional creative direction, e.g. "architectural" or "human-led")
---

# /hero-bg

Create a premium AI-generated hero-background workflow for the current project. This is a **planning and prompt-generation command**: do not generate media, edit application code, clone a repository, install software, or handle an API key.

`$ARGUMENTS` is an optional creative-direction override. Use it only when it fits the project's product, audience, and brand; do not let it override the existing hero's text-safe area or accessibility requirements.

## Procedure

1. Inspect the active homepage and hero implementation. Read the homepage, hero component, imported hero-specific components, theme/brand tokens, product configuration, and any existing hero media in `public/`.

2. Determine:

   - The actual product, primary audience, and landing-page promise.
   - Existing headline, body copy, CTA placement, and the text-safe area they occupy.
   - Desktop and mobile crop behavior, including `object-position`, aspect ratio, breakpoints, overlays, and contrast treatment.
   - Brand palette, typography, visual tone, and any existing creative direction.

3. Build the prompts from the evidence. Do not write a generic "modern SaaS" scene, fake UI, readable code, product logos, brand marks, watermarks, or readable text into a generated image.

4. Use this media model:

   - **Image A** is the hero's master still. It is the only image delivered to `public/` and becomes `hero-poster.avif`.
   - **Image B** is a tightly matched cinematic reference: the same scene, subject, wardrobe/materials, lighting, and text-safe area, with one subtle alternate viewpoint or moment. It is used only to guide the middle of the one generated video.
   - Generate **one** 8-second video. Never instruct the user to generate multiple clips, stitch clips, concatenate clips, or publish Image B.
   - A seamless browser loop requires the video to finish in a composition that closely matches Image A. Image A must therefore be the start-and-end anchor whenever the chosen video UI supports start and end frames. Image B is an additional reference image when supported.
   - If the chosen Kling interface supports only a start and an end frame and no extra reference image, use Image A for both. Do not use Image B as the end frame: a video ending on B cannot loop invisibly back to A.

## Output format

Return output in this exact order. Do not add a third image prompt, alternate video workflow, or extra media files.

### Visual direction

Write exactly 2–4 short sentences. Make the direction specific to the inspected project, its product, brand, audience, existing hero copy, and actual desktop/mobile composition. State how the left/right or central text-safe area stays clean and how the primary subject survives the existing mobile crop.

### Generate it

Give a short numbered guide:

1. Go to [MuAPI](https://muapi.ai/) to create/sign in to an account and obtain access to the selected generation model.
2. Open [Open Generative AI](https://github.com/anil-matcha/open-generative-ai) and use its hosted studio, desktop app, or self-hosted workflow to generate the media.
3. Enter the MuAPI key only in Open Generative AI's documented credential flow. Never paste it into this project's source code, `.env` files, screenshots, or Git history.
4. Generate Image A first. Generate Image B second, using Image A as a visual reference.
5. Upload both images to Kling when its selected workflow accepts additional references. Set Image A as both the Start Frame and End Frame; Image B is the secondary cinematic reference. Generate one 8-second video.
6. If that Kling workflow accepts only Start Frame and End Frame, use Image A for both and retain the video prompt's requested middle-of-video movement. Do not create a second clip.
7. Convert Image A to AVIF with [avify.dev](https://avify.dev/). Convert the generated MP4 to WebM with [FreeConvert's MP4-to-WebM converter](https://www.freeconvert.com/mp4-to-webm), while keeping the original MP4 as the Safari fallback.
8. Put the three final files in `public/`, run the app, and review the hero on desktop and mobile. Confirm the headline remains readable, the subject survives the crop, the video loop join is unobtrusive, reduced-motion shows the poster, and both the WebM and MP4 paths play correctly.

## 1. Image prompt A — Nano Banana

Provide exactly one copy-paste-ready prompt. It must:

- Describe a cinematic, professional, ad-quality hero image that is appropriate to the inspected project—not a generic stock SaaS scene.
- State precise composition, subject placement, lighting, colors, materials/environment, and mood using the project's actual brand direction.
- Reserve the actual headline/CTA area as clean, dark, low-detail negative space.
- Keep the important portion of the subject inside the mobile-safe region inferred from the current crop behavior.
- Exclude readable text, logos, watermarks, fake UI, fake code, and product screenshots.
- End with exactly: `Nano Banana settings: 16:9`.

## 2. Image prompt B — Nano Banana

Provide exactly one copy-paste-ready prompt. Begin by telling the user to upload Image A as the reference image. It must preserve the same subject, setting, styling, lighting, color palette, text-safe area, and overall composition, then request one restrained cinematic variation that can inspire richer motion in the video: for example, a small lateral perspective shift, changing reflection, practical light sweep, fabric movement, or subtle subject movement. It must not introduce a new scene, character, object, text, logo, or large framing change.

End with exactly: `Nano Banana settings: 16:9`.

## 3. Video prompt — Kling 3 Standard Image-to-Video

Provide exactly one copy-paste-ready prompt for a **single combined eight-second video**. It must:

- Instruct the user to upload Image A and Image B as available references, with Image A used as both Start Frame and End Frame where the UI allows it.
- Create one premium, cinematic, ad-like video, not two clips and not a stitched sequence.
- Use a deliberate continuous visual arc: settle into the master image, introduce a restrained premium-ad camera/parallax change inspired by Image B through the middle, then calmly return to Image A's opening composition before the final frame.
- Keep motion alive but controlled: atmospheric light, reflections, particles, fabric, subtle human/environmental movement, or material detail appropriate to the project.
- Keep the text-safe area dark, calm, and low-motion for the full eight seconds.
- Explicitly prohibit cuts, whip pans, fast motion, random zooms, circular camera movement, sudden transformations, new objects, warped anatomy, flickering/unreadable text, or major composition changes.
- Require the final frame to match Image A as closely as possible so the one video loops smoothly in the browser.
- End with exactly: `Kling settings: Image-to-Video, 16:9, 8 seconds, use Image A as the Start Frame and End Frame; use Image B as an additional reference when supported.`

### Asset delivery plan

Provide a short plan containing all of the following:

- **Poster:** Image A converted to AVIF. Use [avify.dev](https://avify.dev/) if a local encoder is unavailable.
- **Video:** the one generated 8-second video encoded as WebM for the primary file and MP4 for the Safari fallback. Use [FreeConvert's MP4-to-WebM converter](https://www.freeconvert.com/mp4-to-webm) if needed.
- **Targets:** 1280×720, muted, 24 fps; aim for `hero-poster.avif` at or below 250 KB and each video file at or below 4 MB.
- **Desktop/mobile treatment:** retain the inspected component's responsive crop and overlays; do not create a separate mobile asset unless the current implementation already supports one.
- **Accessibility:** retain a static poster for reduced-motion, save-data, unsupported-video, and failed-playback cases.
- **Loop review:** AI generation cannot guarantee a mathematically perfect seamless loop. Inspect both the last-to-first-frame join and the readability of the text-safe area before shipping.

Then show exactly this file placement:

```text
public/
  hero-poster.avif      ← Image A only; instant static fallback
  hero-background.webm  ← one combined 8-second video; preferred delivery
  hero-background.mp4   ← same one combined video; Safari fallback
```

## Constraints

- Be project-specific. If the homepage or hero cannot be located, say which files were searched and stop rather than inventing brand or layout facts.
- Do not modify source files or place any media into `public/`; this command only tells the user what to generate and where to put the resulting files.
- Do not create an additional video, an image-specific mobile asset, or a second poster.
- Never expose, request, print, store, or commit an API key.
- Do not claim the loop is perfect. Describe it as loop-safe guidance and require manual review of the join.

# Codex Image Profile

Use this reference only when preparing for or executing with the Codex image tool or GPT Image. Treat it as mutable model guidance and recheck official documentation when model behavior or tool arguments may have changed.

Last verified: 2026-08-03

Official sources:

- https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- https://developers.openai.com/api/docs/guides/image-generation
- https://developers.openai.com/api/docs/models/gpt-image-2
- https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6.md

## Current model behavior

- GPT Image 2 is the recommended production default for generation and editing in current OpenAI guidance.
- Structure prompts as background or scene, subject, key details, then constraints. Include the intended asset use when it affects polish or layout.
- Use short labeled segments for complex requests. Clear natural language is sufficient; special prompt syntax is not required.
- Include the literal cue `photorealistic` when realism is required. Support it with real-world texture, believable materials, natural light, and physical contact.
- Treat detailed lens, camera, aperture, and shutter specifications loosely. Use them to steer perspective, framing, depth, and motion character, not as guaranteed optical simulation.
- Put exclusions, preserve instructions, and avoid conditions into the same prompt. The Codex image tool accepts one prompt, so do not emit a detached negative-prompt block.

## Product-view and web-layout controls

- Treat the supplied brief or product reference as the authority for which surface is the front and which is the rear. `Straight-on` controls alignment, not face identity. Name the authoritative face and its defining visible structures in the prompt when front or rear distinction matters.
- A copy-safe region must exclude more than the main subject. Explicitly keep cast shadows, reflections, foreground and background props, and high-contrast edges outside that region.
- Produce a product angle sequence as separate front, three-quarter, side-profile, and rear frames. Repeat the identity and series locks in each frame prompt. Do not use one multi-panel generation as the production asset.
- When a concept composite is explicitly requested, state the exact panel count, the ordered view assigned to each panel, and that no additional panel may appear.
- A single illustrative output, including a multi-panel example, shows only the intended distinction. It is not evidence of identity, geometry, lighting, or framing continuity across independently generated frames.

## Codex tool inputs

- For a new image, omit both `referenced_image_paths` and `num_last_images_to_include`.
- For an edit when every target has a local path, inspect unseen local images first and pass all targets through `referenced_image_paths`.
- When a required target lacks a local path, use `num_last_images_to_include` with the smallest recent-image count that includes every target, up to the tool limit.
- Never provide both reference mechanisms in one call. Ask the user to attach a missing target again if neither mechanism can include every required image.
- Keep prompt order and input order aligned. Label references as `Image 1`, `Image 2`, and so on, followed by each role.

## Generate

Use one skimmable prompt:

```text
Purpose: [asset and destination]
Scene: [background, time, environment]
Subject: [identity, action, placement]
Details: [frame, photographic behavior, light, material, color]
Constraints: [invariants, exact copy, exclusions, avoid conditions]
```

For commercial photography, prefer observable visual behaviors over dense equipment lists. State layout relationships directly, such as subject placement, negative space, viewpoint, and foreground or background order.

## Edit

Use the base image as `Image 1` unless the tool or user supplies a different order. Describe every input by index and role, then state the edit as a narrow delta:

```text
Image 1: base photograph and composition reference.
Image 2: product geometry and color reference.

Change only [target change] in Image 1 using [specific element] from Image 2.
Preserve [identity, geometry, composition, camera angle, lighting, shadows, color, background, text].
Match [perspective, scale, focus, light direction, color temperature, contact and occlusion shadows].
Keep everything else the same.
```

Repeat the complete preserve list on every edit turn. Do not rely on conversation memory for invariants. For a large scene transformation, explicitly separate what may change from what must remain.

## Series and iteration

- Approve or choose a master before broadening a series when possible.
- Repeat identity, product, capture, light, grade, material, and anti-CGI invariants in each frame prompt.
- Name one permitted variation axis per iteration. Examples include crop, pose, prop, environment, time of day, or light softness.
- Preserve all other axes. Use `Change only X` for revisions rather than recompiling a different art direction.
- Diagnose the output against observable criteria, then make the smallest causal revision. Avoid changing lens, lighting, grade, pose, and environment at once.

The Codex image tool abstracts model selection and quality settings. Do not invent unavailable parameters in tool calls. If the tool interface changes, follow the live tool schema over this profile and update this file afterward.

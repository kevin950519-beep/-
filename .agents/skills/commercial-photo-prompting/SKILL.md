---
name: commercial-photo-prompting
description: Plan, compile, diagnose, and refine realistic commercial or cinematic photo prompts, with web-first routing for hero, PDP, feature, detail, grid, scale, and gallery imagery. Use when Codex needs to choose a web UI image role, angle, distance, copy-safe composition, or technical photographic behavior; build a coherent series; repair a CGI-looking result; or prepare a prompt for GPT Image or another image model.
---

# Commercial Photo Prompting

Turn supplied visual intent into a small, physically coherent photographic decision package. Do not invent brand strategy.

## Respect local orchestration

Check repository instructions before using this skill. If a project-specific photography skill owns the end-to-end workflow, use that skill as the orchestrator and use this one only as its technical planning, compilation, or diagnosis layer. Do not bypass a required visual branding contract, shot brief, approval gate, or generation policy.

## Choose the mode

Infer the mode from the request. Ask only if the deliverable would materially differ.

- **Plan**: Develop a shot direction, compare photographic approaches, or define a series system. Return decisions and tradeoffs, not a padded generator prompt.
- **Compile**: Convert an approved brief into one self-contained prompt for a new image, an edit, or a series frame. Generate or edit the image only when the user asks for execution.
- **Diagnose**: Inspect a prompt, image, or stated failure. Identify the few causal conflicts, repair them, and produce the next prompt when requested.

If the user provides a concrete brief and asks for a prompt, default to Compile. If the request is exploratory, default to Plan.

## Intake only what matters

Extract these fields from the request and attached material:

- asset purpose and destination
- web UI role, or evidence that the destination is explicitly non-web
- subject, action, and environment
- frame or required output shape
- supplied brand, product, identity, copy, and geometry invariants
- reference-image roles
- requested operation: generate, edit, or series
- observable success criteria

Ask at most the smallest blocking question set. Do not infer a brand archetype, audience, campaign promise, narrative, color system, cultural cue, or product claim from the product alone. When direction is absent but work can proceed safely, use restrained production defaults and label them as defaults.

Treat an unspecified destination as web-first. Route it through a web UI role before choosing camera behavior. Bypass web routing only when the request explicitly targets print, out-of-home, a film still, or another non-web destination.

## Use the references progressively

For web-first work, read `references/web-editorial-composition.md` before selecting composition or camera behavior. This is the default route when destination is unspecified. Use its role recipes for hero, PDP primary, feature explainer, detail proof, collection or grid, scale in context, and gallery or angle sequence imagery. Do not load or apply it to an explicitly non-web request.

Use `references/commercial-photographic-taxonomy.md` as the skill's generated technical snapshot. In the Vibe Design Lab repository, `src/data/commercialPhotographicTaxonomyData.js` is the runtime source of truth and the snapshot must pass `node scripts/commercial-photographic-taxonomy.mjs --check`.

1. Inspect its structure with `rg -n '^##|^###' references/commercial-photographic-taxonomy.md`.
2. Read only the sections needed for the active decision slots.
3. Read Part 10 for realism, people, reflective materials, water, glass, metal, compositing, or anti-CGI repair.
4. Prefer `confirmed` entries. Use `probable` only when it supplies necessary visual behavior. Do not treat `pending-gap` or `pending-pool` as authoritative.

Treat a `semantic-bundle` as a decision recipe, not a prompt keyword. Expand its bundle keys into compatible atomic decisions, then express their observable behavior in the decision package and prompt. Preserve evidence labels: never present `probable`, `illustrative-only`, or `not-validated` material as `confirmed`.

When preparing for or executing with the Codex image tool or GPT Image, also read `references/codex-image-profile.md`. Keep model-specific or tool-specific behavior there, not in this core workflow.

## Build a decision package

Select only decisions that materially affect the requested result. Fill each slot with zero or a few compatible choices. Do not target keyword counts and do not expose unused taxonomy terms.

For web-first work, decide in this order:

0. **Web UI role**: hero, PDP primary, feature explainer, detail proof, collection or grid, scale in context, or gallery or angle sequence.
1. **Information to communicate**: representative form, feature location, thickness or construction, material evidence, real-world scale, or multiple views.
2. **Viewpoint**: front, three-quarter, side profile, rear, or another view justified by the required information.
3. **Distance and occupancy**: wide, medium, or close-up; subject scale; crop; and frame occupancy.
4. **UI adaptation**: aspect, copy-safe side, title and CTA clearance, responsive crop tolerance, and consistency across cards or frames.
5. **Physical execution**: optics and motion, lighting, color and capture, material and contact, production, constraints, and observable validation checks.

For an explicitly non-web destination, begin with purpose and scene, then choose frame, optics and motion, lighting, color and capture, material and contact, production, and constraints. In either route, let the information requirement determine viewpoint and distance. Do not hard-code one angle to one role.

Use named looks only when the user supplies one or it solves a specific behavior that cannot be stated more directly. Prefer concrete behavior over adjective stacks such as `cinematic`, `premium`, `hyperreal`, and `ultra-detailed`.

## Resolve physical conflicts

Resolve contradictions before writing the prompt:

- Match perspective, camera distance, format cue, and depth behavior. Do not pair extreme shallow focus with required front-to-back sharpness.
- Match motion behavior and exposure cue. Do not request long-exposure flow and frozen droplets in the same region.
- Match source direction, shadow direction, reflections, and background light. Every visible effect needs a plausible source.
- Match modifier behavior to material. Reflective metal needs controlled reflected shapes; matte or textured surfaces need relief-producing gradients or grazing light.
- Match film or digital response, white balance, and source color. State a deliberate color consequence when mixing them.
- Match realism and retouching. Preserve natural asymmetry, surface variation, contact deformation, and texture when authenticity is required.
- Match mood and tonal limits. Low-key does not require crushed blacks; bright materials do not require clipped highlights.
- Match composited elements in perspective, scale, focus, light direction, color temperature, contact, and occlusion.

Protect supplied business, identity, product, geometry, and copy invariants. Repair conflicting technical choices to serve the requested observable outcome and note the repair briefly. If two user-locked outcomes cannot coexist, present the tradeoff and ask which invariant wins.

## Compile the operation

### Generate

Assemble one prompt in this order:

```text
Web UI role and information goal, or explicit non-web purpose
Background and scene
Main subject and action
Key visual and physical details
Viewpoint, distance, occupancy, UI adaptation, and photographic behavior
Lighting, color, and material response
Constraints, invariants, and avoid conditions
```

Use concrete prose or short labeled sections. Treat camera and lens specifications as high-level visual controls, not exact simulation guarantees. For realistic output on a model that responds to medium cues, explicitly state `photorealistic` and reinforce it with observable evidence such as natural texture, plausible contact, and motivated light.

Merge avoid conditions into the same prompt under constraints. Do not create a separate negative prompt unless the target system explicitly requires one. Quote exact on-image copy verbatim. If typography will be added later, request clear space and no generated text.

### Edit

Assign every input image an index and a role in upload order, for example `Image 1: base scene`, `Image 2: product geometry reference`.

State:

1. the single requested change
2. the exact source image or element
3. its destination and spatial relationship
4. the invariants to preserve
5. the lighting, perspective, scale, focus, shadow, and color match required for integration

Use direct edit language such as `Change only X. Keep everything else the same.` Repeat the preserve list on every revision. Change only one causal axis when possible. If changing viewpoint or copy-safe placement, state the target web role and information goal while preserving product identity and distinguishing front, side, and rear geometry. For surgical edits, preserve identity, product geometry, composition, camera angle, lighting, shadows, color response, background, surrounding objects, and existing text unless the request explicitly changes one of them.

### Series

After the master direction is approved, freeze a series lock:

- subject or product identity, silhouette, construction, dimensions, materials, and color placement
- capture format cue and lens family
- dominant light behavior and contrast range
- color response, grain, highlight behavior, and retouching level
- recurring composition rule and supplied brand invariants
- recurring web role, occupancy, alignment, copy-safe behavior, and responsive crop rule when applicable
- physical realism and avoid constraints

Define the permitted variation axis for each frame, such as framing, action, environment, prop, or pose. Change one axis at a time during iteration. Repeat all critical invariants in every prompt, even when a reference image is attached.

For a gallery or product angle sequence, default to separate front, three-quarter, side-profile, and rear frames with product scale, camera height, centerline, ground line, background, and lighting locked. Create a multi-panel composite only when the user explicitly requests a contact sheet or concept board.

## Diagnose and iterate

For Diagnose mode, return only the useful layers:

1. **Cause**: the few prompt instructions or visible cues driving the failure.
2. **Conflict repair**: what to remove, replace, or preserve, with a short physical reason.
3. **Role fit**: for web-first work, whether the result communicates the selected UI role and information goal at the required viewpoint, occupancy, and safe area.
4. **Decision package**: only the active slots.
5. **Next prompt**: one self-contained prompt when requested.
6. **Checks**: a short list of observable pass or fail criteria.

Do not answer a CGI-looking result with `no CGI` alone. Add positive physical evidence such as plausible contact shadows, asymmetric highlight gradients, material thickness, restrained surface variation, weight deformation, natural skin texture, or irregular moisture. Remove causal synthetic cues such as uniform gloss, cloned symmetry, ray-traced-looking reflections, razor bevels, excessive clarity, HDR contrast, total-frame sharpness, plastic skin, or procedural texture.

Revise one causal axis per iteration whenever possible. Preserve successful regions and restate invariants. If the user requests prompt-only output, omit analysis and checks after using them internally.

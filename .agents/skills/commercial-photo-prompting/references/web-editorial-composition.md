# Web Editorial Composition

Use web placement as the first composition classifier for commercial photography. Most requested commercial images will be placed in a website or product interface, so do not wait for the user to say `web` before routing the shot.

This reference is a compact decision router, not a copy of the full taxonomy. Use `commercial-photographic-taxonomy.md` for the underlying composition, optics, lighting, material, and physical-consistency controls.

## Evidence boundary

The six P4 atomic controls `front-view`, `three-quarter-view`, `side-profile-view`, `rear-view`, `copy-safe-left`, and `copy-safe-right` are `probable`. The seven role bundles in this reference are also `probable` and have `validationStatus: illustrative-only` in the runtime taxonomy.

- Use them as practical composition candidates when their observable behavior serves the asset.
- Do not describe them as validated model controls or validated continuity methods.
- A confirmed atom inside a bundle does not validate the bundle as a whole.
- Do not use a bundle name such as `hero-copy-safe-shot` as a generator prompt tag. Expand it into visible spatial instructions.
- Treat generated reference images as illustrations of the intended distinction, not evidence that a model will reproduce it consistently.

## Route web role first

Classify the destination before choosing shot distance, viewpoint, lens behavior, or lighting.

1. Select the web role that matches the information the image must deliver.
2. State the information goal in observable terms.
3. Choose the product face or feature that makes that information legible.
4. Set distance and frame occupancy from the information goal, not from mood alone.
5. Reserve copy, crop, card, or gallery constraints imposed by the UI.
6. Add optics, light, color, material, and realism controls only after the role works as a layout.

If a user gives a non-web destination such as print packaging, a billboard, an editorial spread, a film still, or an exhibition image, bypass this router and classify the stated destination directly. Do not force web spacing onto explicitly non-web work.

## Defaults when the destination is ambiguous

- If the destination is omitted, default to `web-first` and state that default in Plan mode.
- A landing page, launch, campaign, homepage, headline, or CTA context routes to **Hero**.
- A standalone product image without campaign language routes to **PDP primary**.
- A request to show how a control, opening, mechanism, or feature works routes to **Feature explainer**.
- A request to prove texture, finish, thickness, joinery, or construction routes to **Detail proof**.
- A repeated family, catalog, shop listing, or comparison set routes to **Collection grid**.
- A request about real size, fit, carry, placement, or use in a room routes to **Scale in context**.
- A request for front, side, rear, complete coverage, or gallery completeness routes to **Product angle sequence**.
- If two roles are needed, choose one primary role per image. Plan a second frame instead of weakening both jobs in one frame.
- If copy position is unknown for a hero, choose one copy side as a declared default. Do not center the product and call the remaining fragments copy-safe.
- Do not add copy-safe space to PDP primary or collection cards unless the interface actually overlays text.

## Seven-role matrix

| Web role | Information goal | Default viewpoint | Distance and occupancy | UI constraint | Main limitation |
| --- | --- | --- | --- | --- | --- |
| Hero | Immediate recognition plus room for headline and CTA | Three-quarter or the most recognizable face | Wide to medium; product anchored to one side | One continuous low-detail copy zone, including shadow and prop clearance | Final copy length and responsive crops still require UI checks |
| PDP primary | Complete silhouette and primary-use face | Straight-on to the authoritative primary face | Medium; full product with consistent outer margin | Centered, unobstructed outline; no decorative overlap | Does not explain depth, rear construction, or use context |
| Feature explainer | Locate one feature while retaining the whole product | Three-quarter or the angle that exposes the feature | Medium; full form retained and feature made locally prominent | Keep adjacent annotation space clear | A still may not explain a sequence or hidden mechanism |
| Detail proof | Prove one material, finish, edge, joint, or control | Side profile, front, or oblique according to the evidence surface | Close-up; one evidence area dominates | Nothing may obscure the evidence | Loses whole-product orientation and needs a companion overview |
| Collection grid | Make products comparable across repeated cards | Straight-on, eye-level, shared face convention | Repeatable occupancy; preserve real relative scale when required | Lock centerline, baseline, background, and margins across the set | Per-item auto-crop can falsify size comparison |
| Scale in context | Communicate real size and use position | Natural eye-level view | Wide enough for the complete product and a familiar scale cue | Product and scale cue share a believable spatial plane | Foreground or background separation can distort perceived scale |
| Product angle sequence | Explain construction across front, three-quarter, side, and rear | Four controlled viewpoints | Matched occupancy in four individual frames | Lock center, camera height, baseline, background, light, and margin | One generated sample cannot prove identity continuity across a series |

## Role recipes

### Hero

- **Underlying bundle:** `P4:three-quarter-view`, one of `P4:copy-safe-left` or `P4:copy-safe-right`, `P4:wide-shot`, `P4:safety-zone`.
- **Information goal:** Make the subject recognizable at first glance while keeping headline and CTA placement viable.
- **Composition:** Place the subject opposite the declared copy side. Reserve a broad continuous region with restrained texture and contrast.
- **Copy-safe rule:** Keep the subject silhouette, strong cast shadow, bright reflection, foreground prop, background prop, and high-contrast edge outside the copy region.
- **QA:** Check camera-angle internal consistency, ground-plane shadow mapping, and size-depth consistency.
- **Allowed variation:** Mirror the layout when the actual interface puts copy on the other side.
- **Limitation:** The generated frame is only a candidate. Validate the actual headline, CTA, breakpoints, and crops in the destination UI.

### PDP primary

- **Underlying bundle:** `P4:front-view`, `P4:medium-shot`, `P4:eye-level`, `P4:safety-zone`.
- **Information goal:** Show the complete product and its primary-use face without visual interpretation getting in the way.
- **Composition:** Square the camera to the authoritative primary face, keep the silhouette unobstructed, and preserve even outer margins.
- **Face authority:** The supplied product reference or brief decides which face is primary. Do not infer front from whichever surface happens to face the camera in a generated reference.
- **QA:** Check face identity, camera-angle internal consistency, size-depth consistency, and ground-plane shadow mapping.
- **Allowed variation:** A face other than the manufactured front may be primary when it is the actual user-facing or merchandising face.
- **Limitation:** Add supporting frames for thickness, back panels, ports, and use context.

### Feature explainer

- **Underlying bundle:** `P4:three-quarter-view`, `P4:medium-shot`, `P4:rule-of-thirds`.
- **Information goal:** Explain where one feature sits in relation to the complete product.
- **Composition:** Choose the angle that opens the feature to the camera, retain the overall form, and place the feature near a visual priority point opposite any annotation space.
- **QA:** Check that the feature is not occluded, the chosen face remains geometrically coherent, and scale and occlusion shadows remain plausible.
- **Allowed variation:** Mirror the product and annotation side to match the real feature location.
- **Limitation:** Use a sequence or diagram when the value depends on motion, internal structure, or multiple steps.

### Detail proof

- **Underlying bundle:** `P4:close-up`, `P4:side-profile-view` when relevant, `P4:eye-level`.
- **Information goal:** Supply purchase evidence for a single material or construction claim.
- **Composition:** Select one proof target. Align the view so texture, thickness, edge, and junction share a readable focal plane.
- **QA:** Check specular consistency, camera-angle internal consistency, shadow falloff continuity, real material thickness, and unobscured edges.
- **Allowed variation:** Use front, side, or oblique view according to which one reveals the boundary most clearly.
- **Limitation:** Pair with an overview because close framing removes product orientation.

### Collection grid

- **Underlying bundle:** `P4:front-view`, `P4:eye-level`, `P4:safety-zone`.
- **Information goal:** Support rapid comparison without framing differences masquerading as product differences.
- **Composition:** Lock camera height, primary face convention, centerline, baseline, background, margins, and lighting. Replace only the product.
- **Occupancy rule:** Use a shared framing standard. Preserve actual relative scale when size comparison matters, even if smaller products occupy less of the card.
- **QA:** Check size-depth consistency, camera-angle internal consistency, ground-plane shadow mapping, and cross-frame alignment.
- **Allowed variation:** Change occupancy only under a declared real-scale rule or a declared normalized-card rule.
- **Limitation:** Never mix those two scale rules inside one grid.

### Scale in context

- **Underlying bundle:** `P4:wide-shot`, `P4:eye-level`, `P4:layering`.
- **Information goal:** Let a familiar object, hand, body, furniture item, or storage space establish real-world dimensions.
- **Composition:** Keep the product complete and place the scale cue on the same ground plane and at a comparable camera distance.
- **QA:** Check size-depth consistency, occlusion-shadow accuracy, ground-plane shadow mapping, contact, and believable human-product proportions when people appear.
- **Allowed variation:** Choose the most familiar scale cue for the product category.
- **Limitation:** A cue much nearer to or farther from the camera cannot be trusted as a size comparison.

### Product angle sequence

- **Underlying bundle:** `P4:front-view`, `P4:three-quarter-view`, `P4:side-profile-view`, `P4:rear-view`, `P4:safety-zone`.
- **Information goal:** Cover exterior construction without gaps across four complementary viewpoints.
- **Production rule:** Create front, three-quarter, strict side-profile, and rear as four individual frames. A concept composite is not the production sequence.
- **Series lock:** Freeze product identity, dimensions, construction, materials, color placement, primary and rear face authority, camera height, focal behavior, product center, occupancy, baseline, background, light direction, contrast, color response, contact shadow behavior, and outer margins.
- **Variation axis:** Change viewpoint only. Repeat every lock in every frame prompt.
- **QA:** Check face identity, camera-angle internal consistency, size-depth consistency, single-light-source consistency, baseline, occupancy, and silhouette continuity.
- **Allowed variation:** Add top or bottom views after the four required frames without changing their visual standard.
- **Limitation:** A single illustrative sample, including a four-panel sample, is not evidence that identity and geometry will remain continuous across independently generated frames.

## Translate roles into prompt instructions

Bundle names are planning shorthand. Expand the chosen role into observable instructions before compilation.

Do this:

```text
Purpose: website hero with headline and CTA on the left.
Composition: three-quarter product view, product anchored in the right third, broad continuous low-detail space on the left.
Copy safety: no part of the product, cast shadow, reflection, prop, or high-contrast background edge crosses the left copy region.
```

Do not do this:

```text
hero-copy-safe-shot, premium web composition
```

For every role, compile the decision package in this order:

1. Web role and destination
2. Information goal
3. Authoritative face or feature
4. Viewpoint
5. Distance and frame occupancy
6. Copy, crop, grid, or gallery constraints
7. Optics, light, color, material, and physical-consistency controls
8. Invariants and observable QA checks

## Responsive and delivery checks

Generation cannot validate the complete interface. Before treating a web asset as finished, check the applicable delivery conditions outside the prompt:

- headline and CTA fit at intended breakpoints
- crop preserves the authoritative face, feature, and silhouette
- copy remains clear of subjects, strong shadows, props, reflections, and contrast edges
- collection items retain the declared scale and alignment rule
- gallery frames retain matched identity, center, baseline, occupancy, light, and margins
- alt text describes the information role without claiming unverified product properties

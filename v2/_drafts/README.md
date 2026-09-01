# `/v2/` review drafts

`v2/a/index.html` and `v2/b/index.html` are **build output**. Edit `base.html`, then from
inside `_site/`:

```bash
node v2/_drafts/build.js
```

Commit `base.html` and both regenerated pages together. Hand-editing `a/` or `b/` is a trap:
the next run clobbers it, and the two pages silently drift apart, which is exactly the
failure this generator exists to prevent.

The two drafts differ in **one** thing: where Diana's portrait sits. Diana asked for both
positions on 2026-08-30 so she can pick.

- **A** · the portrait opens the "What to expect" chapter (`{{PORTRAIT_A}}`)
- **B** · the portrait sits just above the dark letter spread (`{{PORTRAIT_B}}`)

`v2/index.html` is the chooser page she lands on, hand-written and not generated.

To prove the two pages differ only where they should:

```bash
diff <(sed 's/Draft [AB]/Draft X/;s|/v2/[ab]/|/v2/x/|;s/draft [AB]/draft X/g' ../a/index.html) <(sed 's/Draft [AB]/Draft X/;s|/v2/[ab]/|/v2/x/|;s/draft [AB]/draft X/g' ../b/index.html)
```

The folder is underscore-prefixed so GitHub Pages (Jekyll) never serves `base.html`.

Once Diana picks, fold the winning position back into the single `/v2/` page and delete this
folder along with the losing draft.

## `/v2/photos/`

Diana picked draft A on 2026-09-01 and asked to try photos from her 22 August Ubud shoot
in three slots, plus a different quote on the room photo. `build-photos.js` generates
`v2/photos/index.html` from the already-generated `v2/a/index.html` and wraps it in a
picker, so she chooses inside the real page instead of comparing flat mocks:

```bash
node v2/_drafts/build-photos.js
```

It throws if any anchor it rewrites has moved, so a change to `base.html` that renames
the story photo, the portrait or the room quote will fail the build rather than silently
produce a page with dead controls. Rerun it after every `build.js` run.

The candidate table in that script carries the framing numbers per photo, because these
are full frames off the shoot and the subject sits somewhere different in each: `circle`
and `zoom` for the 230px round crop, `plate` for the wide alternative, `story` for the
4/5 plate, `face` for the 46px hero avatar at 300% zoom. For a 2:3 source the values are
derived, not eyeballed: to land a subject at fraction `f` of the frame height in the
middle of the crop, `circle = 3f-1`, `story = 6f-2.5`, `face-y = (4.5f-0.5)/3.5`.

Both this page and the drafts fold away once she has chosen. Then the winning photos and
quote go into `base.html`, `/v2/` becomes one page, and the whole thing ports to `_tpl`.

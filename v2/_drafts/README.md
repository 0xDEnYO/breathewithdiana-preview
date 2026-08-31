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

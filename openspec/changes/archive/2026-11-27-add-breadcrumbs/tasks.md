# Tasks: add-breadcrumbs

Each task names its failing test first, then the code that makes it pass.

## 1. Breadcrumb component

- [x] 1.1 Test: `/masters/countries` produces two crumbs, «Maestros» as a link to `/masters` and «Countries» as the current page. Then implement `shared/layout/breadcrumbs/breadcrumbs.ts`, which reads the URL on `NavigationEnd`.
- [x] 1.2 Test: a segment with a `nav.*` key uses that translation; a segment with only a `breadcrumb.*` key uses that; a segment with neither is capitalised. Then add the label lookup.
- [x] 1.3 Test: the trail is a `nav` with the localised name, the current crumb has `aria-current="page"` and no link, and the chevrons have `aria-hidden="true"`. Then add the template.
- [x] 1.4 Test: `layout.breadcrumb` exists in both catalogues. Then add it.

## 2. Layout and styles

- [x] 2.1 Test: the breadcrumb element is inside the content area and before the router outlet. Then render it in `main-layout.html`.
- [x] 2.2 Add `--cp-breadcrumb-top` in `src/styles.css`, set to 0 px so the trail sits at the top edge of the content area. Crumb text uses `--mm-type-body-size`, the current crumb `--mm-color-accent`, the others `--mm-color-text`, and the underline on hover and focus is the only extra style.
- [x] 2.3 Register `tablerChevronRight` in `app.config.ts`.

## 3. Verification

- [x] 3.1 Run `ng test --watch=false`, both typechecks and `ng build`.
- [x] 3.2 Manual check in Chrome at 320 px and 1280 px, light and dark: the trail sits above the title, 10 px from the top, half the title size.

# Frontend architecture

Use the repository's Atomic Design structure. Place reusable primitives in `src/components/atoms`, small compositions in `molecules`, domain sections in `organisms`, reusable page layouts in `templates`, and concrete screens in `src/app`.

Keep domain data, selectors and state transitions in `src/features`. Do not put filtering or aggregation logic in presentation components.

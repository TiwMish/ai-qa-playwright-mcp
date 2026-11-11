# Generated test cases — US-TODO-01

Output of the workflow in `ai/prompts/test-case-generation.md` applied
to `ai/requirements/sample-user-story.md`, reviewed and pruned by hand.
Cases TC-01 … TC-06 are automated in `tests/todo.spec.ts`.

| ID | Title | Type | Expected result |
|----|-------|------|-----------------|
| TC-01 | Add a single todo | Positive | Item appears in the list; counter shows "1 item left" |
| TC-02 | Add multiple todos | Positive | All items listed in entry order; counter matches |
| TC-03 | Complete a todo | Positive | Item marked completed; remaining count decreases by 1 |
| TC-04 | Filter All / Active / Completed | Positive | Each filter shows exactly the matching subset |
| TC-05 | Clear completed | Positive | Only active items remain after clearing |
| TC-06 | Persistence on reload | Positive | List is unchanged after a page reload |
| TC-07 | Add an empty todo | Negative | No item is created; counter unchanged (manual/exploratory — demo app trims input) |
| TC-08 | Add a duplicate todo | Edge | Both entries coexist; each can be completed independently (exploratory) |
| TC-09 | Very long title (500+ chars) | Edge | Item renders without breaking layout (exploratory) |

**Questions for the product owner** (flagged by the AI, confirmed by review):
- Should pressing Enter with only whitespace create an item? The story is silent.
- Is there a maximum number of items or a title length limit?

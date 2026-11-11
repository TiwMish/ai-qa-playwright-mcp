import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage.js';
import { aiGeneratedTodos, sampleTodos } from '../../fixtures/test-data.js';

/**
 * AI-assisted testing patterns demonstrated in executable form.
 *
 * 1) SELF-HEALING-FRIENDLY LOCATORS
 *    Every interaction goes through semantic locators (role / label /
 *    placeholder / text). An AI agent driving the same page through the
 *    Playwright MCP server "sees" exactly these semantics in the
 *    accessibility-tree snapshot, so when markup changes, both the agent
 *    and these tests can re-locate elements by what they *mean* instead
 *    of failing on a stale CSS path. No XPath, no nth-child chains,
 *    no auto-generated class names anywhere in this project.
 *
 * 2) AI-GENERATED DATA AT SCALE
 *    The bulk-data test below uses Copilot-generated fixtures (see
 *    fixtures/test-data.ts) to exercise list behaviour at a volume a
 *    human would rarely type by hand — pagination, filtering and
 *    counter accuracy under load.
 */
test.describe('AI-assisted patterns', () => {
  test.beforeEach(async ({ page }) => {
    await new TodoPage(page).goto();
  });

  test('semantic locators survive a full workflow end-to-end', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.addTodos(sampleTodos);

    // Toggle by accessible role, filter by link text, clear by button name —
    // every step is addressed the way a user (or an agent) perceives the UI.
    await todo.completeTodo(sampleTodos[0]);
    await todo.filterBy('Completed');
    await expect(page.getByText(sampleTodos[0])).toBeVisible();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await todo.filterBy('All');
    await todo.expectVisibleTodos([sampleTodos[1], sampleTodos[2]]);
  });

  test('filtering and counting stay correct with AI-generated bulk data', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.addTodos(aiGeneratedTodos);
    await todo.expectCount(aiGeneratedTodos.length);

    await todo.completeTodo(aiGeneratedTodos[0]);
    await todo.completeTodo(aiGeneratedTodos[5]);
    await todo.expectCount(aiGeneratedTodos.length - 2);

    await todo.filterBy('Active');
    await expect(todo.todoItems).toHaveCount(aiGeneratedTodos.length - 2);
  });
});

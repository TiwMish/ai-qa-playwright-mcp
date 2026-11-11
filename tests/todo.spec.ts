import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage.js';
import { sampleTodos } from '../fixtures/test-data.js';

/**
 * Core regression suite for TodoMVC.
 *
 * These specs were designed from the user story in
 * ai/requirements/sample-user-story.md using the AI test-design
 * workflow documented in ai/prompts/test-case-generation.md — the
 * generated case list lives in ai/examples/generated-test-cases.md,
 * and every case ID there maps to a test below (TC-01 … TC-06).
 */
test.describe('TodoMVC — core regression', () => {
  let todo: TodoPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    await todo.goto();
  });

  test('TC-01: user can add a todo item', async () => {
    await todo.addTodo(sampleTodos[0]);
    await todo.expectVisibleTodos([sampleTodos[0]]);
    await todo.expectCount(1);
  });

  test('TC-02: user can add multiple items and the counter tracks them', async () => {
    await todo.addTodos(sampleTodos);
    await todo.expectVisibleTodos(sampleTodos);
    await todo.expectCount(3);
  });

  test('TC-03: completing an item updates the remaining count', async () => {
    await todo.addTodos(sampleTodos);
    await todo.completeTodo(sampleTodos[0]);
    await todo.expectCount(2);
    await expect(todo.todoItem(sampleTodos[0])).toHaveClass(/completed/);
  });

  test('TC-04: filters show All / Active / Completed correctly', async () => {
    await todo.addTodos(sampleTodos);
    await todo.completeTodo(sampleTodos[1]);

    await todo.filterBy('Active');
    await todo.expectVisibleTodos([sampleTodos[0], sampleTodos[2]]);

    await todo.filterBy('Completed');
    await todo.expectVisibleTodos([sampleTodos[1]]);

    await todo.filterBy('All');
    await todo.expectVisibleTodos(sampleTodos);
  });

  test('TC-05: clear completed removes only finished items', async () => {
    await todo.addTodos(sampleTodos);
    await todo.completeTodo(sampleTodos[0]);
    await todo.completeTodo(sampleTodos[2]);
    await todo.clearCompletedButton.click();
    await todo.expectVisibleTodos([sampleTodos[1]]);
  });

  test('TC-06: todos persist after a page reload', async ({ page }) => {
    await todo.addTodos(sampleTodos);
    await page.reload();
    await todo.expectVisibleTodos(sampleTodos);
  });
});

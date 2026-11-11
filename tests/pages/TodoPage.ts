import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 *
 * Locator strategy (the "self-healing friendly" convention used across
 * this project): prefer user-facing, semantic locators — role, label,
 * placeholder and text — over CSS/XPath. When the UI is restyled or a
 * class name changes, these locators keep working because they describe
 * what the user sees, not how the DOM is built. This is also the same
 * information an AI agent reads from the accessibility tree through the
 * Playwright MCP server, so human tests and agent tests share one model
 * of the page.
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(texts: string[]) {
    for (const text of texts) await this.addTodo(text);
  }

  todoItem(text: string): Locator {
    return this.todoItems.filter({ hasText: text });
  }

  async completeTodo(text: string) {
    await this.todoItem(text).getByRole('checkbox').check();
  }

  async filterBy(name: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name }).click();
  }

  async expectCount(remaining: number) {
    await expect(this.todoCount).toHaveText(
      remaining === 1 ? '1 item left' : `${remaining} items left`,
    );
  }

  async expectVisibleTodos(texts: string[]) {
    await expect(this.todoItems).toHaveCount(texts.length);
    for (const text of texts) {
      await expect(this.todoItem(text)).toBeVisible();
    }
  }
}

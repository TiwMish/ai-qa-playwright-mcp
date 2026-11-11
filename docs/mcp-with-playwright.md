# MCP + Playwright in this project

## What MCP is

The **Model Context Protocol (MCP)** is an open standard that lets AI
assistants connect to external tools through a uniform interface — one
protocol instead of a custom integration per tool. An **MCP server**
exposes capabilities (tools, resources, prompts) for one system; an
**MCP client** lives inside the AI host (VS Code, Claude Code, Cursor),
discovers those tools, and executes the calls the model requests.
Under the hood it is JSON-RPC over stdio (local) or HTTP (remote), and
most servers are thin, well-tested wrappers over an existing API or CLI.

## The Playwright MCP server

Microsoft's `@playwright/mcp` server gives an agent a set of browser
tools — `browser_navigate`, `browser_snapshot`, `browser_click`,
`browser_type`, `browser_take_screenshot`, and more. The agent does not
receive raw HTML or screenshots by default: it receives the page's
**accessibility tree**, a compact structured snapshot where every
interactive element has a stable reference and a human-meaningful name
("button 'Clear completed'", "textbox 'What needs to be done?'").

That is why this project insists on semantic locators in its hand-written
tests: the agent and the test suite reason about the page in the same
vocabulary.

## Try it (VS Code)

1. Open this repo in VS Code — `.vscode/mcp.json` already declares the
   Playwright (and GitHub) servers.
2. Click **Start** on the `playwright` server entry in `mcp.json`.
3. Open Copilot Chat in **Agent** mode and ask:

   > Using the Playwright MCP tools, open https://demo.playwright.dev/todomvc,
   > add two tasks, complete the first one, and show me the page snapshot.

4. Watch the agent plan → snapshot → act → re-snapshot. Approve tool
   calls when VS Code prompts.
5. Then ask it to *codify* the flow: "Write this as a Playwright
   TypeScript test using the Page Object in tests/pages/TodoPage.ts."
   The agent explores; the committed test is what runs in CI.

## MCP vs traditional API integration

| | Traditional API | MCP |
|---|---|---|
| Consumer | Deterministic code | An LLM/agent at runtime |
| Discovery | Read docs, hardcode endpoints | Client asks the server what it can do |
| Call pattern | Pre-programmed sequence | Agent chooses each step from results |
| Layer | The interface itself | A standard agent-facing layer *over* APIs |

MCP does not replace APIs — the GitHub MCP server, for example, calls
the GitHub REST API underneath. It standardises how agents find and use
them safely, with the host mediating every tool call.

## Where GitHub & Jira fit

With the GitHub MCP server connected, the same agent session can read a
requirement, draft tests in a branch and open a pull request. Teams
commonly add an Atlassian MCP server so the agent can also read a Jira
ticket's acceptance criteria and log a defect — steps to reproduce,
evidence, severity — when a test fails: requirements → tests → PR →
defect, with the human reviewing at each gate.

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("provides the shared navigation, global controls, content landmark, and footer", () => {
    render(
      <AppShell>
        <h1>Evidence overview</h1>
      </AppShell>,
    );

    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main-content");
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "ATOM home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", { name: /current reading depth/i }),
    ).toHaveAttribute("href", "/#reading-depth");
    expect(screen.getByRole("group", { name: "Theme" })).toBeVisible();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toHaveTextContent(/verify atom/i);
  });
});

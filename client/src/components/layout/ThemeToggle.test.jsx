import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "../../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("switches between dark and light and persists the choice", async () => {
    document.documentElement.dataset.theme = "dark";
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: /switch to light mode/i }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("vh-theme")).toBe("light");

    await userEvent.click(screen.getByRole("button", { name: /switch to dark mode/i }));
    expect(document.documentElement.dataset.theme).toBe("dark");
  });
});

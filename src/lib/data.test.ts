import { describe, expect, it } from "vitest";
import { loadPortfolioData } from "./data";

describe("loadPortfolioData", () => {
  it("loads JSON data from src/data", async () => {
    const data = await loadPortfolioData<Array<{ id: string; title: string }>>(
      "projects.json",
    );

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("title");
  });

  it("loads the latest research data from src/data", async () => {
    const data = await loadPortfolioData<Array<{ title: string }>>(
      "research.json",
    );

    expect(data[0]?.title).toContain("AI-Powered Automated Exam Evaluation");
  });
});

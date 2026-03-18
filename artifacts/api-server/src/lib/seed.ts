import { db, toolsTable } from "@workspace/db";

const DEFAULT_TOOLS = [
  { name: "Immortal", description: "Advanced protection and immortality system", link: "https://immortal.rs/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==", orderNum: 1 },
  { name: "Injerus", description: "Powerful injection framework for professionals", link: "https://www.logged.tg/auth/lebc", orderNum: 2 },
  { name: "Shockify", description: "Next-gen shock wave enhancement tool", link: "https://shockify.st/?code=ODgyNDUyMDE0NDc4MDI0NTAzMA==", orderNum: 3 },
  { name: "Bypasser Roblox", description: "Ultimate Roblox bypass solution", link: "https://rbxbypasser.com/d/LEB", orderNum: 4 },
  { name: "Hyperlink", description: "Hyper-speed link management system", link: "#", orderNum: 5 },
];

export async function seedIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(toolsTable);
    if (existing.length === 0) {
      await db.insert(toolsTable).values(DEFAULT_TOOLS);
      console.log("Seeded default tools");
    }
  } catch (e) {
    console.error("Seed error:", e);
  }
}

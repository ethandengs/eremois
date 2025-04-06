import { execSync } from "node:child_process";

async function init() {
  try {
    // Run project setup
    console.log("Setting up project structure...");
    execSync("ts-node tools/scripts/setup.ts", { stdio: "inherit" });

    // Run docs setup
    console.log("Setting up documentation...");
    execSync("ts-node tools/scripts/setup-docs.ts", { stdio: "inherit" });

    console.log("\nInstallation complete! You can now start development:");
    console.log("1. npm run dev     - Start development servers");
    console.log("2. npm run docs:dev - Start documentation site");
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
}

init();

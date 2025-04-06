import { execSync } from "node:child_process";
import * as fs from "fs-extra";
import * as path from "node:path";

const ROOT_DIR = path.resolve(__dirname, "../..");

const PACKAGE_JSON = {
  name: "eremois",
  version: "0.0.1",
  private: true,
  workspaces: ["apps/*", "packages/*"],
  scripts: {
    dev: "turbo run dev",
    build: "turbo run build",
    test: "turbo run test",
    lint: "turbo run lint",
    format: 'prettier --write "**/*.{ts,tsx,md}"',
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs",
  },
  devDependencies: {
    turbo: "^1.10.0",
    typescript: "^5.0.0",
    prettier: "^2.8.0",
    "fs-extra": "^11.1.0",
    vitepress: "^1.0.0-rc.4",
  },
};

const directories = [
  "apps/web/src",
  "apps/api/src",
  "packages/types/src",
  "packages/ui/src",
  "packages/utils/src",
  "docs",
  ".github/workflows",
  "tools/scripts",
  "config",
];

async function setup() {
  try {
    // Create directory structure
    for (const dir of directories) {
      await fs.ensureDir(path.join(ROOT_DIR, dir));
    }

    // Create root package.json
    await fs.writeJSON(path.join(ROOT_DIR, "package.json"), PACKAGE_JSON, {
      spaces: 2,
    });

    // Initialize git
    execSync("git init", { cwd: ROOT_DIR });

    // Create initial configuration files
    await createConfigFiles();

    // Install dependencies
    console.log("Installing dependencies...");
    execSync("npm install", { cwd: ROOT_DIR, stdio: "inherit" });

    console.log("Project structure created successfully!");
  } catch (error) {
    console.error("Error setting up project:", error);
    process.exit(1);
  }
}

async function createConfigFiles() {
  // Create turbo.json
  const turboConfig = {
    $schema: "https://turbo.build/schema.json",
    globalDependencies: ["**/.env.*local"],
    pipeline: {
      build: {
        dependsOn: ["^build"],
        outputs: ["dist/**", ".next/**"],
      },
      dev: {
        cache: false,
        persistent: true,
      },
      test: {
        dependsOn: ["build"],
      },
    },
  };
  await fs.writeJSON(path.join(ROOT_DIR, "turbo.json"), turboConfig, {
    spaces: 2,
  });

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: "es2019",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
    },
    exclude: ["node_modules"],
  };
  await fs.writeJSON(path.join(ROOT_DIR, "tsconfig.json"), tsConfig, {
    spaces: 2,
  });
}

setup();

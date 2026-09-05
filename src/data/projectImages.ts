/**
 * Lazy image loader for project assets.
 *
 * `import.meta.glob` with `eager: false` creates dynamic imports —
 * Vite bundles each image as a separate chunk and only fetches them
 * on demand (when `getProjectImages` is called), not on initial page load.
 *
 * To add images to a project: just drop files into
 *   src/assets/projects/<imageDir>/
 * No changes to portfolio.json or any component needed.
 */

type ImageModule = { default: string };

const imageModules = import.meta.glob<ImageModule>(
  "../assets/projects/**/*.{jpg,jpeg,png,webp,avif}",
  { eager: false }
);

/**
 * Resolves all images for a given project directory slug.
 * Returns sorted resolved URLs (alphabetical by filename).
 */
export async function getProjectImages(imageDir: string): Promise<string[]> {
  const matched = Object.entries(imageModules).filter(([path]) =>
    path.includes(`/projects/${imageDir}/`)
  );

  // Sort by filename for deterministic order
  matched.sort(([a], [b]) => a.localeCompare(b));

  const urls = await Promise.all(
    matched.map(async ([, loader]) => {
      const mod = await loader();
      return mod.default;
    })
  );

  return urls;
}

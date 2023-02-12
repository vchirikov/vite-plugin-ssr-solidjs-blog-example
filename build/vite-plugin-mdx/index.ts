/** @file
 * we want to compile mdx to function-body (because we want to separate bundles for
 * each page )
 * @mdx-js/rollup doesn't support it, so let's implement this manually
 * {@link https://rollupjs.org/plugin-development/ Plugin Development Docs}
 */
import type { CompileOptions } from '@mdx-js/mdx';
import { createFormatAwareProcessors } from '@mdx-js/mdx/lib/util/create-format-aware-processors.js';
import { createFilter, dataToEsm, type FilterPattern } from '@rollup/pluginutils';
import path from 'node:path';
import fs from 'fs';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import type { Plugin } from 'vite';
import satori from 'satori';
import { sha1 } from 'object-hash';
import type { CompiledMdx } from '../../src/types/vfile';
import { getFonts } from './fonts';
import { ArtboardImage, sizes as artboardSizes } from './artboard';


type Options = CompileOptions & {
  /** list of patterns to include */
  include: FilterPattern;
  /** list of patterns to exclude */
  exclude?: FilterPattern;
  /** compress or not result module */
  compress?: boolean;
  /** Path where to place generated images */
  imageGenerationPath: string;
};

/** Compiles mdx to a function-body in a tree-shakable module & generate images from frontmatter */
export function mdx(options: Options): Plugin {

  const { include, exclude, compress, imageGenerationPath, ...compileOptions } = options;
  const { extnames, process } = createFormatAwareProcessors(compileOptions);
  const filter = createFilter(include, exclude);

  const generateImages = async (file: VFile): Promise<string> => {
    const slug = path.parse(file.path).name;
    const dir = path.join(imageGenerationPath, slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const images = await fs.promises.readdir(dir);
    const imageHash = sha1(file.data.matter?.image ?? '');
    // delete old images != current image hash
    await Promise.all(images.map(async f => {
      const fullPath = path.join(dir, f);
      if (!f.startsWith(imageHash)) {
        await fs.promises.rm(fullPath);
      }
    }));
    // og for opengraph
    const isUpToDateOpenGraph = images.includes(`${imageHash}.svg`) && images.includes(`${imageHash}.og.png`);
    // sm for small
    const isUpToDateArtboard = images.includes(`${imageHash}.sm.svg`);

    const fonts = await getFonts();

    const title = file.data.matter?.image?.title ?? slug;
    const text = file.data.matter?.image?.text;
    const theme: 'dark' | 'light' = file.data.matter?.image?.theme ?? 'light';

    // TODO: change default to use base64 local file
    const background = file.data.matter?.image?.background ?? 'url("https://vchirikov.github.io/assets/img/bg.svg")';

    if (!isUpToDateArtboard) {
      const svg_artboard_xs = await satori(ArtboardImage({
        size: 'xs',
        background,
        text,
        title,
        theme,
      }), { ...artboardSizes.xs, fonts });
      await fs.promises.writeFile(path.join(dir, `${imageHash}.sm.svg`), svg_artboard_xs, { encoding: 'utf8' });
    }

    return imageHash;
  };

  return {
    name: 'rollup-plugin-mdx',

    async transform(code: string, id: string) {
      const file = new VFile({ value: code, path: id });

      if (
        file.extname &&
        filter(file.path) &&
        extnames.includes(file.extname)
      ) {
        matter(file, { strip: true });
        const compilePromise = process(file);
        const generateImagesPromise = generateImages(file);
        const [compiled, imageHash] = await Promise.all([compilePromise, generateImagesPromise]);
        const result: CompiledMdx = {
          matter: file.data.matter,
          code: compiled.value.toString('utf8'),
          imageHash,
        };
        return dataToEsm(result, {
          preferConst: true,
          compact: compress ?? false,
          namedExports: true,
          indent: compress === true ? '' : '  ',
        });
      }
    }
  };
}
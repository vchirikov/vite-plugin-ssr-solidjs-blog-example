/** @file
 * we want to compile mdx to function-body (because we want to separate bundles for
 * each page )
 * @mdx-js/rollup doesn't support it, so let's implement this manually
 * {@link https://rollupjs.org/plugin-development/ Plugin Development Docs}
 */
import fs from 'node:fs';
import path from 'node:path';

import type { CompileOptions } from '@mdx-js/mdx';
import { createFormatAwareProcessors } from '@mdx-js/mdx/lib/util/create-format-aware-processors.js';
import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import { createFilter, dataToEsm, type FilterPattern } from '@rollup/pluginutils';
import { sha1 } from 'object-hash';
import satori from 'satori';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import type { Plugin } from 'vite';

import type { CompiledMdx } from '../../src/types/vfile';
import { ArtboardImage, sizes as artboardSizes } from './artboard';
import { getFontFiles, getFonts } from './fonts';
import { OpenGraphImage, size as openGraphSize } from './opengraph';


type Options = CompileOptions & {
  /** list of patterns to include */
  include: FilterPattern;
  /** list of patterns to exclude */
  exclude?: FilterPattern;
  /** compress or not result module */
  compress?: boolean;
  /** Path where to place generated images */
  imageGenerationPath: string;
  author: {
    name: string;
    /** should be a full url, because it will be used in OpenGraph images */
    avatarUrl: string;
  };
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

    const promises = [];
    if (!isUpToDateOpenGraph) {
      promises.push(generateOpenGraph());
    }

    if (!isUpToDateArtboard) {
      promises.push(generateArtBoard());
    }

    if (promises.length > 0)
      await Promise.all(promises);

    return imageHash;

    async function generateArtBoard() {
      const svg_artboard_xs = await satori(ArtboardImage({
        size: 'xs',
        background,
        text,
        title,
        theme,

      }), { ...artboardSizes.xs, fonts });
      await fs.promises.writeFile(path.join(dir, `${imageHash}.sm.svg`), svg_artboard_xs, { encoding: 'utf8' });
    }

    async function generateOpenGraph() {
      const { name, avatarUrl } = options.author;
      const svg_opengraph = await satori(OpenGraphImage({
        avatarUrl: avatarUrl,
        authorName: name,
        background,
        text,
        title,
        theme
      }), { ...openGraphSize, fonts });
      const fullSvgPath = path.join(dir, `${imageHash}.svg`);
      await fs.promises.writeFile(fullSvgPath, svg_opengraph, { encoding: 'utf8' });
      // opengraph uses jpg/gif/png (at least telegram.org does not support svg for images)
      // [sharp doesn't support embedded svg](https://github.com/lovell/sharp/issues/1378)
      // so we can use rust-based [@resvg/resvg-js - npm](https://www.npmjs.com/package/@resvg/resvg-js)
      const pngPath = path.join(dir, `${imageHash}.og.png`);

      const opts: ResvgRenderOptions = {
        background: theme === 'light' ? 'white' : 'black',
        fitTo: {
          mode: 'width',
          value: openGraphSize.width
        },
        font: {
          fontFiles: getFontFiles(),
          loadSystemFonts: false,
          defaultFontFamily: fonts[0]!.name
        }
      };

      const resvg = new Resvg(svg_opengraph, opts);
      // we also can use resvg.resolveImage() to add some images without urls
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();
      await fs.promises.writeFile(pngPath, pngBuffer, 'binary');
    }
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
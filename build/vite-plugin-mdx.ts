/** @file
 * we want to compile mdx to function-body (because we want to separate bundles for
 * each page )
 * @mdx-js/rollup doesn't support it, so let's implement this manually
 * {@link https://rollupjs.org/plugin-development/ Plugin Development Docs}
 */
import type { CompileOptions } from '@mdx-js/mdx';
import { createFormatAwareProcessors } from '@mdx-js/mdx/lib/util/create-format-aware-processors.js';
import { createFilter, dataToEsm, type FilterPattern } from '@rollup/pluginutils';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import type { Plugin } from 'vite';

type Options = CompileOptions & {
  /** list of patterns to include */
  include: FilterPattern;
  /** list of patterns to exclude */
  exclude?: FilterPattern;
  /** compress or not result module */
  compress?: boolean;
};

/** Compiles mdx to a function-body in a tree-shakable module */
export function mdx(options: Options): Plugin {

  const { include, exclude, compress, ...compileOptions } = options;
  const { extnames, process } = createFormatAwareProcessors(compileOptions);
  const filter = createFilter(include, exclude);

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
        const compiled = await process(file);
        return dataToEsm({
          matter: file.data.matter,
          code: compiled.value.toString('utf8'),
          // TODO: add into plugin or move image_hash to here?
          // TODO: add generation of the og image
        }, {
          preferConst: true,
          compact: compress ?? false,
          namedExports: true,
          indent: compress === true ? '' : '  ',
        });
      }
    }
  };
}
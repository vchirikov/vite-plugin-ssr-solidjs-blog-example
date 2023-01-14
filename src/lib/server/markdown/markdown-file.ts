import path from 'path';
import { type Compatible, VFile } from 'vfile';
import { matter } from 'vfile-matter';

import type { Frontmatter } from './frontmatter';
import { compileMdx } from './markdown';

export class MarkdownFile {
  public static readonly extensionRegex = /\.mdx?$/;

  private readonly vfile: VFile;

  private matter?: Frontmatter;

  public get content(): string {
    if (!this.matter)
      this.read();
    return String(this.vfile.value);
  }

  public get frontmatter(): Frontmatter {
    if (!this.matter)
      this.read();
    return this.matter;
  }

  public get slug(): string {
    return this.filename.replace(MarkdownFile.extensionRegex, '');
  }

  public get filename(): string {
    return path.basename(this.vfile.path);
  }

  public get path(): string {
    return this.vfile.path;
  }

  /**
   * ctor
   * @param data vFile compatible, it's better to use with new VFile({ path: post.filename, value: post.content }),
   *  because filename might be used for format detection (mdx/md)
   */
  public constructor(data: Compatible) {
    this.vfile = new VFile(data);
  }

  private read(): void {
    matter(this.vfile, { strip: true });
    this.matter = this.vfile.data.matter;
  }

  public compile(relativePath: string): Promise<string> {
    if (!this.matter)
      this.read();
    return compileMdx(this.vfile, relativePath, 'detect');
  }
}

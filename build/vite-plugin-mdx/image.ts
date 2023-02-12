/* eslint-disable solid/reactivity */
import { html } from 'satori-html';

export interface ImageProps {
  title?: string;
  text?: string;
  authorName?: string;
  theme: 'dark' | 'light';
  fontSize?: {
    title: string;
    small: string;
    author: string;
  };
  border?: string;
  avatar?: {
    url: string;
    size: {
      width: number;
      height: number;
    };
  };
  /** examples :
   * `url(https://via.placeholder.com/300)`
   * or
   * `linear-gradient(to bottom, #dbf4ff, #fff1f1)`
   * <https://github.com/vercel/satori/issues/290>
   * "it needs to be either a base64 data URI string, or a URL of that image that can be fetched."
   * but in the real world it doesn't work for now: <https://github.com/vercel/satori/issues/304>
   * at least in "satori": "^0.0.44", so ONLY absolute url to the site is supported.
   *  */
  background?: string;
  outerPadding?: number;
  size: {
    width: number;
    height: number;
  };
  debug?: boolean;
}

export const Image = (props: ImageProps): VNode => {
  const { debug, border, theme, title, text, authorName, avatar, background, size } = props;
  const outerPadding = props.outerPadding ?? 0;
  const primaryColor = theme === 'dark' ? 'black' : 'white';
  const secondaryColor = theme === 'dark' ? 'white' : 'black';
  const fontSize = props.fontSize ?? {
    small: '24px',
    title: '48px',
    author: '36px',
  };

  /**
   * I didn't find a way to use solid-js to render tsx into VDom elements without pain, so let's use satori-html
   * note, that satori uses `twrnc` for tailwind styles use tw attribute
   */
  return html(`
    <div
      tw="flex flex-nowrap"
      style='font-family: "Consolas NF"; padding: ${outerPadding}px; font-size: ${fontSize.small}; background: ${background ?? primaryColor}; width: ${size.width}; height: ${size.height}; ${(debug ? 'background: red;' : '')}'
    >
      ${/* inner panel with border flex direction: ⬇️ */''}
      <div
        tw="flex p-2 m-0 flex-col flex-nowrap items-stretch justify-between flex-1 h-full"
        style='${border ? `border: ${border};` : ''} border-color: ${secondaryColor}; ${debug ? 'background: orange;' : ''}'
      >
        <div
          id="main"
          tw="flex flex-1 items-end font-semibold"
          style='${debug ? 'background: gray;' : ''} color: ${secondaryColor}; font-size: ${fontSize.title}; line-height: ${fontSize.title}; letter-spacing: -0.025em;'
          ,
        }}>
          ${title}
        </div>

        <div
          id="footer"
          tw="flex flex-row justify-between items-end"
          style="${debug ? 'background: blue;' : ''} height: 50%;"
        }}>

        <div
          tw="flex flex-col flex-1 self-stretch justify-between items-stretch"
          style="${debug ? 'background: yellow;' : ''}"
        >
          <div
            id="description"
            tw="flex flex-1 mt-2"
            style="color: ${secondaryColor}; font-size: ${fontSize.small}; line-height: ${fontSize.small}; letter-spacing: -0.025em;"
          >
            ${text ?? ''}
          </div>
          <div
            id="author_name"
            tw="flex"
            style="color: ${secondaryColor}; font-size: ${fontSize.author}; letter-spacing: -0.025em;"
          >
            ${(authorName ?? '')}
          </div>
        </div>

        ${avatar ? `<img src="${avatar.url}" alt="author avatar" style="border-radius: 50%; margin-left: auto;" width="${avatar.size.width}" height="${avatar.size.height}" />` : ''}

        </div>
      </div>
    </div>
  `);
};
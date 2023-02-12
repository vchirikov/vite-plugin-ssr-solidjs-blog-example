import { Component, JSX } from 'solid-js';


export interface ImageProps {
  title?: JSX.Element;
  text?: JSX.Element;
  author_name?: JSX.Element;
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
  outer_padding?: number;
  size: {
    width: number;
    height: number;
  };
  debug?: boolean;
}

export const Image: Component<ImageProps> = (props: ImageProps) => {
  const { debug, border, theme, title, text, author_name, avatar, background, size } = props;
  const outer_padding = props.outer_padding ?? 0;
  const primaryColor = theme === 'dark' ? 'black' : 'white';
  const secondaryColor = theme === 'dark' ? 'white' : 'black';
  const fontSize = props.fontSize ?? {
    small: '24px',
    title: '48px',
    author: '36px',
  };
  /** satori uses `twrnc` for tailwind styles, maybe later they will support full tailwindcss,
   *  but for now clean css is ok for me.
   */
  return (
    <div
      style={{
        fontFamily: '"Consolas NF"',
        display: 'flex',
        flexWrap: 'nowrap',
        padding: `${outer_padding}px`,
        fontSize: fontSize.small,
        background: background ?? primaryColor,
        ...size,
        ...(debug ? { background: 'red' } : {}),
        ...(background ? { backgroundSize: `${size.width}px ${size.height}px` } : {}),
      }}
    >
      {/* inner panel with border flex direction: ⬇️ */}
      <div
        style={{
          padding: '2%',
          margin: 0,
          borderColor: secondaryColor,
          border: border ?? '0',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flex: 1,
          height: '100%',
          ...(debug ? { background: 'orange' } : {}),
        }}
      >
        <div id="main" style={{
          ...(debug ? { background: 'gray' } : {}),
          flex: 1,
          display: 'flex',
          alignItems: 'flex-end',
          fontWeight: 600,
          color: secondaryColor,
          fontSize: fontSize.title,
          lineHeight: fontSize.title,
          letterSpacing: '-0.025em',
        }}>
          {title}
        </div>
        <div id="footer" style={{
          ...(debug ? { background: 'blue' } : {}),
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '50%',
        }}>
          <div style={{
            ...(debug ? { background: 'yellow' } : {}),
            display: 'flex',
            flex: 1,
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignContent: 'stretch',
            alignItems: 'stretch',
          }}>
            <div id="description" style={{
              flex: 1,
              marginTop: '2rem',
              display: 'flex',
              color: secondaryColor,
              fontSize: fontSize.small,
              lineHeight: fontSize.small,
              letterSpacing: '-0.025em',
            }}>
              {text}
            </div>
            <div id="author_name"
              style={{
                color: secondaryColor,
                fontSize: fontSize.author,
                letterSpacing: '-0.025em',
              }}
            >
              {author_name}
            </div>
          </div>
          {!!avatar && (
            <img
              src={avatar.url}
              alt="author avatar"
              style={{
                borderRadius: '50%',
                marginLeft: 'auto',
              }}
              width={avatar.size.width}
              height={avatar.size.height}
            />
          )}
        </div>
      </div>
    </div>
  );
};

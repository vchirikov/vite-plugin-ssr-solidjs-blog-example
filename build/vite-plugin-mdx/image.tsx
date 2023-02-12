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
        "font-family": '"Consolas NF"',
        display: 'flex',
        "flex-wrap": 'nowrap',
        padding: `${outer_padding}px`,
        "font-size": fontSize.small,
        background: background ?? primaryColor,
        width: size.width.toString(),
        height: size.height.toString(),
        ...(debug ? { background: 'red' } : {}),
        ...(background ? { 'background-size': `${size.width}px ${size.height}px` } : {}),
      }}
    >
      {/* inner panel with border flex direction: ⬇️ */}
      <div
        style={{
          padding: '2%',
          margin: 0,
          'border-color': secondaryColor,
          border: border ?? '0',
          display: 'flex',
          'flex-direction': 'column',
          'flex-wrap': 'nowrap',
          'align-items': 'stretch',
          'justify-content': 'space-between',
          flex: 1,
          height: '100%',
          ...(debug ? { background: 'orange' } : {}),
        }}
      >
        <div id="main" style={{
          ...(debug ? { background: 'gray' } : {}),
          flex: 1,
          display: 'flex',
          'align-items': 'flex-end',
          'font-weight': 600,
          color: secondaryColor,
          'font-size': fontSize.title,
          'line-height': fontSize.title,
          'letter-spacing': '-0.025em',
        }}>
          {title}
        </div>
        <div id="footer" style={{
          ...(debug ? { background: 'blue' } : {}),
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'space-between',
          'align-items': 'flex-end',
          height: '50%',
        }}>
          <div style={{
            ...(debug ? { background: 'yellow' } : {}),
            display: 'flex',
            flex: 1,
            'align-self': 'stretch',
            'flex-direction': 'column',
            'justify-content': 'space-between',
            'align-content': 'stretch',
            'align-items': 'stretch',
          }}>
            <div id="description" style={{
              flex: 1,
              'margin-top': '2rem',
              display: 'flex',
              color: secondaryColor,
              'font-size': fontSize.small,
              'line-height': fontSize.small,
              'letter-spacing': '-0.025em',
            }}>
              {text}
            </div>
            <div id="author_name"
              style={{
                color: secondaryColor,
                'font-size': fontSize.author,
                'letter-spacing': '-0.025em',
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
                'border-radius': '50%',
                'margin-left': 'auto',
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

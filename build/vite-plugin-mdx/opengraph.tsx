import type { ImageProps } from './image';
import { Image } from './image';

/** same as Image but with predefined sizes */
export type OpenGraphImageProps =
  Omit<ImageProps, 'fontSize' | 'outer_padding' | 'avatar' | 'size' | 'border'>
  & { avatar_url: string; };

export const size = { width: 1200, height: 630 };
export const avatarSize = { width: 256, height: 256 };

export const OpenGraphImage = (props: OpenGraphImageProps) => <Image
  {...props}
  avatar={{
    url: props.avatar_url,
    size: avatarSize,
  }}
  border='4px solid'
  outer_padding={20}
  fontSize={{
    small: '24px',
    title: '48px',
    author: '36px',
  }}
  size={size}

/>;

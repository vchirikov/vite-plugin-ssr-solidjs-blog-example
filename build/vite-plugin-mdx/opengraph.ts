/* eslint-disable solid/reactivity */
import type { ImageProps } from './image';
import { Image } from './image';

/** same as Image but with predefined sizes */
export type OpenGraphImageProps =
  Omit<ImageProps, 'fontSize' | 'outerPadding' | 'avatar' | 'size' | 'border'>
  & { avatarUrl: string; };

export const size = { width: 1200, height: 630 };
export const avatarSize = { width: 256, height: 256 };

export const OpenGraphImage = (props: OpenGraphImageProps): VNode => Image({
  ...props,
  avatar: {
    url: props.avatarUrl,
    size: avatarSize,
  },
  border: '4px solid',
  outerPadding: 20,
  fontSize: {
    small: '24px',
    title: '48px',
    author: '36px',
  },
  size,
});
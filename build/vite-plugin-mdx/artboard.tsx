import { Component } from 'solid-js';
import type { ImageProps } from './image';
import { Image } from './image';

/** same as Image but with predefined sizes */
export type ArtboardImageProps =
  Omit<ImageProps, 'fontSize' | 'avatar' | 'size' | 'author_name'>
  & { size: 'xs' /* | 'sm' | 'md' | 'base' | 'lg' | 'xl' */; };

const fontSizes = {
  xs: {
    small: '18px',
    title: '48px',
    author: '36px',
  },
};

// take sizes from https://daisyui.com/components/artboard/
export const sizes = {
  xs: { width: 568, height: 320 },
};

export const ArtboardImage: Component<ArtboardImageProps> = (props: ArtboardImageProps) => <Image
  {...props}
  fontSize={fontSizes[props.size]}
  size={sizes[props.size]}
/>;

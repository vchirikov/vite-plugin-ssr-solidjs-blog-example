import fs from 'fs';

declare type Weight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
declare type Style = 'normal' | 'italic';
interface FontOptions {
  data: Buffer | ArrayBuffer;
  name: string;
  weight?: Weight;
  style?: Style;
}
let fonts: FontOptions[] | undefined;

export const getFontFiles = (): string[] => [
  'public/assets/fonts/consolas_nf.ttf',
  'public/assets/fonts/consolas_nf_bold.ttf',
];

export const getFonts = async (): Promise<FontOptions[]> => {
  if (!fonts) {
    const [consolasNf, consolasNfBold] = await Promise.all(getFontFiles().map(f => fs.promises.readFile(f)));
    fonts = [
      {
        name: 'Consolas NF',
        data: consolasNf!,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Consolas NF Bold',
        data: consolasNfBold!,
        weight: 600,
        style: 'normal',
      },
    ];
  }
  return fonts;
};

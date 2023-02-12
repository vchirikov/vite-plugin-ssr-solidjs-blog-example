/* eslint-disable solid/no-innerhtml */
import { Link, Meta, Title } from '@solidjs/meta';
import { type Component, Show } from 'solid-js';

import { useConfiguration, usePageContext } from '#client/hooks';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { addTrailingSlash } from '#shared/utils';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  post?: {
    image: string;
    date?: Date;
    modified_date?: Date;
  };
}

export const PageDescription: Component<Props> = (props) => {
  const cfg = useConfiguration();
  const { LL, locale } = useI18nContext();
  const { urlPathname } = usePageContext();
  const url = `${cfg.servedUrl}${addTrailingSlash(urlPathname)}`;
  return (
    <>
      <Title>{`${props.title} | ${LL().site_title()}`}</Title>
      <Meta name="description" content={props.description ?? LL().meta_description()} />
      <Meta name="author" content={LL().author()} />
      <Meta property="og:url" content={url} />
      <Meta property="og:title" content={`${props.title}. ${props.description ?? LL().meta_description()}`} />
      <Meta property="og:description" content={props.description ?? LL().meta_description()} />
      <Meta property="og:locale" content={locale()} />
      <Meta property="og:site_name" content={LL().site_title()} />
      <Show when={props.canonical}>
        <Link rel="canonical" href={props.canonical} />
      </Show>
      <Show when={props.post} fallback={<Meta property="og:type" content="website" />}>
        <Meta property="og:type" content="article" />
        <Meta property="og:image" content={`${cfg.servedUrl}/${props.post.image}.og.png`} />
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta property="article:published_time" content={new Date(props.post.date || new Date()).toISOString()} />
        <Meta property="article:modified_time" content={new Date(props.post.modified_date || new Date()).toISOString()} />
        <script type="application/ld+json" innerHTML={`
        {
          "description": ${JSON.stringify(props.description ?? LL().meta_description())},
          "author": {
            "@type": "Person",
            "name": ${JSON.stringify(LL().author())}
          },
          "@type": "BlogPosting",
          "url": "${url}",
          "publisher": {
            "@type": "Organization",
            "logo": {
              "@type": "ImageObject",
              "url": "${cfg.servedUrl}/${props.post.image}.og.png"
            },
            "name": ${JSON.stringify(LL().author())}
          },
          "headline": ${JSON.stringify(`${props.title} | ${LL().site_title()}`)},
          "image": ["${cfg.servedUrl}/${props.post.image}"],
          "datePublished": "${new Date(props.post.date || new Date()).toISOString()}",
          "dateModified": "${new Date(props.post.modified_date || new Date()).toISOString()}",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${url}"
          },
          "@context": "http://schema.org"
        }`}
        />
      </Show>
    </>
  );
};

import { addTrailingSlash } from '#shared/utils';
import { type Component } from 'solid-js';

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

const ScriptJdJson: Component<Props> = (props) => {
  const html = `
  {
    "description": ${JSON.stringify(props.description)},
    "author": {
      "@type": "Person",
      "name": ${JSON.stringify(props.author)}
    },
    "@type": "BlogPosting",
    "url": "${props.url}",
    "publisher": {
      "@type": "Organization",
      "logo": {
        "@type": "ImageObject",
        "url": "${process.env.servedUrl}/${props.post.image}.og.png"
      },
      "name": ${JSON.stringify(author)}
    },
    "headline": ${JSON.stringify(`${props.title} | ${site_title}`)},
    "image": ["${process.env.servedUrl}/${props.post.image}"],
    "datePublished": "${new Date(props.post.date || new Date()).toISOString()}",
    "dateModified": "${new Date(props.post.modified_date || new Date()).toISOString()}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${process.env.servedUrl}/${addTrailingSlash(router.asPath)}"
    },
    "@context": "http://schema.org"
  }`;
  return <script innerHTML={html />}>
};

    export default ScriptJdJson;;;;;;;
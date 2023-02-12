import { useI18nContext } from '#shared/i18n/i18n-solid';
import type { Component } from 'solid-js';

export const NotFound: Component = () => {
  const { LL } = useI18nContext();
  // TODO: add better layout
  return (<div>{LL().not_found()}</div>);
};
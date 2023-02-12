import { useI18nContext } from '#shared/i18n/i18n-solid';
import type { Component } from 'solid-js';

export const LoadingIndicator: Component = () => {
  const { LL } = useI18nContext();
  // TODO: add spinkit indicator
  return (
    <div>{LL().loading()}...</div>
  );
};



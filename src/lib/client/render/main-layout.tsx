import '#src/styles/global.css';
import '#src/styles/tailwind-prism-vsc-dark-plus.css';
import '#src/styles/prism.css';

import type { ParentComponent } from 'solid-js';
import { For } from 'solid-js';

import { A } from '#client/components/a';
import { StorkModal } from '#client/components/stork';
import { ThemeSwitcher } from '#client/components/theme-switcher';
import { Services } from '#client/container';
import { useConfiguration, useContainer, usePageContext } from '#client/hooks';
import { useI18nContext } from '#shared/i18n/i18n-solid';
import { locales } from '#shared/i18n/i18n-util';

export const MainLayout: ParentComponent<unknown> = (props) => {
  const cfg = useConfiguration();
  const pageContext = usePageContext();
  const { LL } = useI18nContext();
  const version = useContainer().get<string>(Services.Version);
  return (
    <div class="drawer drawer-end">
      <input id="drawer" type="checkbox" class="drawer-toggle" />
      <StorkModal name="search-modal" />
      <div class="drawer-content flex flex-1 flex-col flex-nowrap items-stretch">
        <div class="navbar border-base-content/5 bg-base-100 shadow-base-content z-10 select-none border-b drop-shadow-lg">
          <div class="flex-1">
            <A href="/" tabIndex='0' class="btn-ghost btn-circle avatar btn">
              <div class="w-12 rounded-full">
                <img alt="ava" src={`${cfg.servedUrl}/assets/img/ava.jpg`} />
              </div>
            </A>
            <A href="/" class="prose-sm prose md:prose-xl mx-2 font-semibold">
              {LL().site_title()}
            </A>
          </div>
          <div class="block sm:hidden">
            <label for="drawer" class="drawer-button btn btn-sm btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
          </div>
          <div class="hidden flex-row-reverse gap-2 sm:flex">
            <label
              for="search-modal"
              class="input-bordered input h-9 select-none leading-9 opacity-50 transition-opacity hover:opacity-80 focus:opacity-80 sm:w-32 md:w-48 lg:w-64"
            >
              {LL().search()}
            </label>
            <div class="flex flex-row items-center">
              <For each={locales}>
                {locale => (
                  <div class="opacity-50 transition-opacity hover:opacity-80">
                    <A href={pageContext.urlPathname} locale={locale} class="btn-xs btn m-1">
                      {locale.toUpperCase()}
                    </A>
                  </div>
                )}
              </For>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
        <div class="bg-base-300 flex flex-1 flex-col flex-nowrap">
          <div class="border-secondary-content/5 bg-base-100 m-3 mx-auto w-full max-w-[78rem] flex-1 rounded-md border shadow">
            {props.children}
          </div>
        </div>

        <footer class="footer border-base-content/5 bg-neutral text-neutral-content shadow-base-content/20 flex flex-row flex-nowrap items-center justify-between border-t-2 py-2 px-4 md:px-6 lg:py-1">
          <div class="flex select-none flex-col text-xs leading-3">
            <p class="opacity-60 transition-opacity hover:opacity-80">Copyright © {new Date().getFullYear()}</p>
            <p class="opacity-20 transition-opacity hover:opacity-80">Version: {version}</p>
          </div>
          <div class="flex flex-row flex-nowrap items-center">
            <a
              href="https://t.me/+RROSXUhWMNc3NDgy"
              class="opacity-50 transition-opacity hover:opacity-80 focus:opacity-80"
            >
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12,0c-6.627,0 -12,5.373 -12,12c0,6.627 5.373,12 12,12c6.627,0 12,-5.373 12,-12c0,-6.627 -5.373,-12 -12,-12Zm0,2c5.514,0 10,4.486 10,10c0,5.514 -4.486,10 -10,10c-5.514,0 -10,-4.486 -10,-10c0,-5.514 4.486,-10 10,-10Zm2.692,14.889c0.161,0.115 0.368,0.143 0.553,0.073c0.185,-0.07 0.322,-0.228 0.362,-0.42c0.435,-2.042 1.489,-7.211 1.884,-9.068c0.03,-0.14 -0.019,-0.285 -0.129,-0.379c-0.11,-0.093 -0.263,-0.12 -0.399,-0.07c-2.096,0.776 -8.553,3.198 -11.192,4.175c-0.168,0.062 -0.277,0.223 -0.271,0.4c0.006,0.177 0.125,0.33 0.296,0.381c1.184,0.354 2.738,0.847 2.738,0.847c0,0 0.725,2.193 1.104,3.308c0.047,0.139 0.157,0.25 0.301,0.287c0.145,0.038 0.298,-0.001 0.406,-0.103c0.608,-0.574 1.548,-1.461 1.548,-1.461c0,0 1.786,1.309 2.799,2.03Zm-5.505,-4.338l0.84,2.769l0.186,-1.754c0,0 3.243,-2.925 5.092,-4.593c0.055,-0.048 0.062,-0.13 0.017,-0.188c-0.045,-0.057 -0.126,-0.071 -0.188,-0.032c-2.143,1.368 -5.947,3.798 -5.947,3.798Z" />
              </svg>
            </a>
            <a
              href="https://github.com/vchirikov"
              class="opacity-50 transition-opacity hover:opacity-80 focus:opacity-80"
            >
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 6c-3.313 0-6 2.686-6 6 0 2.651 1.719 4.9 4.104 5.693.3.056.396-.13.396-.289v-1.117c-1.669.363-2.017-.707-2.017-.707-.272-.693-.666-.878-.666-.878-.544-.373.041-.365.041-.365.603.042.92.619.92.619.535.917 1.403.652 1.746.499.054-.388.209-.652.381-.802-1.333-.152-2.733-.667-2.733-2.965 0-.655.234-1.19.618-1.61-.062-.153-.268-.764.058-1.59 0 0 .504-.161 1.65.615.479-.133.992-.199 1.502-.202.51.002 1.023.069 1.503.202 1.146-.776 1.648-.615 1.648-.615.327.826.121 1.437.06 1.588.385.42.617.955.617 1.61 0 2.305-1.404 2.812-2.74 2.96.216.186.412.551.412 1.111v1.646c0 .16.096.347.4.288 2.383-.793 4.1-3.041 4.1-5.691 0-3.314-2.687-6-6-6z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/0x4351"
              class="opacity-50 transition-opacity hover:opacity-80 focus:opacity-80"
            >
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.5 8.778c-.441.196-.916.328-1.414.388.509-.305.898-.787 1.083-1.362-.476.282-1.003.487-1.564.597-.448-.479-1.089-.778-1.796-.778-1.59 0-2.758 1.483-2.399 3.023-2.045-.103-3.86-1.083-5.074-2.572-.645 1.106-.334 2.554.762 3.287-.403-.013-.782-.124-1.114-.308-.027 1.14.791 2.207 1.975 2.445-.346.094-.726.116-1.112.042.313.978 1.224 1.689 2.3 1.709-1.037.812-2.34 1.175-3.647 1.021 1.09.699 2.383 1.106 3.773 1.106 4.572 0 7.154-3.861 6.998-7.324.482-.346.899-.78 1.229-1.274z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
      <div class="drawer-side">
        <label for="drawer" class="drawer-overlay" />
        <div class="bg-base-100 text-base-content w-5/6 max-w-2xl">
          <div class="flex h-full w-full flex-col flex-nowrap items-center justify-start p-3">
            <label
              for="search-modal"
              class="input-bordered input mb-4 h-9 w-full select-none leading-9 opacity-50 transition-opacity hover:opacity-80 focus:opacity-80 "
            >
              {LL().search()}
            </label>
            <div class="w-full  font-mono text-sm">{LL().settings()}:</div>
            <div class="border-base-200/40 mt-2 flex w-full flex-row items-center justify-between border-y py-0">
              <div class="flex flex-row flex-nowrap items-center justify-start">
                <For each={locales}>{
                  locale => (
                    <div class="opacity-50 transition-opacity hover:opacity-80">
                      <A href={pageContext.urlPathname} locale={locale} prefetch={false} class="btn-xs btn m-1">
                        {locale.toUpperCase()}
                      </A>
                    </div>
                  )}
                </For>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
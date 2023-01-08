declare module 'svelte' {
  class SvelteComponent {

    /**
     *{@link https://svelte.dev/docs#run-time-server-side-component-api}
     * @param props An object of properties to supply to the component
     * @param options An object of options
     */
    render(props?: unknown, options?: { context?: Map<string, unknown>; }): {
      html: string;
      css: { code: string, map: null | string; },
      head: string;
    };
  }

}
export {}
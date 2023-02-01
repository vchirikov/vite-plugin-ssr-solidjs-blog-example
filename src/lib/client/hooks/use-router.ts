import { createSignal } from 'solid-js';

const [route, setRoute] = createSignal<string>('');

export useRouter() {
  const container = useContainer();
  const pageContext = container.get(Services.PageContext);

}
import '#src/styles/global.css';

import type { ParentComponent } from 'solid-js';

export const MainLayout: ParentComponent<{}> = (props) => {
  return (<div>{props.children}</div>);
};
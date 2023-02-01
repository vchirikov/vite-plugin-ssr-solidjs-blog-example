import { type Component, createSignal } from 'solid-js';

import type { SearchData } from '#src/types/stork';

import { StorkInput } from './stork-input.internal';
import { StorkResults } from './stork-results.internal';

interface StorkModalProps {
  name: string;
}
export const StorkModal: Component<StorkModalProps> = (props) => {

  const [visible, setVisible] = createSignal<boolean>(false);
  const [searchData, setSearchData] = createSignal<SearchData | undefined>();

  // if something went wrong with client-side routing, create a pageContext signal and use with:
  // createRenderEffect(() => setVisible(false));

  const onVisibleChange = (event) => {
    const { checked } = event.target;
    setVisible(checked);
  };

  return (
    <>
      <input type="checkbox" onChange={(event) => onVisibleChange(event)} checked={visible()} id={props.name} class="modal-toggle" />
      <label for={props.name} class="modal cursor-pointer">
        <label
          class="modal-box border-base-content/5 relative flex max-h-[83%] min-h-[50%] w-11/12 max-w-5xl flex-col items-stretch border p-0 shadow"
          for=""
        >
          <div class="bg-base-300 flex h-14 flex-row flex-nowrap items-center justify-between">
            <div class="form-control ml-4 h-14 flex-1 justify-center">
              <div class="h-9">
                <StorkInput name={props.name} searchDataCallback={setSearchData} />
              </div>
            </div>
            <label for={props.name} class="btn-sm btn-circle btn mx-2">
              ✕
            </label>
          </div>
          <div class="bg-base-200 flex w-full flex-1 flex-col flex-nowrap overscroll-none">
            <StorkResults searchData={searchData()} />
          </div>
        </label>
      </label>
    </>
  );
};

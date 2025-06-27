import { ref } from "vue";

export type FabOptions = {
  icon: string;
  onClick: () => void;
};

const fabState = ref<FabOptions | null>(null);

export function useFab() {
  function setFabState(options: FabOptions) {
    fabState.value = options;
  }

  function clearFabState() {
    fabState.value = null;
  }

  return {
    fabState,
    setFabState,
    clearFabState,
  };
}

import { ref } from "vue";

export type FabOptions = {
  active?: boolean;
  elevation?: number;
  icon: string;
  onClick: () => void;
};

const DEFAULT_FAB_OPTIONS: Partial<FabOptions> = {
  active: true,
  elevation: 8,
};

const fabState = ref<FabOptions | null>(null);

export function useFab() {
  function setFabState(options: FabOptions) {
    // Add a small delay when setting the FAB state
    setTimeout(() => {
      // Merge the provided options with defaults
      fabState.value = {
        ...DEFAULT_FAB_OPTIONS,
        ...options,
      };
    }, 100); // 100ms delay for entering
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

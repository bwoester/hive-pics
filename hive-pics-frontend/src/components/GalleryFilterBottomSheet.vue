<template>
  <v-bottom-sheet v-model="isOpen" max-width="600px">
    <v-card class="pa-4">
      <v-card-title class="text-h5 mb-2">Gallery Options</v-card-title>

      <v-card-text>
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">Group by</div>
          <v-chip-group
            v-model="selectedGrouping"
            mandatory
            selected-class="bg-primary text-white"
          >
            <v-chip
              v-for="option in groupingOptions"
              :key="option.value"
              filter
              :value="option.value"
              variant="elevated"
            >
              {{ option.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">Sort by</div>
          <v-chip-group
            v-model="selectedSorting"
            mandatory
            selected-class="bg-primary text-white"
          >
            <v-chip
              v-for="option in sortingOptions"
              :key="option.value"
              filter
              :value="option.value"
              variant="elevated"
            >
              {{ option.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">Sort direction</div>
          <v-chip-group
            v-model="selectedDirection"
            mandatory
            selected-class="bg-primary text-white"
          >
            <v-chip
              v-for="option in directionOptions"
              :key="option.value"
              filter
              :value="option.value"
              variant="elevated"
            >
              <v-icon start>{{ option.icon }}</v-icon>
              {{ option.label }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useGalleryStore } from "@/stores/galleryStore";

// Props and emits
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// Gallery store
const galleryStore = useGalleryStore();

// Bottom sheet state
const isOpen = ref(props.modelValue);

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    isOpen.value = newValue;
  },
);

// Watch for changes in the isOpen ref
watch(isOpen, (newValue) => {
  emit("update:modelValue", newValue);
});

// Grouping options
const groupingOptions = [
  { label: "No grouping", value: "none" },
  { label: "By author", value: "author" },
  { label: "By challenge", value: "challenge" },
];

// Sorting options
const sortingOptions = [
  { label: "Created date", value: "createdAt" },
  { label: "Likes", value: "likes" },
];

// Direction options - computed based on selected sorting option
const directionOptions = computed(() => {
  if (selectedSorting.value === "createdAt") {
    return [
      { label: "Oldest first", value: "asc", icon: "mdi-sort-ascending" },
      { label: "Newest first", value: "desc", icon: "mdi-sort-descending" },
    ];
  } else if (selectedSorting.value === "likes") {
    return [
      { label: "Fewest likes first", value: "asc", icon: "mdi-sort-ascending" },
      { label: "Most likes first", value: "desc", icon: "mdi-sort-descending" },
    ];
  }
  // Fallback to generic labels (should not happen)
  return [
    { label: "Ascending", value: "asc", icon: "mdi-sort-ascending" },
    { label: "Descending", value: "desc", icon: "mdi-sort-descending" },
  ];
});

// Selected options
const selectedGrouping = ref(galleryStore.groupingOption || "none");
const selectedSorting = ref(galleryStore.sortingOption || "createdAt");
const selectedDirection = ref(galleryStore.sortingDirection || "desc");

// Watch for changes in selected options and apply them directly
watch(selectedGrouping, (newValue) => {
  galleryStore.setGroupingOption(newValue);
});

watch(selectedSorting, (newValue) => {
  galleryStore.setSortingOption(newValue);
});

watch(selectedDirection, (newValue) => {
  galleryStore.setSortingDirection(newValue);
});
</script>

<style scoped>
.v-chip-group {
  flex-wrap: wrap;
}
</style>

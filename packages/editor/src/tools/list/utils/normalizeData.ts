import type {
  OldListData,
  ListData,
  ListItem,
  OldNestedListData,
} from '../types/ListParams';

function instanceOfOldListData(
  data: ListData | OldListData | OldNestedListData,
): data is OldListData {
  return typeof data.items[0] === 'string';
}

function instanceOfOldNestedListData(
  data: ListData | OldListData | OldNestedListData,
): data is OldNestedListData {
  return !('meta' in data);
}

export default function normalizeData(data: ListData | OldListData): ListData {
  const normalizedDataItems: ListItem[] = [];

  if (instanceOfOldListData(data)) {
    data.items.forEach((item) => {
      normalizedDataItems.push({
        content: item,
        meta: {},
        items: [],
      });
    });

    return {
      style: data.style,
      meta: {},
      items: normalizedDataItems,
    };
  } else if (instanceOfOldNestedListData(data)) {
    return {
      style: data.style,
      meta: {},
      items: data.items,
    };
  } else {
    return structuredClone(data);
  }
}

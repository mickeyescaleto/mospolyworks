export interface PasteEvent extends CustomEvent {
  detail: {
    data: HTMLUListElement | HTMLOListElement | HTMLLIElement;
  };
}

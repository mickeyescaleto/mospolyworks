export type HintParams = {
  title: string;
  description?: string;
  alignment?: HintTextAlignment;
};

export type HintPosition = 'top' | 'bottom' | 'left' | 'right';

export type HintTextAlignment = 'start' | 'center';

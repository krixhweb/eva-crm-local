
// Identify which stage (column) the user dropped the card into
export const getColumnFromPoint = (x: number, y: number): string | null => {
  const elements = document.elementsFromPoint(x, y);
  for (const element of elements) {
    const stageId = element.getAttribute('data-kanban-stage');
    if (stageId) return stageId;
  }
  return null;
};

// Calculate the new index within a column based on Y position
export const getIndexFromPoint = (y: number, columnElement: Element, ignoreId?: string): number => {
  const allCards = Array.from(columnElement.querySelectorAll('[data-kanban-card]'));
  
  // Filter out the card we are dragging so it doesn't affect calculation
  const cards = ignoreId 
    ? allCards.filter(c => c.getAttribute('data-kanban-card') !== ignoreId)
    : allCards;
  
  if (cards.length === 0) return 0;

  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    // If cursor is above the center of this card, insert before it
    if (y < center) {
      return i;
    }
  }

  // Otherwise append to end
  return cards.length;
};

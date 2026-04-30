const KOREAN_FOOD_MAP: Record<string, string> = {
  '우유': '🥛', '달걀': '🥚', '계란': '🥚', '고기': '🥩', '소고기': '🥩',
  '돼지고기': '🥓', '닭고기': '🍗', '야채': '🥦', '채소': '🥗', '빵': '🍞',
  '과일': '🍎', '사과': '🍎', '바나나': '🍌', '양파': '🧅', '마늘': '🧄',
  '대파': '🌿', '치즈': '🧀', '요거트': '🍦', '생선': '🐟', '김치': '🥬',
  '밥': '🍚', '라면': '🍜', '물': '💧', '커피': '☕',
};

/**
 * Searches for a high-quality food image using Wikipedia (for accuracy) 
 * or an Emoji service (for clean UI). Supports Korean natively.
 */
export const fetchFoodImage = async (name: string): Promise<string> => {
  const trimmedName = name.trim();
  
  // 1. Use high-res Emoji for curated common items
  if (KOREAN_FOOD_MAP[trimmedName]) {
    const emoji = KOREAN_FOOD_MAP[trimmedName];
    return `https://emojicdn.elk.sh/${emoji}?style=apple`;
  }

  // 2. Search Wikipedia in Korean for accurate real photos
  try {
    const response = await fetch(
      `https://ko.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=400&titles=${encodeURIComponent(trimmedName)}&origin=*`
    );
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      return pages[pageId].thumbnail.source;
    }
  } catch (error) {
    console.error('Wikipedia API error:', error);
  }

  // 3. Fallback to LoremFlickr with a random lock
  const lockId = Math.floor(Math.random() * 10000);
  return `https://loremflickr.com/300/300/${encodeURIComponent(trimmedName)},food/all?lock=${lockId}`;
};

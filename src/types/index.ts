
export interface GroceryItem {
  id: string;
  name: string;
  quantity?: string;
  priority: 'high' | 'medium' | 'low'; // أحمر، أصفر، أخضر
  isPurchased: boolean;
  createdAt: Date;
  daysUntilCritical?: number; // للمنتجات ذات الأولوية المتوسطة
  willBecomeCriticalAt?: Date; // التاريخ الذي ستصبح فيه المنتج "أساسي"
}

export interface GroceryListState {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
}

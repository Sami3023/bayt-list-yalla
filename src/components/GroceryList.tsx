
import { GroceryItem } from '@/components/GroceryItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Package
} from 'lucide-react';
import { GroceryItem as GroceryItemType } from '@/types';

interface GroceryListProps {
  items: GroceryItemType[];
  onTogglePurchased: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export const GroceryList = ({ items, onTogglePurchased, onDeleteItem }: GroceryListProps) => {
  const purchasedItems = items.filter(item => item.isPurchased);
  const unpurchasedItems = items.filter(item => !item.isPurchased);
  
  // ترتيب المنتجات غير المشتراة حسب الأولوية
  const sortedUnpurchasedItems = unpurchasedItems.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getCategoryStats = () => {
    const high = unpurchasedItems.filter(item => item.priority === 'high').length;
    const medium = unpurchasedItems.filter(item => item.priority === 'medium').length;
    const low = unpurchasedItems.filter(item => item.priority === 'low').length;
    
    return { high, medium, low };
  };

  const stats = getCategoryStats();

  if (items.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">لا توجد منتجات في القائمة</h3>
          <p className="text-muted-foreground">ابدأ بإضافة منتجات جديدة إلى قائمة التسوق</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات سريعة */}
      <Card className="animate-fade-in-scale">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            إحصائيات القائمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-muted-foreground">إجمالي المنتجات</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <div className="text-sm text-red-600">أساسي</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
              <div className="text-sm text-yellow-600">كمية قليلة</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{stats.low}</div>
              <div className="text-sm text-blue-600">اختياري</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{purchasedItems.length}</div>
              <div className="text-sm text-green-600">تم شراؤها</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* المنتجات غير المشتراة */}
      {unpurchasedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              المطلوب شراؤها ({unpurchasedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedUnpurchasedItems.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onTogglePurchased={onTogglePurchased}
                onDelete={onDeleteItem}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* المنتجات المشتراة */}
      {purchasedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              تم شراؤها ({purchasedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {purchasedItems.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onTogglePurchased={onTogglePurchased}
                onDelete={onDeleteItem}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

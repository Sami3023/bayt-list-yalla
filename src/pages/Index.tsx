
import { GroceryForm } from '@/components/GroceryForm';
import { GroceryList } from '@/components/GroceryList';
import { useGroceryList } from '@/hooks/useGroceryList';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBasket, 
  Sparkles, 
  Users,
  RefreshCw
} from 'lucide-react';

const Index = () => {
  const { 
    items, 
    isLoading, 
    error, 
    addItem, 
    togglePurchased, 
    deleteItem 
  } = useGroceryList();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium">جاري تحميل قائمة التسوق...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold mb-2">حدث خطأ</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* الترويسة */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <ShoppingBasket className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                مقاضي البيت
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-muted-foreground text-lg">
              منظم احتياجات منزلك الذكي
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>مشاركة مع العائلة</span>
              </div>
              <div className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>تحديث تلقائي</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* نموذج إضافة منتج */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <GroceryForm onAddItem={addItem} />
            </div>
          </div>

          {/* قائمة المنتجات */}
          <div className="lg:col-span-2">
            <GroceryList
              items={items}
              onTogglePurchased={togglePurchased}
              onDeleteItem={deleteItem}
            />
          </div>
        </div>
      </main>

      {/* التذييل */}
      <footer className="bg-white/50 border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-muted-foreground">
            مقاضي البيت - تطبيق ويب لإدارة قوائم التسوق المنزلية بكفاءة
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

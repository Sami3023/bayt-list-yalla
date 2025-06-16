
import { useState, useEffect, useCallback } from 'react';
import { GroceryItem, GroceryListState } from '@/types';
import { useToast } from '@/hooks/use-toast';

// محاكاة تخزين البيانات محليًا
const STORAGE_KEY = 'grocery-list-items';

export const useGroceryList = () => {
  const { toast } = useToast();
  const [state, setState] = useState<GroceryListState>({
    items: [],
    isLoading: true,
    error: null,
  });

  // تحميل البيانات من التخزين المحلي
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        const items: GroceryItem[] = JSON.parse(storedItems).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          willBecomeCriticalAt: item.willBecomeCriticalAt ? new Date(item.willBecomeCriticalAt) : undefined,
        }));
        setState(prev => ({ ...prev, items, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading grocery list:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'حدث خطأ في تحميل القائمة' 
      }));
    }
  }, []);

  // حفظ البيانات في التخزين المحلي
  const saveItems = useCallback((items: GroceryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving grocery list:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "لم يتم حفظ التغييرات بنجاح",
        variant: "destructive",
      });
    }
  }, [toast]);

  // إضافة منتج جديد
  const addItem = useCallback((item: Omit<GroceryItem, 'id' | 'createdAt'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      willBecomeCriticalAt: item.priority === 'medium' && item.daysUntilCritical 
        ? new Date(Date.now() + item.daysUntilCritical * 24 * 60 * 60 * 1000)
        : undefined,
    };

    setState(prev => {
      const newItems = [...prev.items, newItem];
      saveItems(newItems);
      return { ...prev, items: newItems };
    });

    toast({
      title: "تم إضافة المنتج",
      description: `تم إضافة "${item.name}" إلى القائمة بنجاح`,
    });
  }, [saveItems, toast]);

  // تحديث منتج
  const updateItem = useCallback((id: string, updates: Partial<GroceryItem>) => {
    setState(prev => {
      const newItems = prev.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      saveItems(newItems);
      return { ...prev, items: newItems };
    });
  }, [saveItems]);

  // حذف منتج
  const deleteItem = useCallback((id: string) => {
    setState(prev => {
      const itemToDelete = prev.items.find(item => item.id === id);
      const newItems = prev.items.filter(item => item.id !== id);
      saveItems(newItems);
      
      if (itemToDelete) {
        toast({
          title: "تم حذف المنتج",
          description: `تم حذف "${itemToDelete.name}" من القائمة`,
        });
      }
      
      return { ...prev, items: newItems };
    });
  }, [saveItems, toast]);

  // تحديث حالة الشراء
  const togglePurchased = useCallback((id: string) => {
    setState(prev => {
      const item = prev.items.find(item => item.id === id);
      if (!item) return prev;

      const newItems = prev.items.map(item => 
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      );
      saveItems(newItems);

      toast({
        title: item.isPurchased ? "تم إلغاء التحديد" : "تم تحديد كمشتراة",
        description: `"${item.name}" ${item.isPurchased ? 'لم تعد مشتراة' : 'تم شراؤها'}`,
      });

      return { ...prev, items: newItems };
    });
  }, [saveItems, toast]);

  // تحديث الأولويات تلقائيًا
  useEffect(() => {
    const updatePriorities = () => {
      const now = new Date();
      
      setState(prev => {
        let hasUpdates = false;
        const newItems = prev.items.map(item => {
          if (
            item.priority === 'medium' && 
            item.willBecomeCriticalAt && 
            now >= item.willBecomeCriticalAt &&
            !item.isPurchased
          ) {
            hasUpdates = true;
            return { ...item, priority: 'high' as const };
          }
          return item;
        });

        if (hasUpdates) {
          saveItems(newItems);
          toast({
            title: "تم تحديث الأولويات",
            description: "تم تحديث بعض المنتجات لتصبح أساسية",
          });
        }

        return hasUpdates ? { ...prev, items: newItems } : prev;
      });
    };

    // فحص الأولويات كل دقيقة
    const interval = setInterval(updatePriorities, 60000);
    
    // فحص فوري عند التحميل
    updatePriorities();

    return () => clearInterval(interval);
  }, [saveItems, toast]);

  return {
    ...state,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
  };
};

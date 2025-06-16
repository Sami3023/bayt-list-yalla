
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Package } from 'lucide-react';
import { GroceryItem } from '@/types';

interface GroceryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<GroceryItem, 'id' | 'createdAt'>) => void;
}

export const GroceryForm = ({ isOpen, onClose, onAddItem }: GroceryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    priority: 'medium' as const,
    daysUntilCritical: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    onAddItem({
      name: formData.name.trim(),
      quantity: formData.quantity.trim() || undefined,
      priority: formData.priority,
      isPurchased: false,
      daysUntilCritical: formData.priority === 'medium' ? formData.daysUntilCritical : undefined,
    });

    // إعادة تعيين النموذج
    setFormData({
      name: '',
      quantity: '',
      priority: 'medium',
      daysUntilCritical: 3,
    });
  };

  const handleClose = () => {
    // إعادة تعيين النموذج عند الإغلاق
    setFormData({
      name: '',
      quantity: '',
      priority: 'medium',
      daysUntilCritical: 3,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            إضافة منتج جديد
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم المنتج *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثل: أرز، لبن، خضار..."
              className="text-right"
              required
            />
          </div>

          <div>
            <Label htmlFor="quantity">الكمية (اختياري)</Label>
            <Input
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="مثل: 2 كيلو، 3 علب..."
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="priority">درجة الأهمية</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">أساسي (أحمر) - نفد المنتج</SelectItem>
                <SelectItem value="medium">كمية قليلة (أصفر) - يوشك على النفاد</SelectItem>
                <SelectItem value="low">اختياري (أخضر) - غير عاجل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.priority === 'medium' && (
            <div className="animate-slide-in-right">
              <Label htmlFor="days">عدد الأيام حتى يصبح أساسي</Label>
              <Select 
                value={formData.daysUntilCritical.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, daysUntilCritical: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">يوم واحد</SelectItem>
                  <SelectItem value="2">يومان</SelectItem>
                  <SelectItem value="3">3 أيام</SelectItem>
                  <SelectItem value="5">5 أيام</SelectItem>
                  <SelectItem value="7">أسبوع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              إضافة إلى القائمة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

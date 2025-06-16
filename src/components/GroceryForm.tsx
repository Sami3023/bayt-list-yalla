
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package } from 'lucide-react';
import { GroceryItem } from '@/types';

interface GroceryFormProps {
  onAddItem: (item: Omit<GroceryItem, 'id' | 'createdAt'>) => void;
}

export const GroceryForm = ({ onAddItem }: GroceryFormProps) => {
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

    setFormData({
      name: '',
      quantity: '',
      priority: 'medium',
      daysUntilCritical: 3,
    });
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'أساسي (أحمر)';
      case 'medium': return 'كمية قليلة (أصفر)';
      case 'low': return 'اختياري (أخضر)';
      default: return priority;
    }
  };

  return (
    <Card className="animate-fade-in-scale">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Package className="h-6 w-6 text-primary" />
          إضافة منتج جديد
        </CardTitle>
      </CardHeader>
      <CardContent>
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

          <Button type="submit" className="w-full" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            إضافة إلى القائمة
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

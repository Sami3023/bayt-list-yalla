
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Check, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Package2
} from 'lucide-react';
import { GroceryItem as GroceryItemType } from '@/types';
import { cn } from '@/lib/utils';

interface GroceryItemProps {
  item: GroceryItemType;
  onTogglePurchased: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GroceryItem = ({ item, onTogglePurchased, onDelete }: GroceryItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-red-500',
          bgClass: 'priority-high',
          icon: AlertCircle,
          label: 'أساسي',
          textColor: 'text-red-700'
        };
      case 'medium':
        return {
          color: 'bg-yellow-500',
          bgClass: 'priority-medium',
          icon: Clock,
          label: 'كمية قليلة',
          textColor: 'text-yellow-700'
        };
      case 'low':
        return {
          color: 'bg-green-500',
          bgClass: 'priority-low',
          icon: CheckCircle2,
          label: 'اختياري',
          textColor: 'text-green-700'
        };
      default:
        return {
          color: 'bg-gray-500',
          bgClass: 'priority-low',
          icon: Package2,
          label: 'غير محدد',
          textColor: 'text-gray-700'
        };
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(item.id);
    }, 150);
  };

  const handleDoubleClick = () => {
    onTogglePurchased(item.id);
  };

  const priorityConfig = getPriorityConfig(item.priority);
  const PriorityIcon = priorityConfig.icon;

  const getDaysUntilCritical = () => {
    if (!item.willBecomeCriticalAt) return null;
    
    const now = new Date();
    const timeDiff = item.willBecomeCriticalAt.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff;
  };

  const daysLeft = getDaysUntilCritical();

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md animate-slide-in-right cursor-pointer select-none",
        item.isPurchased && "opacity-60 bg-gray-100 border-gray-300",
        isDeleting && "scale-95 opacity-0",
        !item.isPurchased && priorityConfig.bgClass
      )}
      onDoubleClick={handleDoubleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={item.isPurchased}
            onCheckedChange={() => onTogglePurchased(item.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn(
                "font-medium text-lg",
                item.isPurchased && "line-through text-gray-500",
                !item.isPurchased && priorityConfig.textColor
              )}>
                {item.name}
              </h3>
              {item.quantity && (
                <Badge variant="outline" className={cn(
                  "text-xs",
                  item.isPurchased && "text-gray-500 border-gray-400"
                )}>
                  {item.quantity}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <PriorityIcon className={cn(
                "h-4 w-4", 
                item.isPurchased ? "text-gray-500" : priorityConfig.textColor
              )} />
              <span className={cn(
                item.isPurchased ? "text-gray-500" : priorityConfig.textColor
              )}>
                {priorityConfig.label}
              </span>
              
              {item.priority === 'medium' && daysLeft !== null && daysLeft > 0 && !item.isPurchased && (
                <Badge variant="outline" className="text-xs">
                  {daysLeft === 1 ? 'يوم واحد متبقي' : `${daysLeft} أيام متبقية`}
                </Badge>
              )}
              
              {item.priority === 'medium' && daysLeft !== null && daysLeft <= 0 && !item.isPurchased && (
                <Badge variant="destructive" className="text-xs">
                  حان وقت الشراء!
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {item.isPurchased && (
              <div className="flex items-center gap-1 text-gray-500 mr-2">
                <Check className="h-4 w-4" />
                <span className="text-xs">تم</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

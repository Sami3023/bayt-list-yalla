
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingBasket, 
  User, 
  Lock, 
  UserPlus,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export const LoginPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  // تحميل البيانات المحفوظة عند بداية التطبيق
  useEffect(() => {
    const savedCredentials = localStorage.getItem('groceryApp_savedCredentials');
    const savedRememberMe = localStorage.getItem('groceryApp_rememberCredentials');
    
    if (savedCredentials && savedRememberMe === 'true') {
      const { username: savedUsername, password: savedPassword } = JSON.parse(savedCredentials);
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (isRegisterMode) {
      if (password !== confirmPassword) {
        toast({
          title: "خطأ",
          description: "كلمة المرور وتأكيدها غير متطابقتين",
          variant: "destructive"
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "خطأ",
          description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          variant: "destructive"
        });
        return;
      }

      const success = await register(username, password);
      if (success) {
        // حفظ البيانات إذا كان "تذكرني" مفعل
        if (rememberMe) {
          localStorage.setItem('groceryApp_rememberCredentials', 'true');
          localStorage.setItem('groceryApp_savedCredentials', JSON.stringify({ username, password }));
          localStorage.setItem('groceryApp_rememberMe', 'true');
        }
        toast({
          title: "نجح",
          description: "تم إنشاء الحساب وتسجيل الدخول بنجاح!",
        });
      } else {
        toast({
          title: "خطأ",
          description: "اسم المستخدم موجود مسبقاً، يرجى اختيار اسم آخر",
          variant: "destructive"
        });
      }
    } else {
      const success = await login(username, password);
      if (success) {
        // حفظ أو حذف البيانات حسب حالة "تذكرني"
        if (rememberMe) {
          localStorage.setItem('groceryApp_rememberCredentials', 'true');
          localStorage.setItem('groceryApp_savedCredentials', JSON.stringify({ username, password }));
          localStorage.setItem('groceryApp_rememberMe', 'true');
        } else {
          localStorage.removeItem('groceryApp_rememberCredentials');
          localStorage.removeItem('groceryApp_savedCredentials');
        }
        toast({
          title: "مرحباً بك!",
          description: `أهلاً وسهلاً ${username}`,
        });
      } else {
        toast({
          title: "خطأ",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive"
        });
      }
    }
  };

  // تحديث حالة "تذكرني" وحذف البيانات المحفوظة إذا تم إلغاء التفعيل
  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem('groceryApp_rememberCredentials');
      localStorage.removeItem('groceryApp_savedCredentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBasket className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              مقاضي البيت
            </CardTitle>
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-muted-foreground">
            {isRegisterMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول إلى حسابك'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="أعد إدخال كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 pl-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={handleRememberMeChange}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                تذكرني
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                "جاري التحميل..."
              ) : isRegisterMode ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  إنشاء حساب
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setRememberMe(false);
                // مسح البيانات المحفوظة عند التبديل بين الأوضاع
                localStorage.removeItem('groceryApp_rememberCredentials');
                localStorage.removeItem('groceryApp_savedCredentials');
              }}
            >
              {isRegisterMode 
                ? 'لديك حساب؟ تسجيل الدخول' 
                : 'ليس لديك حساب؟ إنشاء حساب جديد'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

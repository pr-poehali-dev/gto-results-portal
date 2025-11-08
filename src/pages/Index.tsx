import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

type MedalType = 'gold' | 'silver' | 'bronze' | 'none';

interface TestResult {
  sprint100m?: string;
  pullUps?: string;
  longJump?: string;
  run3km?: string;
}

const GTONorms = {
  male: {
    '18-24': {
      gold: { sprint100m: 13.1, pullUps: 14, longJump: 240, run3km: 12.0 },
      silver: { sprint100m: 13.9, pullUps: 11, longJump: 230, run3km: 12.35 },
      bronze: { sprint100m: 14.6, pullUps: 9, longJump: 215, run3km: 13.1 }
    },
    '25-29': {
      gold: { sprint100m: 13.3, pullUps: 12, longJump: 240, run3km: 12.3 },
      silver: { sprint100m: 14.0, pullUps: 10, longJump: 230, run3km: 13.0 },
      bronze: { sprint100m: 14.8, pullUps: 7, longJump: 215, run3km: 13.4 }
    }
  },
  female: {
    '18-24': {
      gold: { sprint100m: 16.5, pullUps: 12, longJump: 195, run3km: 16.3 },
      silver: { sprint100m: 17.0, pullUps: 9, longJump: 180, run3km: 17.0 },
      bronze: { sprint100m: 17.5, pullUps: 7, longJump: 170, run3km: 18.0 }
    },
    '25-29': {
      gold: { sprint100m: 17.0, pullUps: 10, longJump: 190, run3km: 17.0 },
      silver: { sprint100m: 17.5, pullUps: 8, longJump: 175, run3km: 18.0 },
      bronze: { sprint100m: 18.0, pullUps: 6, longJump: 165, run3km: 19.0 }
    }
  }
};

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [userName, setUserName] = useState('');
  
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [ageGroup, setAgeGroup] = useState<'18-24' | '25-29'>('18-24');
  const [results, setResults] = useState<TestResult>({});
  const [medal, setMedal] = useState<MedalType>('none');
  const [showResult, setShowResult] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const savedUser = localStorage.getItem('gto_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === authData.email && user.password === authData.password) {
          setUserName(user.name);
          setIsAuthenticated(true);
        } else {
          alert('Неверный email или пароль');
        }
      } else {
        alert('Пользователь не найден. Пожалуйста, зарегистрируйтесь.');
      }
    } else {
      if (authData.name && authData.email && authData.password) {
        localStorage.setItem('gto_user', JSON.stringify(authData));
        setUserName(authData.name);
        setIsAuthenticated(true);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthData({ name: '', email: '', password: '' });
    setUserName('');
  };

  const calculateMedal = () => {
    const norms = GTONorms[gender][ageGroup];
    
    const sprint = parseFloat(results.sprint100m || '999');
    const pullUps = parseInt(results.pullUps || '0');
    const longJump = parseFloat(results.longJump || '0');
    const run3km = parseFloat(results.run3km || '999');

    let goldCount = 0;
    let silverCount = 0;
    let bronzeCount = 0;

    if (sprint <= norms.gold.sprint100m) goldCount++;
    else if (sprint <= norms.silver.sprint100m) silverCount++;
    else if (sprint <= norms.bronze.sprint100m) bronzeCount++;

    if (pullUps >= norms.gold.pullUps) goldCount++;
    else if (pullUps >= norms.silver.pullUps) silverCount++;
    else if (pullUps >= norms.bronze.pullUps) bronzeCount++;

    if (longJump >= norms.gold.longJump) goldCount++;
    else if (longJump >= norms.silver.longJump) silverCount++;
    else if (longJump >= norms.bronze.longJump) bronzeCount++;

    if (run3km <= norms.gold.run3km) goldCount++;
    else if (run3km <= norms.silver.run3km) silverCount++;
    else if (run3km <= norms.bronze.run3km) bronzeCount++;

    if (goldCount >= 3) setMedal('gold');
    else if (silverCount + goldCount >= 3) setMedal('silver');
    else if (bronzeCount + silverCount + goldCount >= 3) setMedal('bronze');
    else setMedal('none');

    setShowResult(true);
  };

  const getMedalEmoji = (type: MedalType) => {
    switch (type) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '❌';
    }
  };

  const getMedalText = (type: MedalType) => {
    switch (type) {
      case 'gold': return 'Золотой знак ГТО';
      case 'silver': return 'Серебряный знак ГТО';
      case 'bronze': return 'Бронзовый знак ГТО';
      default: return 'Знак не получен';
    }
  };

  const getMedalColor = (type: MedalType) => {
    switch (type) {
      case 'gold': return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 'silver': return 'from-gray-300 via-gray-400 to-gray-500';
      case 'bronze': return 'from-orange-400 via-orange-500 to-orange-600';
      default: return 'from-gray-200 via-gray-300 to-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-2 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-full">
                <Icon name="Trophy" size={40} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Калькулятор ГТО</CardTitle>
            <CardDescription>
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте аккаунт для начала'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
                    value={authData.name}
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6 animate-slide-in-left"
                style={{ animationDelay: '0.3s' }}
              >
                {isLogin ? 'Войти' : 'Зарегистрироваться'}
              </Button>

              <div className="text-center animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-950 to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Trophy" size={48} className="text-primary" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Калькулятор ГТО
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Добро пожаловать, {userName}! Узнайте, какую медаль вы заслужили!
          </p>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </header>

        <Tabs defaultValue="calculator" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calculator" className="text-base">
              <Icon name="Calculator" size={18} className="mr-2" />
              Калькулятор
            </TabsTrigger>
            <TabsTrigger value="norms" className="text-base">
              <Icon name="FileText" size={18} className="mr-2" />
              Нормативы
            </TabsTrigger>
            <TabsTrigger value="instructions" className="text-base">
              <Icon name="Info" size={18} className="mr-2" />
              Инструкция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl border-2">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="ClipboardList" size={24} />
                    Ввод результатов
                  </CardTitle>
                  <CardDescription>Заполните данные о себе и ваших результатах</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Пол</Label>
                      <Select value={gender} onValueChange={(v) => setGender(v as any)}>
                        <SelectTrigger id="gender">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Мужской</SelectItem>
                          <SelectItem value="female">Женский</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Возраст</Label>
                      <Select value={ageGroup} onValueChange={(v) => setAgeGroup(v as any)}>
                        <SelectTrigger id="age">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-24">18-24 лет</SelectItem>
                          <SelectItem value="25-29">25-29 лет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sprint">Бег 100м (сек)</Label>
                      <Input
                        id="sprint"
                        type="number"
                        step="0.1"
                        placeholder="13.5"
                        value={results.sprint100m || ''}
                        onChange={(e) => setResults({ ...results, sprint100m: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pullups">Подтягивания (раз)</Label>
                      <Input
                        id="pullups"
                        type="number"
                        placeholder="12"
                        value={results.pullUps || ''}
                        onChange={(e) => setResults({ ...results, pullUps: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longjump">Прыжок в длину (см)</Label>
                      <Input
                        id="longjump"
                        type="number"
                        placeholder="230"
                        value={results.longJump || ''}
                        onChange={(e) => setResults({ ...results, longJump: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="run3km">Бег 3 км (мин)</Label>
                      <Input
                        id="run3km"
                        type="number"
                        step="0.1"
                        placeholder="12.3"
                        value={results.run3km || ''}
                        onChange={(e) => setResults({ ...results, run3km: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={calculateMedal} 
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
                    size="lg"
                  >
                    <Icon name="Award" size={20} className="mr-2" />
                    Рассчитать результат
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-2">
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Medal" size={24} />
                    Результат
                  </CardTitle>
                  <CardDescription>Ваша заслуженная награда</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {showResult ? (
                    <div className="space-y-6 animate-scale-in">
                      <div className={`relative p-12 rounded-3xl bg-gradient-to-br ${getMedalColor(medal)} shadow-2xl`}>
                        <div className="text-center">
                          <div className="text-9xl mb-4 animate-bounce">{getMedalEmoji(medal)}</div>
                          <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                            {getMedalText(medal)}
                          </h3>
                        </div>
                      </div>

                      {medal !== 'none' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Прогресс к золоту</span>
                            <span className="text-sm text-muted-foreground">
                              {medal === 'gold' ? '100%' : medal === 'silver' ? '75%' : '50%'}
                            </span>
                          </div>
                          <Progress 
                            value={medal === 'gold' ? 100 : medal === 'silver' ? 75 : 50} 
                            className="h-3"
                          />
                        </div>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <Icon name="Info" size={16} className="inline mr-2" />
                          {medal === 'gold' && 'Поздравляем! Вы показали отличные результаты!'}
                          {medal === 'silver' && 'Хороший результат! Немного тренировок - и золото ваше!'}
                          {medal === 'bronze' && 'Неплохой старт! Продолжайте тренироваться!'}
                          {medal === 'none' && 'К сожалению, результаты недостаточны для знака. Не сдавайтесь!'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                      <Icon name="ArrowLeft" size={48} className="mb-4 opacity-30" />
                      <p className="text-lg">Введите свои результаты и нажмите кнопку расчета</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="norms" className="animate-fade-in">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Table" size={24} />
                  Нормативы ГТО
                </CardTitle>
                <CardDescription>Таблица нормативов для получения знаков отличия</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="male-18-24">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="male-18-24">М 18-24</TabsTrigger>
                    <TabsTrigger value="male-25-29">М 25-29</TabsTrigger>
                    <TabsTrigger value="female-18-24">Ж 18-24</TabsTrigger>
                    <TabsTrigger value="female-25-29">Ж 25-29</TabsTrigger>
                  </TabsList>

                  {(['male-18-24', 'male-25-29', 'female-18-24', 'female-25-29'] as const).map((key) => {
                    const [g, age] = key.split('-') as ['male' | 'female', '18' | '25'];
                    const ageKey = age === '18' ? '18-24' : '25-29';
                    const norms = GTONorms[g][ageKey];

                    return (
                      <TabsContent key={key} value={key}>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-bold">Дисциплина</TableHead>
                                <TableHead className="text-center font-bold text-yellow-600">🥇 Золото</TableHead>
                                <TableHead className="text-center font-bold text-gray-600">🥈 Серебро</TableHead>
                                <TableHead className="text-center font-bold text-orange-600">🥉 Бронза</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Бег 100м (сек)</TableCell>
                                <TableCell className="text-center">{norms.gold.sprint100m}</TableCell>
                                <TableCell className="text-center">{norms.silver.sprint100m}</TableCell>
                                <TableCell className="text-center">{norms.bronze.sprint100m}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Подтягивания (раз)</TableCell>
                                <TableCell className="text-center">{norms.gold.pullUps}</TableCell>
                                <TableCell className="text-center">{norms.silver.pullUps}</TableCell>
                                <TableCell className="text-center">{norms.bronze.pullUps}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Прыжок в длину (см)</TableCell>
                                <TableCell className="text-center">{norms.gold.longJump}</TableCell>
                                <TableCell className="text-center">{norms.silver.longJump}</TableCell>
                                <TableCell className="text-center">{norms.bronze.longJump}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Бег 3 км (мин)</TableCell>
                                <TableCell className="text-center">{norms.gold.run3km}</TableCell>
                                <TableCell className="text-center">{norms.silver.run3km}</TableCell>
                                <TableCell className="text-center">{norms.bronze.run3km}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructions" className="animate-fade-in">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  Инструкция по использованию
                </CardTitle>
                <CardDescription>Как пользоваться калькулятором ГТО</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Выберите пол и возраст</h3>
                      <p className="text-muted-foreground">
                        В калькуляторе укажите ваш пол и возрастную группу. Нормативы различаются для мужчин и женщин, а также для разных возрастов.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Введите результаты испытаний</h3>
                      <p className="text-muted-foreground">
                        Заполните поля с вашими результатами по 4 дисциплинам: бег 100м, подтягивания, прыжок в длину и бег 3 км. Будьте точны в измерениях!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Получите результат</h3>
                      <p className="text-muted-foreground">
                        Нажмите кнопку "Рассчитать результат". Система автоматически определит, какой знак отличия вы заслужили: золотой, серебряный, бронзовый или результат недостаточен.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                      <Icon name="Lightbulb" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Правила получения знака</h3>
                      <p className="text-muted-foreground">
                        Для получения знака нужно выполнить нормативы по минимум 3 из 4 дисциплин на соответствующем уровне. Например, для золотого знака нужно показать золотой результат в 3 дисциплинах.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded">
                  <div className="flex gap-3">
                    <Icon name="Star" size={24} className="text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Совет</h4>
                      <p className="text-sm text-yellow-800">
                        Если вы не получили желаемый знак, не расстраивайтесь! Посмотрите таблицу нормативов, определите слабые места и продолжайте тренировки. Успех придет с упорством!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
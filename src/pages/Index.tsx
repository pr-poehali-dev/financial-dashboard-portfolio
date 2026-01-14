import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [investmentAmount, setInvestmentAmount] = useState([1000]);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCard, setWithdrawCard] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  const userRefCode = "JD4521";
  const referralLink = `t.me/InvestPassiveBot?start=ref_${userRefCode}`;

  const stats = {
    balance: 125430.50,
    availableBalance: 8450.30,
    profit24h: 1234.56,
    profitPercent: 10.6,
    partners: 47,
    withdrawn: 89500.00,
    totalInvested: 50000.00,
    activeDeposits: 3,
    dailyIncome: 850.00,
    referralEarnings: 12450.00,
    activeReferrals: 24
  };

  const deposits = [
    { id: 1, amount: 20000, progress: 65, daysLeft: 14, rate: 10.6, earned: 13780 },
    { id: 2, amount: 15000, progress: 42, daysLeft: 23, rate: 10.6, earned: 6678 },
    { id: 3, amount: 15000, progress: 88, daysLeft: 5, rate: 10.6, earned: 13992 }
  ];

  const transactions = [
    { id: 1, type: "deposit", amount: 5000, date: "2026-01-14 15:23", status: "completed" },
    { id: 2, type: "profit", amount: 850, date: "2026-01-14 12:00", status: "completed" },
    { id: 3, type: "withdrawal", amount: 2000, date: "2026-01-13 18:45", status: "pending" },
    { id: 4, type: "referral", amount: 1250, date: "2026-01-13 14:20", status: "completed" },
    { id: 5, type: "deposit", amount: 10000, date: "2026-01-12 10:15", status: "completed" },
    { id: 6, type: "bonus", amount: 100, date: "2026-01-12 09:30", status: "completed" }
  ];

  const referrals = [
    { id: 1, username: "User_4521", deposits: 15000, earnings: 3750, date: "2026-01-10", active: true },
    { id: 2, username: "User_7832", deposits: 8000, earnings: 2000, date: "2026-01-08", active: true },
    { id: 3, username: "User_2341", deposits: 25000, earnings: 6250, date: "2026-01-05", active: true },
    { id: 4, username: "User_9876", deposits: 500, earnings: 125, date: "2026-01-03", active: false }
  ];

  const bonusTasks = [
    { id: "chat", title: "Вступить в чат проекта", reward: 100, completed: false, icon: "MessageCircle" },
    { id: "referrals", title: "Пригласить 25 друзей", reward: 2000, completed: false, progress: 4, target: 25, icon: "Users" }
  ];

  const calculateProfit = (amount: number) => {
    const dailyRate = 0.106;
    const days = 30;
    return (amount * dailyRate * days).toFixed(2);
  };

  const handleDeposit = () => {
    if (!depositAmount || Number(depositAmount) < 100) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма пополнения 100₽",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Реквизиты для оплаты",
      description: `Переведите ${depositAmount}₽ на карту 2202 2063 4578 9012 и нажмите "Проверить оплату"`,
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || Number(withdrawAmount) < 100) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма вывода 100₽",
        variant: "destructive"
      });
      return;
    }
    if (Number(withdrawAmount) > stats.availableBalance) {
      toast({
        title: "Недостаточно средств",
        description: `Доступно для вывода: ${stats.availableBalance.toFixed(2)}₽`,
        variant: "destructive"
      });
      return;
    }
    if (!withdrawCard || withdrawCard.length < 16) {
      toast({
        title: "Ошибка",
        description: "Введите корректный номер карты",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Заявка принята",
      description: `Вывод ${withdrawAmount}₽ на карту ${withdrawCard} обрабатывается`,
    });
    setWithdrawDialogOpen(false);
  };

  const filteredTransactions = transactions.filter(tx => 
    filterType === "all" || tx.type === filterType
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Invest Passive
              </h1>
              <p className="text-xs text-muted-foreground">Пассивный доход 10.6% в день</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="Bell" size={18} />
              </Button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-semibold">
                JD
              </div>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 p-1">
            <TabsTrigger value="dashboard" className="gap-1.5 text-xs">
              <Icon name="LayoutDashboard" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-1.5 text-xs">
              <Icon name="TrendingUp" size={16} />
              <span className="hidden sm:inline">Портфель</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-1.5 text-xs">
              <Icon name="Wallet" size={16} />
              <span className="hidden sm:inline">Кошелёк</span>
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="gap-1.5 text-xs">
              <Icon name="Gift" size={16} />
              <span className="hidden sm:inline">Бонусы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Wallet" size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Баланс</span>
                </div>
                <h3 className="text-xl font-bold">{stats.balance.toLocaleString()}₽</h3>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <Icon name="TrendingUp" size={12} />
                  +{stats.profitPercent}% за 24ч
                </p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="DollarSign" size={20} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">Доход 24ч</span>
                </div>
                <h3 className="text-xl font-bold text-green-500">+{stats.profit24h.toLocaleString()}₽</h3>
                <p className="text-xs text-muted-foreground mt-1">Суточный</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Users" size={20} className="text-secondary" />
                  <span className="text-xs text-muted-foreground">Партнёры</span>
                </div>
                <h3 className="text-xl font-bold">{stats.partners}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.activeReferrals} активных</p>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="ArrowUpRight" size={20} className="text-orange-500" />
                  <span className="text-xs text-muted-foreground">Выведено</span>
                </div>
                <h3 className="text-xl font-bold">{stats.withdrawn.toLocaleString()}₽</h3>
                <p className="text-xs text-muted-foreground mt-1">Всего</p>
              </Card>
            </div>

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setDepositDialogOpen(true)}
                  className="h-auto py-4 bg-gradient-to-r from-primary to-primary/80"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="Plus" size={20} />
                    <span className="text-sm">Пополнить</span>
                  </div>
                </Button>
                <Button 
                  onClick={() => setWithdrawDialogOpen(true)}
                  variant="outline" 
                  className="h-auto py-4 border-green-500/30 hover:bg-green-500/10"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon name="ArrowUpRight" size={20} className="text-green-500" />
                    <span className="text-sm">Вывести</span>
                  </div>
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">История операций</h2>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    <SelectItem value="deposit">Пополнения</SelectItem>
                    <SelectItem value="profit">Начисления</SelectItem>
                    <SelectItem value="withdrawal">Выводы</SelectItem>
                    <SelectItem value="referral">Рефералы</SelectItem>
                    <SelectItem value="bonus">Бонусы</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {filteredTransactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          tx.type === "deposit" ? "bg-primary/20" :
                          tx.type === "profit" ? "bg-green-500/20" :
                          tx.type === "withdrawal" ? "bg-orange-500/20" :
                          tx.type === "bonus" ? "bg-yellow-500/20" :
                          "bg-secondary/20"
                        }`}
                      >
                        <Icon
                          name={
                            tx.type === "deposit" ? "ArrowDownToLine" :
                            tx.type === "profit" ? "TrendingUp" :
                            tx.type === "withdrawal" ? "ArrowUpRight" :
                            tx.type === "bonus" ? "Gift" :
                            "Users"
                          }
                          size={18}
                          className={
                            tx.type === "deposit" ? "text-primary" :
                            tx.type === "profit" ? "text-green-500" :
                            tx.type === "withdrawal" ? "text-orange-500" :
                            tx.type === "bonus" ? "text-yellow-500" :
                            "text-secondary"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.type === "deposit" ? "Пополнение" :
                           tx.type === "profit" ? "Начисление" :
                           tx.type === "withdrawal" ? "Вывод" :
                           tx.type === "bonus" ? "Бонус" :
                           "Реферал"}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        tx.type === "withdrawal" ? "text-orange-500" : "text-green-500"
                      }`}>
                        {tx.type === "withdrawal" ? "-" : "+"}₽{tx.amount.toLocaleString()}
                      </p>
                      <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {tx.status === "completed" ? "Завершено" : "В обработке"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4">
                <Icon name="PieChart" size={20} className="text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Вложено</p>
                <h3 className="text-lg font-bold">{stats.totalInvested.toLocaleString()}₽</h3>
              </Card>
              <Card className="p-4">
                <Icon name="Activity" size={20} className="text-secondary mb-2" />
                <p className="text-xs text-muted-foreground">Депозитов</p>
                <h3 className="text-lg font-bold">{stats.activeDeposits}</h3>
              </Card>
              <Card className="p-4">
                <Icon name="DollarSign" size={20} className="text-green-500 mb-2" />
                <p className="text-xs text-muted-foreground">В день</p>
                <h3 className="text-lg font-bold text-green-500">{stats.dailyIncome}₽</h3>
              </Card>
            </div>

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4">Калькулятор доходности</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Сумма вклада</span>
                    <span className="text-lg font-semibold">{investmentAmount[0].toLocaleString()}₽</span>
                  </div>
                  <Slider
                    value={investmentAmount}
                    onValueChange={setInvestmentAmount}
                    min={100}
                    max={100000}
                    step={100}
                    className="mb-3"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 5000, 10000, 50000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setInvestmentAmount([amount])}
                        className="text-xs h-8"
                      >
                        {amount >= 1000 ? `${amount/1000}k` : amount}₽
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-muted/30">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">За месяц</p>
                    <p className="text-base font-bold text-green-500">
                      +{calculateProfit(investmentAmount[0])}₽
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ставка</p>
                    <p className="text-base font-bold text-primary">10.6%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Итого</p>
                    <p className="text-base font-bold">
                      {(investmentAmount[0] + Number(calculateProfit(investmentAmount[0]))).toLocaleString()}₽
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4">Активные вклады</h2>
              <div className="space-y-3">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base">{deposit.amount.toLocaleString()}₽</p>
                        <p className="text-xs text-muted-foreground">Депозит #{deposit.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-500">{deposit.rate}% / день</p>
                        <p className="text-xs text-muted-foreground">{deposit.daysLeft} дней</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Заработано: {deposit.earned}₽</span>
                        <span className="font-medium">{deposit.progress}%</span>
                      </div>
                      <Progress value={deposit.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-4 animate-fade-in">
            <Card className="p-5 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Общий баланс</p>
                  <h2 className="text-3xl font-bold">{stats.balance.toLocaleString()}₽</h2>
                  <p className="text-xs text-green-500 mt-1">Доступно: {stats.availableBalance.toFixed(2)}₽</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Wallet" size={28} className="text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setDepositDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Пополнить
                </Button>
                <Button 
                  onClick={() => setWithdrawDialogOpen(true)}
                  variant="outline" 
                  className="border-green-500/30 hover:bg-green-500/10"
                >
                  <Icon name="ArrowUpRight" size={18} className="mr-2 text-green-500" />
                  Вывести
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4">
                <Icon name="ArrowDownToLine" size={18} className="text-secondary mb-2" />
                <p className="text-xs text-muted-foreground">Пополнено</p>
                <h3 className="text-base font-bold">{(stats.totalInvested + 35000).toLocaleString()}₽</h3>
              </Card>
              <Card className="p-4">
                <Icon name="ArrowUpRight" size={18} className="text-green-500 mb-2" />
                <p className="text-xs text-muted-foreground">Выведено</p>
                <h3 className="text-base font-bold">{stats.withdrawn.toLocaleString()}₽</h3>
              </Card>
              <Card className="p-4">
                <Icon name="Clock" size={18} className="text-yellow-500 mb-2" />
                <p className="text-xs text-muted-foreground">Ожидание</p>
                <h3 className="text-base font-bold">2,000₽</h3>
              </Card>
            </div>

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Users" size={20} />
                Партнёрская программа
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm mb-2 flex items-center gap-2">
                    <Icon name="Link" size={16} />
                    Ваша реферальная ссылка
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 rounded bg-muted/50 text-xs font-mono break-all">
                      {referralLink}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      toast({ title: "Скопировано!" });
                    }}>
                      <Icon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <p className="text-xs text-muted-foreground mb-1">Приглашено</p>
                    <p className="text-2xl font-bold">{stats.partners}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <p className="text-xs text-muted-foreground mb-1">Заработано</p>
                    <p className="text-2xl font-bold text-green-500">{stats.referralEarnings.toLocaleString()}₽</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-4">Последние рефералы</h2>
              <div className="space-y-2">
                {referrals.slice(0, 5).map((ref) => (
                  <div key={ref.id} className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-semibold">
                        {ref.username.slice(5, 7)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-2">
                          {ref.username}
                          {ref.active && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                        </p>
                        <p className="text-xs text-muted-foreground">С {ref.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">+{ref.earnings.toLocaleString()}₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-4 animate-fade-in">
            <Card className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Icon name="Gift" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Бонусная программа</h2>
                  <p className="text-sm text-muted-foreground">Выполняй задания — получай рубли</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {bonusTasks.map((task) => (
                <Card key={task.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                        task.completed ? "bg-green-500/20" : "bg-primary/20"
                      }`}>
                        <Icon 
                          name={task.icon as any} 
                          size={24} 
                          className={task.completed ? "text-green-500" : "text-primary"} 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{task.title}</h3>
                        {task.progress !== undefined && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Прогресс: {task.progress} / {task.target}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                            +{task.reward}₽
                          </Badge>
                          {task.completed && (
                            <Badge className="bg-green-500">Выполнено</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {task.progress !== undefined && (
                    <Progress value={(task.progress / task.target) * 100} className="h-2 mb-3" />
                  )}
                  <Button 
                    className="w-full" 
                    variant={task.completed ? "outline" : "default"}
                    disabled={task.completed}
                    onClick={() => {
                      if (task.id === "chat") {
                        window.open("https://t.me/invest_passive_chat", "_blank");
                        toast({
                          title: "Проверка подписки",
                          description: "Проверяем вашу подписку на чат...",
                        });
                      } else if (task.id === "referrals") {
                        const shareText = `💎 Присоединяйся к Invest Passive!\n\n🚀 Пассивный доход 10.6% в день\n💰 Стабильные выплаты\n🎁 Бонусы за регистрацию\n\n👉 ${referralLink}`;
                        const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`;
                        window.open(telegramShareUrl, "_blank");
                        toast({
                          title: "Поделиться ссылкой",
                          description: "Отправь ссылку друзьям в Telegram!",
                        });
                      }
                    }}
                  >
                    {task.completed ? "Получено" : task.id === "chat" ? "Вступить в чат" : "Пригласить друзей"}
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="p-5 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Info" size={20} className="text-primary" />
                <h3 className="font-semibold">Условия бонусов</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Бонус за чат активируется автоматически после проверки</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>За 25 активных рефералов вы получите 2000₽ на баланс</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Все бонусы можно использовать для инвестирования</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Plus" size={20} />
              Пополнение баланса
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Сумма пополнения (₽)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Минимум 100₽"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Реквизиты для оплаты:</p>
              <div className="p-3 rounded bg-background">
                <p className="text-lg font-mono font-bold text-center">2202 2063 4578 9012</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Переведите указанную сумму на эту карту и нажмите "Проверить оплату"
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setDepositDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleDeposit}>
                Проверить оплату
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="ArrowUpRight" size={20} />
              Вывод средств
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-muted-foreground mb-1">Доступно для вывода</p>
              <p className="text-2xl font-bold text-green-500">{stats.availableBalance.toFixed(2)}₽</p>
              <p className="text-xs text-muted-foreground mt-1">Только заработанные проценты</p>
            </div>
            <div>
              <Label htmlFor="withdrawAmount">Сумма вывода (₽)</Label>
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="Минимум 100₽"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Номер карты</Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={withdrawCard}
                onChange={(e) => setWithdrawCard(e.target.value)}
                maxLength={19}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleWithdraw} className="bg-green-500 hover:bg-green-600">
                Вывести
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
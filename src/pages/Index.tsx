import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [investmentAmount, setInvestmentAmount] = useState([1000]);

  const stats = {
    balance: 125430.50,
    profit24h: 1234.56,
    profitPercent: 2.4,
    partners: 47,
    withdrawn: 89500.00,
    totalInvested: 50000.00,
    activeDeposits: 3,
    dailyIncome: 850.00,
    referralEarnings: 12450.00,
    activeReferrals: 24
  };

  const deposits = [
    { id: 1, amount: 20000, progress: 65, daysLeft: 14, rate: 5.5 },
    { id: 2, amount: 15000, progress: 42, daysLeft: 23, rate: 4.8 },
    { id: 3, amount: 15000, progress: 88, daysLeft: 5, rate: 6.2 }
  ];

  const transactions = [
    { id: 1, type: "deposit", amount: 5000, date: "2026-01-14", status: "completed" },
    { id: 2, type: "profit", amount: 850, date: "2026-01-14", status: "completed" },
    { id: 3, type: "withdrawal", amount: 2000, date: "2026-01-13", status: "pending" },
    { id: 4, type: "referral", amount: 1250, date: "2026-01-13", status: "completed" },
    { id: 5, type: "deposit", amount: 10000, date: "2026-01-12", status: "completed" }
  ];

  const referrals = [
    { id: 1, username: "User_4521", deposits: 15000, earnings: 3750, date: "2026-01-10", active: true },
    { id: 2, username: "User_7832", deposits: 8000, earnings: 2000, date: "2026-01-08", active: true },
    { id: 3, username: "User_2341", deposits: 25000, earnings: 6250, date: "2026-01-05", active: true },
    { id: 4, username: "User_9876", deposits: 500, earnings: 125, date: "2026-01-03", active: false }
  ];

  const calculateProfit = (amount: number) => {
    const dailyRate = 0.055;
    const days = 30;
    return (amount * dailyRate * days).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Passive Capital
            </h1>
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-card/50 p-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <Icon name="LayoutDashboard" size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Icon name="TrendingUp" size={18} />
              <span className="hidden sm:inline">Портфель</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Icon name="Wallet" size={18} />
              <span className="hidden sm:inline">Кошелёк</span>
            </TabsTrigger>
            <TabsTrigger value="referral" className="gap-2">
              <Icon name="Users" size={18} />
              <span className="hidden sm:inline">Партнёры</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover-scale cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Wallet" size={24} className="text-primary" />
                  <span className="text-xs text-muted-foreground">Баланс</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">${stats.balance.toLocaleString()}</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <Icon name="TrendingUp" size={14} />
                    +{stats.profitPercent}% за 24ч
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover-scale cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="DollarSign" size={24} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">Прибыль 24ч</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-green-500">+${stats.profit24h.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">Суточный доход</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover-scale cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Users" size={24} className="text-secondary" />
                  <span className="text-xs text-muted-foreground">Партнёры</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{stats.partners}</h3>
                  <p className="text-xs text-muted-foreground">{stats.activeReferrals} активных</p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover-scale cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="ArrowUpRight" size={24} className="text-orange-500" />
                  <span className="text-xs text-muted-foreground">Выведено</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">${stats.withdrawn.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground">Всего выплат</p>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Быстрые действия</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button className="h-auto py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <div className="flex items-center gap-3">
                      <Icon name="Plus" size={24} />
                      <div className="text-left">
                        <div className="font-semibold">Пополнить баланс</div>
                        <div className="text-xs opacity-90">Минимум $100</div>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 border-secondary/30 hover:bg-secondary/10">
                    <div className="flex items-center gap-3">
                      <Icon name="MessageCircle" size={24} className="text-secondary" />
                      <div className="text-left">
                        <div className="font-semibold">Форум</div>
                        <div className="text-xs text-muted-foreground">Поддержка 24/7</div>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 border-green-500/30 hover:bg-green-500/10">
                    <div className="flex items-center gap-3">
                      <Icon name="ArrowDownToLine" size={24} className="text-green-500" />
                      <div className="text-left">
                        <div className="font-semibold">Вывести средства</div>
                        <div className="text-xs text-muted-foreground">Быстрый вывод</div>
                      </div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 border-orange-500/30 hover:bg-orange-500/10">
                    <div className="flex items-center gap-3">
                      <Icon name="Gift" size={24} className="text-orange-500" />
                      <div className="text-left">
                        <div className="font-semibold">Бонусы</div>
                        <div className="text-xs text-muted-foreground">Получить награды</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Активность</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Активные вклады</p>
                      <p className="text-xs text-muted-foreground">{stats.activeDeposits} депозитов</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${stats.totalInvested.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Icon name="DollarSign" size={20} className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Суточный доход</p>
                      <p className="text-xs text-muted-foreground">Автоматически</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-500">+${stats.dailyIncome}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Icon name="Users" size={20} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Реф. доход</p>
                      <p className="text-xs text-muted-foreground">25% от вкладов</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${stats.referralEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">История операций</h2>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Icon name="Filter" size={16} />
                  Фильтр
                </Button>
              </div>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          tx.type === "deposit"
                            ? "bg-primary/20"
                            : tx.type === "profit"
                            ? "bg-green-500/20"
                            : tx.type === "withdrawal"
                            ? "bg-orange-500/20"
                            : "bg-secondary/20"
                        }`}
                      >
                        <Icon
                          name={
                            tx.type === "deposit"
                              ? "ArrowDownToLine"
                              : tx.type === "profit"
                              ? "TrendingUp"
                              : tx.type === "withdrawal"
                              ? "ArrowUpRight"
                              : "Users"
                          }
                          size={20}
                          className={
                            tx.type === "deposit"
                              ? "text-primary"
                              : tx.type === "profit"
                              ? "text-green-500"
                              : tx.type === "withdrawal"
                              ? "text-orange-500"
                              : "text-secondary"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.type === "deposit"
                            ? "Пополнение"
                            : tx.type === "profit"
                            ? "Начисление"
                            : tx.type === "withdrawal"
                            ? "Вывод средств"
                            : "Реферальный доход"}
                        </p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.type === "withdrawal" ? "text-orange-500" : "text-green-500"
                        }`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          tx.status === "completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {tx.status === "completed" ? "Завершено" : "В обработке"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="PieChart" size={24} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Всего вложено</span>
                </div>
                <h3 className="text-3xl font-bold">${stats.totalInvested.toLocaleString()}</h3>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Activity" size={24} className="text-secondary" />
                  <span className="text-sm text-muted-foreground">Активные депозиты</span>
                </div>
                <h3 className="text-3xl font-bold">{stats.activeDeposits}</h3>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="DollarSign" size={24} className="text-green-500" />
                  <span className="text-sm text-muted-foreground">Суточный доход</span>
                </div>
                <h3 className="text-3xl font-bold text-green-500">${stats.dailyIncome}</h3>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Калькулятор доходности</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Сумма инвестиции</span>
                    <span className="text-lg font-semibold">${investmentAmount[0].toLocaleString()}</span>
                  </div>
                  <Slider
                    value={investmentAmount}
                    onValueChange={setInvestmentAmount}
                    min={100}
                    max={100000}
                    step={100}
                    className="mb-4"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 5000, 10000, 50000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setInvestmentAmount([amount])}
                        className="text-xs"
                      >
                        ${amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Доход за месяц</p>
                    <p className="text-xl font-bold text-green-500">
                      +${calculateProfit(investmentAmount[0])}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Процент</p>
                    <p className="text-xl font-bold text-primary">5.5% / день</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Итого</p>
                    <p className="text-xl font-bold">
                      ${(investmentAmount[0] + Number(calculateProfit(investmentAmount[0]))).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Активные вклады</h2>
              <div className="space-y-4">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">${deposit.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Депозит #{deposit.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-500">{deposit.rate}% / день</p>
                        <p className="text-xs text-muted-foreground">{deposit.daysLeft} дней осталось</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span className="font-medium">{deposit.progress}%</span>
                      </div>
                      <Progress value={deposit.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Основной счёт</p>
                  <h2 className="text-4xl font-bold">${stats.balance.toLocaleString()}</h2>
                </div>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Wallet" size={32} className="text-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-primary to-primary/80">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Пополнить
                </Button>
                <Button variant="outline" className="flex-1 border-green-500/30 hover:bg-green-500/10">
                  <Icon name="ArrowUpRight" size={18} className="mr-2 text-green-500" />
                  Вывести
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="ArrowDownToLine" size={20} className="text-secondary" />
                  <span className="text-sm text-muted-foreground">Пополнено</span>
                </div>
                <h3 className="text-2xl font-bold">${(stats.totalInvested + 35000).toLocaleString()}</h3>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="ArrowUpRight" size={20} className="text-green-500" />
                  <span className="text-sm text-muted-foreground">Выведено</span>
                </div>
                <h3 className="text-2xl font-bold">${stats.withdrawn.toLocaleString()}</h3>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Clock" size={20} className="text-yellow-500" />
                  <span className="text-sm text-muted-foreground">В ожидании</span>
                </div>
                <h3 className="text-2xl font-bold">$2,000</h3>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Методы пополнения</h2>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить
                </Button>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Icon name="CreditCard" size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Банковская карта</p>
                        <p className="text-sm text-muted-foreground">Visa, MasterCard, Мир</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">₽</span>
                      </div>
                      <div>
                        <p className="font-semibold">СБП</p>
                        <p className="text-sm text-muted-foreground">Система быстрых платежей</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">USDT</span>
                      </div>
                      <div>
                        <p className="font-semibold">Криптовалюта</p>
                        <p className="text-sm text-muted-foreground">USDT, TON, ETH</p>
                      </div>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="referral" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Users" size={24} className="text-secondary" />
                  <span className="text-sm text-muted-foreground">Всего партнёров</span>
                </div>
                <h3 className="text-3xl font-bold">{stats.partners}</h3>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="UserCheck" size={24} className="text-green-500" />
                  <span className="text-sm text-muted-foreground">Активных</span>
                </div>
                <h3 className="text-3xl font-bold text-green-500">{stats.activeReferrals}</h3>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="DollarSign" size={24} className="text-primary" />
                  <span className="text-sm text-muted-foreground">Общий доход</span>
                </div>
                <h3 className="text-3xl font-bold">${stats.referralEarnings.toLocaleString()}</h3>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ваша реферальная ссылка</h2>
              <div className="flex gap-3">
                <div className="flex-1 p-4 rounded-lg bg-muted/30 font-mono text-sm break-all">
                  t.me/PassiveCapitalBot/play?startapp=ref_JD4521
                </div>
                <Button className="gap-2">
                  <Icon name="Copy" size={18} />
                  Копировать
                </Button>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Получайте <span className="font-semibold text-primary">25% от каждого депозита</span> ваших
                  рефералов
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Ваши партнёры</h2>
              <div className="space-y-3">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-semibold">
                          {ref.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold flex items-center gap-2">
                            {ref.username}
                            {ref.active && (
                              <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">С {ref.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${ref.earnings.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Вклады: ${ref.deposits.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

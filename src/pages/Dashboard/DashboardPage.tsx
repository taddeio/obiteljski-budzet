import React from "react";
import { Card } from "../../components/ui/Card";
import { useAppContext } from "../../context/AppContext";
import { formatCurrency, getMonthYearString } from "../../utils/formatters";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAppContext();

  // Placeholder data - will be replaced with real data from Firestore
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const monthYear = getMonthYearString(currentYear, currentMonth);

  const stats = {
    income: 4500,
    expenses: 2340,
    balance: 2160,
    transactionCount: 12,
  };

  const recentTransactions = [
    {
      id: "1",
      description: "Kupovnja groceries",
      category: "🍔",
      amount: 85.5,
      type: "expense" as const,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).getTime(),
      member: user?.displayName || "Korisnik",
    },
    {
      id: "2",
      description: "Plaća",
      category: "💼",
      amount: 2500,
      type: "income" as const,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).getTime(),
      member: user?.displayName || "Korisnik",
    },
    {
      id: "3",
      description: "Struja",
      category: "⚡",
      amount: 125,
      type: "expense" as const,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).getTime(),
      member: user?.displayName || "Korisnik",
    },
    {
      id: "4",
      description: "Gorivo",
      category: "⛽",
      amount: 60,
      type: "expense" as const,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
      member: user?.displayName || "Korisnik",
    },
    {
      id: "5",
      description: "Freelance projekt",
      category: "💻",
      amount: 500,
      type: "income" as const,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime(),
      member: user?.displayName || "Korisnik",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">
            {monthYear}
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Bok, {user?.displayName?.split(" ")[0] || "Korisniče"}! 👋
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Evo pregleda vaših financija za ovaj mjesec
          </p>
        </div>
      </Card>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Prihod
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Expenses */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Rashodi
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(stats.expenses)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ArrowDownRight className="text-red-600" size={24} />
            </div>
          </div>
        </Card>

        {/* Balance */}
        <Card className="bg-gray-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-300 uppercase">
                Stanje
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(stats.balance)}
              </p>
            </div>
            <div className="bg-blue-800 p-3 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Transakcije</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stats.transactionCount}
            </p>
          </div>
          <p className="text-4xl">📊</p>
        </div>
      </Card>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Nedavne transakcije
        </h3>
        <Card>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{transaction.category}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.member}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-semibold text-right ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <Card className="bg-gray-50 border-dashed border-2 border-gray-300 p-8">
        <div className="text-center">
          <p className="text-gray-600 font-medium">📈 Grafički prikazi</p>
          <p className="text-sm text-gray-500 mt-1">
            Vizualizacija će biti dostupna uskoro
          </p>
        </div>
      </Card>
    </div>
  );
};

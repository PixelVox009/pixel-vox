interface TransactionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TransactionTabs({ activeTab, onTabChange }: TransactionTabsProps) {
  const transactionTabs = [
    { id: "all", label: "All" },
    { id: "purchased", label: "Purchased" },
    { id: "bonus", label: "Bonus" },
    { id: "token_usage", label: "Token usage" },
  ];

  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {transactionTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors
            ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

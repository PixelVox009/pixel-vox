type Audio = {
  _id: string;
  title: string;
  status: string;
  progress: number;
  audioLink: string;
  completedSegments: number;
  totalSegments: number;
  createdAt: string;
};

type Image = {
  _id: string;
  title: string;
  status: string;
  imageLink: string;
  createdAt: string;
};

type Transaction = {
  _id: string;
  transaction: string;
  oldBalance: number;
  newBalance: number;
  customer: string;
  wallet: string;
  amount: number;
  type: string;
  status: string;
  description: string;
  depositDiscountPercent: number;
  tokensEarned: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type TransactionResponse = {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
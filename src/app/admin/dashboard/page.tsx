"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Info,
  MoreVertical,
  Plus,
  Send,
} from "lucide-react";
import { useState } from "react";

// Mock data for recent contacts
const recentContacts = [
  { id: 1, name: "John Doe", avatar: "JD" },
  { id: 2, name: "Sarah Smith", avatar: "SS" },
  { id: 3, name: "Mike Johnson", avatar: "MJ" },
  { id: 4, name: "Lisa Brown", avatar: "LB" },
  { id: 5, name: "Tom Wilson", avatar: "TW" },
  { id: 6, name: "Emma Davis", avatar: "ED" },
  { id: 7, name: "Alex Taylor", avatar: "AT" },
];

// Monthly data for the chart
const monthlyData = [
  { month: "Jan", value: 10 },
  { month: "Feb", value: 40 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 50 },
  { month: "May", value: 52 },
  { month: "Jun", value: 60 },
  { month: "Jul", value: 70 },
  { month: "Aug", value: 85 },
  { month: "Sep", value: 145 },
];

// Financial statistics
const financialStats = [
  { type: "Income", percentage: "+43%", amount: 6789, color: "bg-emerald-600" },
  { type: "Savings", percentage: "+3%", amount: 1234, color: "bg-yellow-500" },
  { type: "Investment", percentage: "+8%", amount: 1012, color: "bg-cyan-500" },
];

// Yearly statistics data
const yearlyStats = [
  {
    year: "2018",
    values: [
      { type: "Income", value: 75, color: "bg-emerald-600" },
      { type: "Savings", value: 45, color: "bg-yellow-500" },
      { type: "Investment", value: 20, color: "bg-cyan-500" },
    ],
  },
  {
    year: "2019",
    values: [
      { type: "Income", value: 40, color: "bg-emerald-600" },
      { type: "Savings", value: 42, color: "bg-yellow-500" },
      { type: "Investment", value: 20, color: "bg-cyan-500" },
    ],
  },
  {
    year: "2020",
    values: [
      { type: "Income", value: 28, color: "bg-emerald-600" },
      { type: "Savings", value: 22, color: "bg-yellow-500" },
      { type: "Investment", value: 35, color: "bg-cyan-500" },
    ],
  },
  {
    year: "2021",
    values: [
      { type: "Income", value: 40, color: "bg-emerald-600" },
      { type: "Savings", value: 43, color: "bg-yellow-500" },
      { type: "Investment", value: 35, color: "bg-cyan-500" },
    ],
  },
  {
    year: "2022",
    values: [
      { type: "Income", value: 25, color: "bg-emerald-600" },
      { type: "Savings", value: 42, color: "bg-yellow-500" },
      { type: "Investment", value: 30, color: "bg-cyan-500" },
    ],
  },
];

// Detailed contacts
const detailedContacts = [
  {
    id: 1,
    name: "Melanie Noble",
    email: "luella.ryan33@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Melanie",
  },
];

export default function Dashboard() {
  const [transferAmount, setTransferAmount] = useState(200);

  return (
    <div className="p-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Total Balance Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-1 text-gray-500 mb-2">
                <span>Total balance</span>
                <Info size={16} />
              </div>
              <h1 className="text-4xl font-bold">$49,990</h1>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Send size={16} />
                <span>Send</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus size={16} />
                <span>Add card</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowDown size={16} />
                <span>Request</span>
              </Button>
            </div>
          </div>

          {/* Income & Expenses Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-emerald-800 text-white rounded-full">
                      <ArrowDown size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <span>Income</span>
                        <Info size={14} />
                      </div>
                      <p className="text-2xl font-bold">$9,990</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    <ArrowUp size={12} />
                    <span>+8.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-amber-800 text-white rounded-full">
                      <ArrowUp size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <span>Expenses</span>
                        <Info size={14} />
                      </div>
                      <p className="text-2xl font-bold">$1,989</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    <ArrowDown size={12} />
                    <span>-6.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="h-64 w-full">
                <div className="relative h-full w-full">
                  {/* Chart SVG */}
                  <svg className="w-full h-full">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(180, 83, 9)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(180, 83, 9)" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Chart grid lines */}
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 20)"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 55)"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 90)"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 125)"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 160)"
                    />
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="#f1f1f1"
                      strokeDasharray="5,5"
                      transform="translate(0, 195)"
                    />

                    {/* Chart axis values */}
                    <text x="5" y="20" fontSize="10" fill="#888">
                      250
                    </text>
                    <text x="5" y="55" fontSize="10" fill="#888">
                      200
                    </text>
                    <text x="5" y="90" fontSize="10" fill="#888">
                      150
                    </text>
                    <text x="5" y="125" fontSize="10" fill="#888">
                      100
                    </text>
                    <text x="5" y="160" fontSize="10" fill="#888">
                      50
                    </text>
                    <text x="5" y="195" fontSize="10" fill="#888">
                      0
                    </text>

                    {/* Month labels */}
                    {monthlyData.map((item, index) => (
                      <text
                        key={item.month}
                        x={40 + index * ((100 - 8) / (monthlyData.length - 1)) + "%"}
                        y="220"
                        fontSize="10"
                        fill="#888"
                        textAnchor="middle"
                      >
                        {item.month}
                      </text>
                    ))}

                    {/* Line chart */}
                    <path
                      d={`M ${40 + 0 * ((100 - 8) / (monthlyData.length - 1))}% ${
                        195 - (monthlyData[0].value / 250) * 175
                      } 
                        ${monthlyData
                          .slice(1)
                          .map((item, index) => {
                            const x = 40 + (index + 1) * ((100 - 8) / (monthlyData.length - 1));
                            const y = 195 - (item.value / 250) * 175;
                            return `L ${x}% ${y}`;
                          })
                          .join(" ")}`}
                      fill="none"
                      stroke="#b4530a"
                      strokeWidth="2"
                    />

                    {/* Area under the line */}
                    <path
                      d={`M ${40 + 0 * ((100 - 8) / (monthlyData.length - 1))}% ${
                        195 - (monthlyData[0].value / 250) * 175
                      } 
                        ${monthlyData
                          .slice(1)
                          .map((item, index) => {
                            const x = 40 + (index + 1) * ((100 - 8) / (monthlyData.length - 1));
                            const y = 195 - (item.value / 250) * 175;
                            return `L ${x}% ${y}`;
                          })
                          .join(" ")}
                        L ${40 + (monthlyData.length - 1) * ((100 - 8) / (monthlyData.length - 1))}% 195
                        L 40% 195 Z`}
                      fill="url(#gradient)"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Balance Statistics Card with Year Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Balance statistics</CardTitle>
                  <CardDescription className="text-gray-500">Statistics on balance over time</CardDescription>
                </div>
                <Select defaultValue="yearly">
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Yearly" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Categories with color indicators */}
              <div className="flex gap-8 mb-6">
                {financialStats.map((stat) => (
                  <div key={stat.type} className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <div className={`h-3 w-3 rounded-full ${stat.color}`}></div>
                      <span>
                        {stat.type} ({stat.percentage})
                      </span>
                    </div>
                    <p className="text-xl font-semibold">${stat.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Bar Chart */}
              <div className="relative mt-8">
                {/* Y-axis labels */}
                <div className="absolute -left-4 top-0 h-full flex flex-col justify-between text-gray-400 text-xs">
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>
                </div>

                {/* Bars */}
                <div className="h-64 flex justify-between items-end">
                  {yearlyStats.map((yearData) => (
                    <div key={yearData.year} className="flex flex-col items-center">
                      {/* Bars group */}
                      <div className="flex gap-1 h-56 items-end mb-2">
                        {yearData.values.map((item) => (
                          <div
                            key={item.type}
                            className={`w-6 ${item.color}`}
                            style={{ height: `${item.value}%` }}
                          ></div>
                        ))}
                      </div>
                      {/* Year label */}
                      <span className="text-xs text-gray-500">{yearData.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Credit Card Section */}
          <Card className="bg-gray-900 text-white">
            <CardHeader className="pb-0 flex justify-between">
              <CardTitle>Current balance</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <MoreVertical size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View details</DropdownMenuItem>
                  <DropdownMenuItem>Lock card</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Report lost</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <div className="flex flex-col space-y-8">
                <div className="text-3xl font-bold">$23,432.03</div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full h-8 w-12 flex items-center justify-center">
                      <div className="bg-white h-4 w-4 rounded-full"></div>
                    </div>
                    <span className="font-mono">•••• •••• •••• 3640</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-400">Card holder</div>
                    <div>Deja Brady</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Expiration date</div>
                    <div>11/22</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-center space-x-1 pb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-gray-600"></div>
            </div>
          </Card>

          {/* Quick Transfer Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick transfer</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-500">RECENT</div>
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  View all
                  <ChevronRight size={16} />
                </Button>
              </div>

              <div className="flex gap-3 mb-6 overflow-x-auto py-2">
                <div className="bg-gray-500 text-white rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <ChevronLeft size={18} />
                </div>
                {recentContacts.map((contact) => (
                  <Avatar key={contact.id} className="h-12 w-12 bg-gray-200 shrink-0 flex items-center justify-center">
                    {contact.avatar}
                  </Avatar>
                ))}
                <div className="bg-gray-500 text-white rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <ChevronRight size={18} />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">INSERT AMOUNT</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-4xl font-semibold">
                    <span className="text-sm align-top">$</span>
                    {transferAmount}
                  </div>
                </div>
                <Slider
                  value={[transferAmount]}
                  max={1000}
                  step={1}
                  onValueChange={(values) => setTransferAmount(values[0])}
                  className="mb-6"
                />

                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-600">Your balance</div>
                  <div className="font-semibold">$34,212</div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full mb-6">
                  <div className="h-2 bg-emerald-500 rounded-full w-2/5"></div>
                </div>

                <Button className="w-full bg-gray-900 hover:bg-gray-800">Transfer now</Button>
              </div>
            </CardContent>
          </Card>

          {/* Contacts Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Contacts</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm gap-1">
                  View all
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-gray-500 mb-4">You have 122 contacts</div>

              {/* Contact list */}
              <div className="space-y-3">
                {detailedContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <img src={contact.avatar} alt={contact.name} />
                      </Avatar>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

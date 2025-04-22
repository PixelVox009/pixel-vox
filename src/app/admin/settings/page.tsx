"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExchangeRateSettings } from "@/hooks/useExchangeRateSettings";
import { ArrowRight, Eye, EyeOff, Globe, Lock, RefreshCw, Server } from "lucide-react";
import React, { useState } from "react";

const ServerConfigPage: React.FC = () => {
  const { exchangeRates, newExchangeRates, setNewExchangeRates, updateRates, isUpdating } = useExchangeRateSettings();
  const [showImageKey, setShowImageKey] = useState(false);
  const [showAudioKey, setShowAudioKey] = useState(false);
  // Hàm xử lý thay đổi giá trị input
  const handleChange = (field: keyof typeof newExchangeRates, value: string) => {
    setNewExchangeRates((prev) => ({ ...prev, [field]: value }));
  };

  // Hiển thị một phần của API key
  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "*".repeat(key.length);
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server configuration</h1>
          <p className="text-muted-foreground mt-1">Manage server paths and API keys</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Card cho Audio Server */}
        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Audio Server</CardTitle>
                <CardDescription>Configure connection to audio processing server</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="AUDIO_SERVER_URL">URL Server</Label>
                  </div>
                  <Input
                    id="AUDIO_SERVER_URL"
                    value={newExchangeRates.AUDIO_SERVER_URL || ""}
                    onChange={(e) => handleChange("AUDIO_SERVER_URL", e.target.value)}
                    placeholder="http://103.161.113.113:5001"
                    className="font-mono"
                  />
                  {exchangeRates?.AUDIO_SERVER_URL && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <span>Present value:</span>
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">{exchangeRates.AUDIO_SERVER_URL}</code>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="AUDIO_SERVER_KEY">API Key</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="AUDIO_SERVER_KEY"
                      type={showAudioKey ? "text" : "password"}
                      value={newExchangeRates.AUDIO_SERVER_KEY || ""}
                      onChange={(e) => handleChange("AUDIO_SERVER_KEY", e.target.value)}
                      className="font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAudioKey(!showAudioKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showAudioKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {exchangeRates?.AUDIO_SERVER_KEY && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <span>Present value:</span>
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        {maskApiKey(exchangeRates.AUDIO_SERVER_KEY)}
                      </code>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card cho Image Server */}
        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Image Server</CardTitle>
                <CardDescription>Configure connection to image processing server</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="IMAGE_SERVER_URL">URL Server</Label>
                  </div>
                  <Input
                    id="IMAGE_SERVER_URL"
                    value={newExchangeRates.IMAGE_SERVER_URL || ""}
                    onChange={(e) => handleChange("IMAGE_SERVER_URL", e.target.value)}
                    placeholder="http://103.161.113.113:8006"
                    className="font-mono"
                  />
                  {exchangeRates?.IMAGE_SERVER_URL && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <span>Present value:</span>
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">{exchangeRates.IMAGE_SERVER_URL}</code>
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="IMAGE_SERVER_KEY">API Key</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="IMAGE_SERVER_KEY"
                      type={showImageKey ? "text" : "password"}
                      value={newExchangeRates.IMAGE_SERVER_KEY || ""}
                      onChange={(e) => handleChange("IMAGE_SERVER_KEY", e.target.value)}
                      className="font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowImageKey(!showImageKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showImageKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {exchangeRates?.IMAGE_SERVER_KEY && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <span>Present value:</span>
                      <code className="px-1 py-0.5 bg-muted rounded text-xs">
                        {maskApiKey(exchangeRates.IMAGE_SERVER_KEY)}
                      </code>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button cập nhật */}
        <div className="flex justify-end mt-2">
          <Button onClick={updateRates} disabled={isUpdating} size="lg" className="gap-2">
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Update configuration
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerConfigPage;

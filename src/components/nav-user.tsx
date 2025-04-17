"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useChangePassword } from "@/hooks/useChangePassword"; // Import change password hook
import { useUserData } from "@/hooks/useUserData"; // Import custom hook
import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react"; // Import signOut function for logout functionality
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface FormDataType {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isLoading } = useUserData();
  const { changePassword, isLoading: isPasswordChanging, error, success, resetStates } = useChangePassword();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleLogout = () => {
    const baseUrl = window.location.origin;
    signOut({ callbackUrl: `${baseUrl}/login` });
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous states
    setValidationError("");

    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError("Mật khẩu mới không khớp với xác nhận mật khẩu");
      return;
    }

    if (formData.newPassword.length < 6) {
      setValidationError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    const result = await changePassword(formData.currentPassword, formData.newPassword);

    if (result) {
      if (typeof toast !== "undefined") {
        toast.success(success || "Đổi mật khẩu thành công");
      }
      setIsPasswordModalOpen(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationError("");
      resetStates();
    }
    setIsPasswordModalOpen(open);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {isLoading ? "..." : data?.name?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.name}</span>
                  <span className="truncate text-xs">{data?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{data?.name?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data?.name}</span>
                    <span className="truncate text-xs">{data?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsPasswordModalOpen(true)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Change password
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={isPasswordModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handlePasswordChange}>
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>Enter your current password and your new password.</DialogDescription>
            </DialogHeader>
            {(validationError || error) && (
              <div className="mb-4 mt-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {validationError || error}
              </div>
            )}
            {success && !error && (
              <div className="mb-4 mt-2 rounded-md bg-green-100 p-3 text-sm text-green-800">{success}</div>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPasswordChanging}>
                {isPasswordChanging ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

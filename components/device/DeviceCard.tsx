"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTerminal2 } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { DeviceActionMenu } from "./DeviceActionMenu";
import { truncateId } from "@/utils/device";

import type { Device } from "@/types/device";

interface Props {
  device: Device;
  isOnline: boolean;
  isPowerOn: boolean;
  onTogglePower: (device: Device, value: boolean) => void;
  onOpenLogs: (device: Device) => void;
  onOpenEdit: (device: Device) => void;
  onOpenDelete: (device: Device) => void;
  onOpenAssign: (device: Device) => void;
}

export const DeviceCard = ({
  device,
  isOnline,
  isPowerOn,
  onTogglePower,
  onOpenLogs,
  onOpenEdit,
  onOpenDelete,
  onOpenAssign,
}: Props) => {
  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(`${label} copied to clipboard`);
    } catch (err) {
      toast.error("Failed to copy");
      console.error("Clipboard copy failed", err);
    }
  };

  const renderInfo = (
    label: string,
    value?: string | null,
    display?: string | null
  ) => {
    const raw = value ?? "-";
    const shown = display ?? raw;
    const clickableValue = raw.toString();

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <p
            className="text-xs text-muted-foreground truncate cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => handleCopy(label, clickableValue)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCopy(label, clickableValue);
              }
            }}
          >
            <span className="font-medium text-foreground">{label}:</span>{" "}
            {shown}
          </p>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p className="max-w-xs text-xs">{raw}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const gps =
    device.latitude != null && device.longitude != null
      ? `${device.latitude}, ${device.longitude}`
      : null;

  return (
    <div
      aria-disabled={!isOnline}
      data-disabled={!isOnline}
      className={cn(
        "rounded-xl border p-4 shadow-sm flex flex-col gap-3 bg-card transition-all",
        isOnline ? "border-border" : "border-red-500/60 bg-muted/40",
        !isOnline && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">
            {device.name ?? truncateId(device.id)}
          </h3>
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className="mt-1 capitalize"
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        <DeviceActionMenu
          device={device}
          onEdit={onOpenEdit}
          onAssign={onOpenAssign}
          onDelete={onOpenDelete}
          onViewLogs={onOpenLogs}
        />
      </div>

      <div className="space-y-1.5">
        {renderInfo("ID", device.id, truncateId(device.id))}
        {renderInfo("Serial", device.serial || "-")}
        {renderInfo("Location", device.location || "-")}
        {renderInfo("Last seen", device.lastSeen || "-")}
        {renderInfo("Desc", device.description || "-")}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Power {isPowerOn ? "On" : "Off"}</p>

        <Switch
          checked={isPowerOn}
          onCheckedChange={(val) => onTogglePower(device, val)}
          disabled={!isOnline}
        />
      </div>

      <Button className="w-full" onClick={() => onOpenLogs(device)}>
        <IconTerminal2 className="size-4" />
        View Logs
      </Button>
    </div>
  );
};

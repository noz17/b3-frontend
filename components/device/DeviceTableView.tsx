"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import type { Device } from "@/types/device";
import type { DeviceGroup } from "@/types/group";
import { DeviceActionMenu } from "./DeviceActionMenu";
import { cn } from "@/lib/utils";

interface Props {
  groups: DeviceGroup[];
  powerMap: Record<string, boolean>;
  connectionMap: Record<string, "online" | "offline">;

  onTogglePower: (device: Device, checked: boolean) => void;
  onToggleGroup: (group: DeviceGroup, checked: boolean) => void;
  onDelete: (device: Device) => void;
  onViewLogs: (device: Device) => void;
  onEdit: (device: Device) => void;
  onAssign: (device: Device) => void;

  logs: Record<string, any[]>;
  groupToggleState: Record<string, boolean>;
  groupToggleLoading: Record<string, boolean>;
}

export const DeviceTableView = ({
  groups,
  powerMap,
  connectionMap,
  onTogglePower,
  onToggleGroup,
  onDelete,
  onViewLogs,
  onEdit,
  onAssign,
  logs,
  groupToggleState,
  groupToggleLoading,
}: Props) => {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Device Row View</CardTitle>
        <CardDescription>
          Tabel komprehensif untuk audit cepat antar group.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Device</TableHead>
              <TableHead>Serial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups.map((group) => (
              <GroupSection
                key={group.id}
                group={group}
                powerMap={powerMap}
                connectionMap={connectionMap}
                onTogglePower={onTogglePower}
                onToggleGroup={onToggleGroup}
                onDelete={onDelete}
                onViewLogs={onViewLogs}
                onEdit={onEdit}
                onAssign={onAssign}
                logs={logs}
                groupToggleState={groupToggleState}
                groupToggleLoading={groupToggleLoading}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/*                                GROUP SECTION                                */
/* -------------------------------------------------------------------------- */

const GroupSection = ({
  group,
  powerMap,
  connectionMap,
  onTogglePower,
  onToggleGroup,
  onDelete,
  onViewLogs,
  onEdit,
  onAssign,
  logs,
  groupToggleState,
  groupToggleLoading,
}: {
  group: DeviceGroup;
  powerMap: Record<string, boolean>;
  connectionMap: Record<string, "online" | "offline">;
  onTogglePower: (device: Device, checked: boolean) => void;
  onToggleGroup: (group: DeviceGroup, checked: boolean) => void;
  onDelete: (device: Device) => void;
  onViewLogs: (device: Device) => void;
  onEdit: (device: Device) => void;
  onAssign: (device: Device) => void;
  logs: Record<string, any[]>;
  groupToggleState: Record<string, boolean>;
  groupToggleLoading: Record<string, boolean>;
}) => {
  const renderCell = (
    value: string | number | null | undefined,
    className?: string
  ) => {
    const text = value == null ? "-" : String(value);
    const truncated = text.length > 25 ? `${text.slice(0, 25)}…` : text;
    return (
      <span
        title={text}
        className={cn("block max-w-[220px] truncate", className)}
      >
        {truncated}
      </span>
    );
  };

  const isAllGroup = group.id === "all";
  const fallbackChecked =
    group.devices.length > 0 &&
    group.devices.every((device) => powerMap[device.id]);
  const checked = groupToggleState[group.id] ?? fallbackChecked;
  const disabled =
    isAllGroup ||
    group.devices.length === 0 ||
    groupToggleLoading[group.id];

  return (
    <>
      {/* Group Label */}
      <TableRow className="bg-muted/50">
        <TableCell colSpan={5} className="pl-6 font-semibold">
          <div className="flex items-center justify-between">
            <div>
              {renderCell(group.name, "font-semibold max-w-none")}
              <p className="text-xs font-normal text-muted-foreground">
                {group.devices.length} device{group.devices.length === 1 ? "" : "s"}
              </p>
            </div>
            {!isAllGroup ? (
              <Switch
                checked={checked}
                disabled={disabled}
                onCheckedChange={(value) => onToggleGroup(group, value)}
              />
            ) : null}
          </div>
        </TableCell>
      </TableRow>

      {/* Devices */}
      {group.devices.map((device) => {
        const serialKey = device.serial || device.id;

        const isOnline = connectionMap[serialKey] === "online";
        const isPowerOn = powerMap[device.id] ?? false;

        const lastLog = logs[serialKey]?.slice(-1)[0];

        return (
          <TableRow key={device.id}>
            {/* DEVICE NAME */}
            <TableCell className="pl-6">
              <p className="flex items-center gap-2 font-medium">
                <span>{isOnline ? "🟢" : "🔴"}</span>
                {renderCell(device.name)}
              </p>
              <p className="text-xs text-muted-foreground">
                {renderCell(device.id, "max-w-[180px]")}
              </p>
            </TableCell>

            {/* SERIAL */}
            <TableCell>{renderCell(device.serial)}</TableCell>

            {/* POWER STATUS */}
            <TableCell>
              <Badge
                variant={isPowerOn ? "secondary" : "outline"}
                className={
                  isPowerOn
                    ? "bg-emerald-600 text-white capitalize"
                    : "border-rose-500 text-rose-600 capitalize"
                }
              >
                {isPowerOn ? "ON" : "OFF"}
              </Badge>
            </TableCell>

            {/* LOCATION */}
            <TableCell>{renderCell(device.location)}</TableCell>

            {/* ACTIONS */}
            <TableCell className="pr-6 text-right">
              <div className="flex items-center justify-end gap-3">
                {/* CONNECTION STATE */}
                <span className="text-[11px] text-muted-foreground">
                  {isOnline ? "Connected" : "Disconnected"}
                </span>

                {/* TOGGLE POWER */}
                <Switch
                  disabled={!isOnline}
                  checked={isPowerOn}
                  onCheckedChange={(checked) => onTogglePower(device, checked)}
                />

                {/* LAST LOG PREVIEW */}
                {lastLog ? (
                  <div className="flex flex-col gap-1 text-right text-[11px] text-muted-foreground max-w-[260px]">
                    <div className="flex justify-end gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {lastLog.type}
                      </Badge>
                      <span title={lastLog.message} className="truncate">
                        {lastLog.message?.length > 25
                          ? `${lastLog.message.slice(0, 25)}…`
                          : lastLog.message}
                      </span>
                    </div>
                  </div>
                ) : null}

                {/* DROPDOWN ACTION MENU */}
                <DeviceActionMenu
                  device={device}
                  onDelete={onDelete}
                  onViewLogs={onViewLogs}
                  onEdit={onEdit}
                  onAssign={onAssign}
                  disabledActions={!isOnline}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { WEB_BASE_URL } from "@plane/constants";
import { NewTabIcon } from "@plane/propel/icons";
import { Tooltip } from "@plane/propel/tooltip";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";
import { ToggleSwitch } from "@plane/ui";
import { getFileURL } from "@plane/utils";
import { useWorkspace } from "@/hooks/store";
import { useInstance } from "@/hooks/store";

type TWorkspaceListItemProps = {
  workspaceId: string;
  isWorkspaceCreationDisabled: boolean;
};

export const WorkspaceListItem = observer(function WorkspaceListItem({ workspaceId, isWorkspaceCreationDisabled }: TWorkspaceListItemProps) {
  const { getWorkspaceById } = useWorkspace();
  const { formattedConfig, updateInstanceConfigurations } = useInstance();
  const workspace = getWorkspaceById(workspaceId);
  const autoJoinSlugs = (formattedConfig?.DEFAULT_WORKSPACE_SLUGS ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const isAutoJoin = autoJoinSlugs.includes(workspace?.slug ?? "");
  if (!workspace) return null;

  const handleAutoJoinToggle = async () => {
    let newSlugs: string[];
    if (isAutoJoin) {
      newSlugs = autoJoinSlugs.filter(s => s !== workspace.slug);
    } else {
      newSlugs = [...autoJoinSlugs, workspace.slug];
    }
    await updateInstanceConfigurations({ DEFAULT_WORKSPACE_SLUGS: newSlugs.join(",") });
    setToast({
      type: TOAST_TYPE.SUCCESS,
      title: "Saved",
      message: isAutoJoin ? "Auto-assign disabled." : `New users will auto-join ${workspace.name}.`,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`${WEB_BASE_URL}/${encodeURIComponent(workspace.slug)}`}
        target="_blank"
        className="group flex flex-1 items-center justify-between gap-2.5 truncate rounded-lg border border-subtle bg-layer-1 p-3 hover:border-subtle-1 hover:bg-layer-1-hover hover:shadow-raised-100"
        rel="noreferrer"
      >
        <div className="flex items-start gap-4">
          <span
            className={`relative mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center p-2 text-11 uppercase ${
              !workspace?.logo_url && "rounded-lg bg-accent-primary text-on-color"
            }`}
          >
            {workspace?.logo_url && workspace.logo_url !== "" ? (
              <img
                src={getFileURL(workspace.logo_url)}
                className="absolute top-0 left-0 h-full w-full rounded-sm object-cover"
                alt="Workspace Logo"
              />
            ) : (
              (workspace?.name?.[0] ?? "...")
            )}
          </span>
          <div className="flex flex-col items-start gap-1">
            <div className="flex w-full flex-wrap items-center gap-2.5">
              <h3 className="text-14 font-medium capitalize">{workspace.name}</h3>/
              <Tooltip tooltipContent="The unique URL of your workspace">
                <h4 className="text-13 text-tertiary">[{workspace.slug}]</h4>
              </Tooltip>
            </div>
            {workspace.owner.email && (
              <div className="flex items-center gap-1 text-11">
                <h3 className="font-medium text-secondary">Owned by:</h3>
                <h4 className="text-tertiary">{workspace.owner.email}</h4>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-11">
              {workspace.total_projects !== null && (
                <span className="flex items-center gap-1">
                  <h3 className="font-medium text-secondary">Total projects:</h3>
                  <h4 className="text-tertiary">{workspace.total_projects}</h4>
                </span>
              )}
              {workspace.total_members !== null && (
                <>
                  •
                  <span className="flex items-center gap-1">
                    <h3 className="font-medium text-secondary">Total members:</h3>
                    <h4 className="text-tertiary">{workspace.total_members}</h4>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <NewTabIcon width={14} height={16} className="text-placeholder group-hover:text-secondary" />
        </div>
      </a>
      <div
        className="w-20 flex justify-center flex-shrink-0"
        title={!isWorkspaceCreationDisabled ? "Enable 'Prevent workspace creation' first" : isAutoJoin ? "Disable auto-assign" : "Enable auto-assign for new users"}
      >
        <ToggleSwitch
          value={isAutoJoin}
          onChange={isWorkspaceCreationDisabled ? handleAutoJoinToggle : () => {}}
          size="sm"
          disabled={!isWorkspaceCreationDisabled}
        />
      </div>
    </div>
  );
});

import { Checkbox } from "@/components/ui/checkbox";
const permissionColumns = (action,form) => 
    
    {
        return [
            {
              id: "resource",
              accessorKey: "resource",
              header: "Permission Group",
            }, 
            {
              id: "actions",
              header: "Permissions",
              cell: ({ row }) => {
                const groupChild = row.original.group_child || [];
          
                return (
                  <div className="flex flex-wrap gap-1">
                    {groupChild.map((child, index) => {
                      const checkboxId = `permission-${row.original.resource}-${child.id}`;
          
                      return (
                        <div key={index} className="flex items-center gap-2">
                        <Checkbox
                          id={checkboxId}
                          value={child.id}
                          checked={form?.watch("selectedPermission")?.includes(child.id) || false}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("selectedPermission") || [];
                      
                            if (checked) {
        
                              if (!current.includes(child.id)) {
                                form.setValue("selectedPermission", [...current, child.id]);
                              }
                            } else {
                             
                              form.setValue(
                                "selectedPermission",
                                current.filter((id) => id !== child.id)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={checkboxId}
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          {child.display_name}
                        </label>
                      </div>
                      
                      );
                    })}
                  </div>
                );
              },
            },
            {
              id: "check-all",
              header: "Check All",
              cell: ({ row }) => {
                const groupChild = row.original.group_child || [];
                const selected = form?.watch("selectedPermission") || [];

                // Check if all permissions in this group are selected
                const allChecked = groupChild.every((child) => selected.includes(child.id));

                const handleCheckAll = (checked) => {
                  const current = form.getValues("selectedPermission") || [];
                  if (checked) {
                    // Add all child IDs if not already included
                    const newSelected = [...new Set([...current, ...groupChild.map(c => c.id)])];
                    form.setValue("selectedPermission", newSelected);
                  } else {
                    // Remove all child IDs from selected
                    form.setValue(
                      "selectedPermission",
                      current.filter((id) => !groupChild.some(c => c.id === id))
                    );
                  }
                };

                return (
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={handleCheckAll}
                  />
                );
              },
            },
          ];
    }

  
  export default permissionColumns;
  
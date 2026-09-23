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
              accessorKey: "check-all",
              header: "Check All",
            },
          ];
    }

  
  export default permissionColumns;
  
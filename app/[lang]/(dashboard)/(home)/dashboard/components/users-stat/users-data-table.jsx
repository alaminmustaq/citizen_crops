"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { translate } from "@/lib/utils";
import { useAppSelector } from "@/hooks/use-redux";

const UsersDataTable = ({ toolSnapshotTable }) => {
    const translation_state = useSelector((state) => state.auth.translation);
    const { user } = useAppSelector((state) => state.auth); 
    const roleName = user?.user?.roles?.length > 0 ? user?.user?.roles[0].name : "No Role";
    const level = user?.user?.roles?.length > 0 ? user?.user?.roles[0].level : "No Role";
    return (
        <div className="h-[250px]">
            <ScrollArea className="h-full">
                <Table className="border border-border">
                    <TableHeader>
                        <TableRow className="border-b border-border">
                            <TableHead className="text-sm h-10 font-medium text-default-800">
                                {level == 0 && roleName == "root_admin" ? translate(
                                    "Company",
                                    translation_state
                                ) : translate(
                                    "Distribution Type",
                                    translation_state
                                )}
                            </TableHead>
                            <TableHead className="text-sm h-10 font-medium text-default-800 text-right">
                                {level == 0 && roleName == "root_admin" ? translate(
                                    "Employee count",
                                    translation_state
                                ) : translate(
                                    "Quantity",
                                    translation_state
                                )} 
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {toolSnapshotTable?.map((item) => (
                            <TableRow
                                key= {translate(
                                    item.id,
                                    translation_state
                                )}
                                className="border-b border-border"
                            >
                                <TableCell className="text-xs text-default-600 py-2">
                                  {translate(
                                    item.type,
                                    translation_state
                                )}
                                    
                                </TableCell>
                                <TableCell className="text-xs text-default-600 text-right pr-6 py-2">
                                   {translate(
                                    item.count,
                                    translation_state
                                )}
                                
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
};

export default UsersDataTable;

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "../config/columns";
import { useDocument } from "@/domains/document/hook/useDocument";
import { useAppSelector } from "@/hooks/use-redux";
import { useEffect, useState } from "react";

const DocumentDetails = () => {
    const { actions, documentsState } = useDocument();
    const documentData = useAppSelector(state => state.document);

    // console.log("Document Data in Details:", documentData);


    return (
        <Card className="w-full">
            <CardHeader className="border-none mb-0">
                <CardTitle className="text-lg font-semibold text-default-800 tracking-tight">
                    Document Details
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <BasicTableLayout
                    columns={columns(actions)}
                    state={{
                     data:  documentData?.documentData?.documents?.document_details ,
                        isFetching: documentsState.isFetching,
                        pagination: true,
                        isFetching: false,
                    }}
                    searchKey="document_detail"
                />
            </CardContent>
        </Card>
    );
};

export default DocumentDetails;



export const commonSearchTemplate = (res) => {
    return res.map((data) => ({
        label: data.name + " (" + data.code + ")",
        value: data.id,
    }));
};
export const companySearchTemplate = (res) => {
    return res.map((company) => ({
        label: company.name + " (" + company.code + ")",
        value: company.id,
    }));
};
export const branchSearchTemplate = (res) => {
    return res.map((branch) => ({
        label: branch.name + " (" + branch.code + ")",
        value: branch.id,
    }));
};
export const projectTemplate = (res) => {
    return res.map((project) => ({
        label: project.name,
        value: project.id,
    }));
};

export const departmentSearchTemplate = (res) => {
    return res.map((data) => ({
        label: data.name + " (" + data.code + ")",
        value: data.id,
    }));
};

export const jobPositionsTemplate = (res) => {
    return res.map((data) => ({
        label: data.title + " (" + data.code + ")",
        value: data.id,
    }));
};
export const employTemplate = (res) => {
    return res.map((data) => ({
        label: `${data?.personal_info?.first_name ?? data.first_name} ${
            data?.personal_info?.last_name ?? data.last_name
        } (${data?.contact_info?.work_email ?? data?.work_email})`,
        value: data.id,
    }));
};

export const documentTypeTemplate = (res) => {
    return res.map((data) => ({
        label: data.name,
        value: data.id,
    }));
};

export const roleTemplate = (res) => {
    return res.map((data) => ({
        label: data.display_name,
        value: data.id,
    }));
};

// templates/clientTemplate.js
export const clientTemplate = (res) => {
    return res.map((client) => ({
        label: client.name + " (" + client.email + ")",
        value: client.id,
    })); // what is stored in form
};

// templates/categoryTemplate.js
export const categorySearchTemplate = (res) => {
    return res.map((category) => ({
        label: category.name,
        value: category.id,
    })); // what is stored in form
};

export const warehouseSearchTemplate = (res) => {
    return res.map((warehouse) => ({
        label: warehouse.name,
        value: warehouse.id,
    })); // what is stored in form
};

// templates/unitTemplate.js
export const unitSearchTemplate = (res) => {
    return res.map((unit) => ({
        label: unit.name,
        value: unit.id,
    })); // what is stored in form
};

// templates/toolTemplate.js
export const toolSearchTemplate = (res) => {
    return res.map((tool) => ({
        label: tool.name + (tool.sku ? " (" + tool.sku + ")" : ""),
        value: tool.id,
        stock: tool?.company_stock ? tool?.company_stock?.quantity ?? 0 : 0,
        unit_price: tool?.company_stock ? tool?.company_stock?.unit_price ?? 0 : 0,
    })); // what is stored in form
};

// templates/purchaseTemplate.js
export const purchaseSearchTemplate = (res) => {
    return res.map((purchase) => ({
        label: purchase.name,
        value: purchase.id,
    })); // what is stored in form
};
// templates/purchaseTemplate.js
export const receivePaymentTemplate = (res) => {
    return res.map((item) => ({
        label: item.name,
        value: item.id,
    })); // what is stored in form
};
export const bankTemplate = (res) => {
    return res.flatMap((item) =>
        item.branches.map((branch) => ({
            label: `Bank: ${item.bank_name} | Branch: ${branch.branch_name} | Account Holder: ${branch.account_holder_name} | Account No: ${branch.account_no}`,
            value: branch.id,
            bank_id: item.id,
        }))
    );
};

import CustomerDebtsPaginated from '../components/CustomerDebtsPaginated';

export function CustomerDebtsPage({customer, updateCustomerFromDebtsBool = f => f}) {
    return (
        <>
            <div>
                <CustomerDebtsPaginated 
                    customer={customer}
                    updateCustomerFromDebtsBool={updateCustomerFromDebtsBool}
                />
            </div>
        </>
    );
}
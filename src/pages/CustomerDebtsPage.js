import CustomerDebtsPaginated from '../components/CustomerDebtsPaginated';

export function CustomerDebtsPage({customer}) {
    return (
        <>
            <div>
                <CustomerDebtsPaginated 
                    customer={customer}
                />
            </div>
        </>
    );
}
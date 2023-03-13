import CustomersPaginated from '../components/CustomersPaginated';

export function CustomersPage({cust_id, thereAreCustomersWithDebt}) {
    return (
        <>
            <div>
                <CustomersPaginated 
                    itemsPerPage={7} 
                    cust_id={cust_id}
                    thereAreCustomersWithDebt={thereAreCustomersWithDebt}
                />
            </div>
        </>
    );
}
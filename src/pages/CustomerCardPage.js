import CustomerCard from "../components/CustomerCard";

function CustomerCardPage({customer, updateCustomerFromDebtsBool}) {

    return (
        <CustomerCard 
            customerInit = {customer}
            updateCustomerFromDebtsBool = {updateCustomerFromDebtsBool}
        />
    );
}

export default CustomerCardPage;
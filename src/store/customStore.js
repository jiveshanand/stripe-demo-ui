import create from 'zustand';

const useCustomerStore = create((set) => ({
  selectedCustomer: null,
  setSelectedCustomer: (customer) => {
    console.log(customer, 'customer in store');
    return set({ selectedCustomer: customer });
  },
}));

export default useCustomerStore;
